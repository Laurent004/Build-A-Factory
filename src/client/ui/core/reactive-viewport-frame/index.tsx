import React, { forwardRef, useRef } from "@rbxts/react";
import { ViewportFrame, ViewportFrameProps } from "../viewport-frame";
import { useMountEffect,useMotion } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { springs } from "../../constants";

export interface ReactiveViewportFrameProps extends ViewportFrameProps {
	defaultCameraPitch: number;
	defaultCameraOffset: CFrame;
	hoverCameraPitch: number;
	hoverCameraOffset: CFrame;
	cameraRotationSpeed: number;
}

export const ReactiveViewportFrame = forwardRef((props: ReactiveViewportFrameProps, ref: React.Ref<ViewportFrame>) => {
	const viewportFrameRef = useRef<ViewportFrame>();
	const [cameraPitch, cameraPitchMotion] = useMotion(props.defaultCameraPitch);
	const [cameraOffset, cameraOffsetMotion] = useMotion(props.defaultCameraOffset);

	useMountEffect(() => {
		const camera = new Instance("Camera");
		camera.Parent = viewportFrameRef.current;
		viewportFrameRef.current!.CurrentCamera = camera;

		let yaw: number = 0;
		RunService.Heartbeat.Connect((dt: number) => {
			const currentPitch = cameraPitch.getValue();
			const currentOffset = cameraOffset.getValue();

			yaw += dt * props.cameraRotationSpeed;
			const orientation = CFrame.fromEulerAnglesYXZ(math.rad(currentPitch), math.rad(yaw), 0);
			camera.CFrame = new CFrame().mul(orientation).mul(currentOffset);
		});
	});

	return (
		<ViewportFrame
			ref={(instance) => {
				viewportFrameRef.current = instance ?? undefined;
				if (typeIs(ref, "function")) {
					ref(instance);
				} else if (ref) {
					(ref as React.MutableRefObject<ViewportFrame | undefined>).current = instance ?? undefined;
				}
			}}
			ambient={props.ambient}
			lightColor={props.lightColor}
			lightDirection={props.lightDirection}
			anchorPoint={props.anchorPoint}
			position={props.position}
			size={props.size}
			imageColor={props.imageColor}
			imageTransparency={props.imageTransparency}
			event={{
				MouseEnter: () => {
					cameraPitchMotion.spring(props.hoverCameraPitch, springs.slow);
					cameraOffsetMotion.spring(props.hoverCameraOffset, springs.slow);
				},
				MouseLeave: () => {
					cameraPitchMotion.spring(props.defaultCameraPitch, springs.slow);
					cameraOffsetMotion.spring(props.defaultCameraOffset, springs.slow);
				},
			}}
		></ViewportFrame>
	);
});
