import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Binding } from "@rbxts/react";
import { springs } from "client/constants/springs";
import { useMotion } from "client/hooks";

export interface ButtonAnimation {
	readonly hover: Binding<number>;
	readonly hoverExclusive: Binding<number>;
	readonly press: Binding<number>;
	readonly position: Binding<number>;
}

export function useButtonAnimation(hovered: boolean, pressed: boolean): ButtonAnimation {
	const [hover, hoverMotion] = useMotion(0);
	const [hoverExclusive, hoverExclusiveMotion] = useMotion(0);
	const [press, pressMotion] = useMotion(0);
	const [position, positionMotion] = useMotion(0);

	useUpdateEffect(() => {
		hoverExclusiveMotion.spring(hover && !pressed ? 1 : 0, springs.responsive);
		pressMotion.spring(pressed ? 1 : 0, springs.responsive);
	}, [hovered, pressed]);

	useUpdateEffect(() => {
		hoverMotion.spring(hovered ? 1 : 0, springs.responsive);
	}, [hovered]);

	useUpdateEffect(() => {
		if (hovered) {
			positionMotion.spring(-1, springs.responsive);
		} else {
			positionMotion.spring(1, springs.responsive);
		}
	}, [hovered]);

	useUpdateEffect(() => {
		if (pressed) {
			//Hovered and pressed
			positionMotion.spring(1, springs.responsive);
		} else if (hover) {
			//Pressed and hovering
			positionMotion.spring(-1, springs.responsive);
		}
	}, [pressed]);

	return {
		hover: hover,
		hoverExclusive: hoverExclusive,
		press: press,
		position: position,
	};
}
