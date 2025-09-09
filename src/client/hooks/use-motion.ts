import { createMotion, Motion, MotionGoal } from "@rbxts/ripple";
import { Binding, useBinding, useEffect, useMemo } from "@rbxts/react";
import { useLatestCallback } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";

export function useMotion<T = number>(
	goal: number,
	mapper?: (value: number) => T,
): LuaTuple<[Binding<T>, Motion<number>]>;

export function useMotion<T extends MotionGoal, U = T>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<U>, Motion<T>]>;

//U=T or just U ?
export function useMotion<T extends MotionGoal, U = T>(goal: T, mapper?: (value: T) => U) {
	const motion = useMemo(() => {
		return createMotion(goal);
	}, []);

	const getMotionValue = useLatestCallback(() => {
		const motionValue = motion.get();
		return mapper ? mapper(motionValue) : motionValue;
	});

	const [binding, setBinding] = useBinding(getMotionValue());

	useEffect(() => {
		setBinding(getMotionValue());
	}, [mapper]);

	useEffect(() => {
		const connection = RunService.Heartbeat.Connect((dt: number) => {
			motion.step(dt);
			setBinding(getMotionValue());
		});

		return () => {
			connection.Disconnect();
			motion.destroy();
		};
	}, [motion]);

	return $tuple(binding, motion);
}
