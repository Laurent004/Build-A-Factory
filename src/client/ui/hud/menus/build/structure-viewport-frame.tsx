import React, { useEffect, useRef } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useMotion } from "client/hooks";
import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { springs } from "client/constants/springs";
import { RunService } from "@rbxts/services";

import { ViewportFrame } from "client/ui/core/viewport-frame";
import { selectBuildMenuStructureName } from "client/store/menus/build";
import { STRUCTURES } from "shared/constants/structures";
import { Button } from "client/ui/core/button";

const DEFAULT_CAMERA_PITCH = -15;
const DEFAULT_CAMERA_OFFSET = new CFrame(0, 0.7, 5.5);
const HOVER_CAMERA_PITCH = -24;
const HOVER_CAMERA_OFFSET = new CFrame(0, 1, 8.5);
const CAMERA_ROTATION_SPEED = 15;
const STRUCTURE_CF = new CFrame(0, 1, 0);

export function StructureViewportFrame() {
	const structureName = useSelector(selectBuildMenuStructureName);
	const viewportFrameRef = useRef<ViewportFrame>();
	const [cameraPitch, cameraPitchMotion] = useMotion(DEFAULT_CAMERA_PITCH);
	const [cameraOffset, cameraOffsetMotion] = useMotion(DEFAULT_CAMERA_OFFSET);

	useMountEffect(() => {
		if (viewportFrameRef.current) {
			const newCamera = new Instance("Camera");
			newCamera.Parent = viewportFrameRef.current;
			viewportFrameRef.current.CurrentCamera = newCamera;

			let yaw: number = 0;
			RunService.Heartbeat.Connect((dt: number) => {
				const currentPitch = cameraPitch.getValue();
				const currentOffset = cameraOffset.getValue();

				yaw += dt * CAMERA_ROTATION_SPEED;
				const orientation = CFrame.fromEulerAnglesYXZ(math.rad(currentPitch), math.rad(yaw), 0);
				newCamera.CFrame = new CFrame().mul(orientation).mul(currentOffset);
			});
		}
	});

	useEffect(() => {
		if (!viewportFrameRef.current) return;
		for (const child of viewportFrameRef.current.GetChildren()) {
			if (child.IsA("Model")) child.Destroy();
		}
		const newStructureModel = STRUCTURES[structureName].model.Clone();
		newStructureModel.PivotTo(STRUCTURE_CF);
		newStructureModel.Parent = viewportFrameRef.current;
	}, [viewportFrameRef.current, structureName]);

	return (
		<Button
			onMouseEnter={() => {
				cameraPitchMotion.spring(HOVER_CAMERA_PITCH, springs.slow);
				cameraOffsetMotion.spring(HOVER_CAMERA_OFFSET, springs.slow);
			}}
			onMouseLeave={() => {
				cameraPitchMotion.spring(DEFAULT_CAMERA_PITCH, springs.slow);
				cameraOffsetMotion.spring(DEFAULT_CAMERA_OFFSET, springs.slow);
			}}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.5, 0, 0.25, 0)}
			size={new UDim2(0.621, 0, 0.317, 0)}
		>
			<ViewportFrame
				ref={viewportFrameRef}
				ambient={Color3.fromRGB(182, 182, 182)}
				lightColor={Color3.fromRGB(255, 255, 255)}
				lightDirection={new Vector3(-1, 0, -1)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
			></ViewportFrame>
		</Button>
	);
}
