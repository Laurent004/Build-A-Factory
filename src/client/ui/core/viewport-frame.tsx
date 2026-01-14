import React, { forwardRef, useEffect, useRef } from "@rbxts/react";
import { useMotion } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { springs } from "../constants";
import Make from "@rbxts/make";

interface ViewportFrameProps extends React.InstanceProps<ViewportFrame> {
	cameraRotationSpeed?: number;
	defaultCameraPitch?: number;
	defaultCameraOffset?: CFrame;
	hoverCameraPitch?: number;
	hoverCameraOffset?: CFrame;
}

export const ViewportFrame = forwardRef<ViewportFrame, ViewportFrameProps>((props, ref) => {
	const {
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		cameraRotationSpeed,
		defaultCameraPitch = 0,
		defaultCameraOffset = CFrame.identity,
		hoverCameraPitch,
		hoverCameraOffset,
	} = props;
	const localRef = useRef<ViewportFrame>();
	const [cameraPitch, cameraPitchMotion] = useMotion(defaultCameraPitch ?? 0);
	const [cameraOffset, cameraOffsetMotion] = useMotion(defaultCameraOffset ?? CFrame.identity);

	useEffect(() => {
		if (cameraRotationSpeed === undefined || localRef.current === undefined) return;
		const camera = Make("Camera", { Parent: localRef.current });
		localRef.current!.CurrentCamera = camera;
		let yaw: number = 0;
		RunService.Heartbeat.Connect((dt) => {
			yaw += dt * cameraRotationSpeed!;
			camera.CFrame = CFrame.identity
				.mul(CFrame.fromEulerAnglesYXZ(math.rad(cameraPitch.getValue()), math.rad(yaw), 0))
				.mul(cameraOffset.getValue());
		});
	}, [localRef.current]);

	return (
		<viewportframe
			ref={(viewportFrame) => {
				localRef.current = viewportFrame;
				if (typeIs(ref, "function")) {
					ref(viewportFrame);
				} else if (ref) {
					ref.current = viewportFrame;
				}
			}}
			Archivable={props.Archivable}
			Active={props.Active}
			AnchorPoint={props.AnchorPoint}
			AutomaticSize={props.AutomaticSize}
			BackgroundColor3={props.BackgroundColor3}
			BackgroundTransparency={BackgroundTransparency}
			BorderColor3={props.BorderColor3}
			BorderMode={props.BorderMode}
			BorderSizePixel={BorderSizePixel}
			Interactable={props.Interactable}
			LayoutOrder={props.LayoutOrder}
			Position={props.Position}
			Rotation={props.Rotation}
			Size={props.Size}
			SizeConstraint={props.SizeConstraint}
			Visible={props.Visible}
			ZIndex={props.ZIndex}
			ClipsDescendants={props.ClipsDescendants}
			AutoLocalize={props.AutoLocalize}
			RootLocalizationTable={props.RootLocalizationTable}
			NextSelectionDown={props.NextSelectionDown}
			NextSelectionLeft={props.NextSelectionLeft}
			NextSelectionRight={props.NextSelectionRight}
			NextSelectionUp={props.NextSelectionUp}
			Selectable={props.Selectable}
			SelectionGroup={props.SelectionGroup}
			SelectionOrder={props.SelectionOrder}
			Event={{
				...props.Event,
				MouseEnter: (rbx, x, y) => {
					props.Event?.MouseEnter?.(rbx, x, y);
					if (hoverCameraPitch !== undefined) {
						cameraPitchMotion.spring(hoverCameraPitch, springs.slow);
					}
					if (hoverCameraOffset !== undefined) {
						cameraOffsetMotion.spring(hoverCameraOffset, springs.slow);
					}
				},
				MouseLeave: (rbx, x, y) => {
					props.Event?.MouseEnter?.(rbx, x, y);
					if (defaultCameraPitch !== undefined) {
						cameraPitchMotion.spring(defaultCameraPitch, springs.slow);
					}
					if (defaultCameraOffset !== undefined) {
						cameraOffsetMotion.spring(defaultCameraOffset, springs.slow);
					}
				},
			}}
			Change={props.Change}
			Ambient={props.Ambient}
			LightColor={props.LightColor}
			LightDirection={props.LightDirection}
			SelectionImageObject={props.SelectionImageObject}
		>
			{props.children}
		</viewportframe>
	);
});
