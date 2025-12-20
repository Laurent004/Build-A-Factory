import React, { useRef, useState } from "@rbxts/react";
import { Frame } from "client/ui/core/frame";
import { Text } from "client/ui/core/text";
import { colors, fonts, springs } from "client/ui/constants";
import { Image } from "client/ui/core/image";
import { ITEMS, Solid } from "shared/constants/items";
import { useSelector } from "@rbxts/react-reflex";
import TransporterComponent from "client/components/logistics/transporter";
import { lerpBinding, useMotion, usePrevious, useUpdate, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import { STRUCTURES } from "shared/constants/structures";
import { Object } from "@rbxts/luau-polyfill";
import { round } from "shared/utils/math";
import { selectContextStructureModels } from "client/store/context";
import { RunService } from "@rbxts/services";

export interface InfoPanelFluidInfoProps {
	position: UDim2;
	size: UDim2;
}

export function InfoPanelFluidInfo(props: InfoPanelFluidInfoProps) {
	const components = Dependency<Components>();
	const structureModel = useSelector(selectContextStructureModels)[0];
	const previousStructureModel = usePrevious(structureModel);
	const [transporterComponents, setTransporterComponents] = useState<TransporterComponent[]>();
	const connectionsRef = useRef<RBXScriptConnection[]>([]);
	const update = useUpdate();
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		for (const connection of connectionsRef.current) connection.Disconnect();
		connectionsRef.current.clear();
		setTransporterComponents(
			structureModel !== undefined
				? [structureModel, ...structureModel.GetDescendants()].mapFiltered(
						(structureModel) => components.getComponents<TransporterComponent>(structureModel)[0],
				  )
				: undefined,
		);
	}, [structureModel]);

	useUpdateEffect(() => {
		if (
			structureModel?.Name !== previousStructureModel?.Name &&
			transporterComponents !== undefined &&
			transporterComponents.size() > 0
		) {
			onMountAnimationMotion.immediate(0);
		}
		onMountAnimationMotion.spring(
			transporterComponents !== undefined && transporterComponents.size() > 0 ? 1 : 0,
			springs.gentle,
		);
		if (transporterComponents === undefined || transporterComponents.size() === 0) return;
		update();
		for (const transporterComponent of transporterComponents)
			connectionsRef.current.push(
				transporterComponent.OnInput.Connect(() => {
					update();
				}),
				transporterComponent.OnOutput.Connect(() => {
					update();
				}),
			);
	}, [transporterComponents]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={props.position}
			size={props.size}
			backgroundTransparency={1}
		>
			<Text
				anchorPoint={new Vector2(0, 0)}
				position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
				size={new UDim2(0.167, 0, 0.148, 0)}
				backgroundTransparency={1}
				font={fonts.josefinSans.medium}
				text={"Info : "}
				textSize={20}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.23, 0, 0.6, 0), new UDim2(0.23, 0, 0.42, 0))}
				size={new UDim2(0.144, 0, 0.348, 0)}
				backgroundColor={colors.mediumgrey}
				backgroundTransparency={onMountAnimation.map((value) => 1 - value)}
			>
				<uicorner CornerRadius={new UDim(0, 64)}></uicorner>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, -1, 0), new UDim2(0.5, 0, 0.5, 0))}
					size={new UDim2(0.69, 0, 0.7, 0)}
					image={
						transporterComponents !== undefined &&
						transporterComponents.find(
							(transporterComponent) => transporterComponent.getFluids().size() > 0,
						) !== undefined
							? ITEMS[
									Object.keys(
										transporterComponents
											.find(
												(transporterComponent) => transporterComponent.getFluids().size() > 0,
											)!
											.getFluids(),
									)[0]
							  ].image
							: undefined
					}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>
			</Frame>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.23, 0, 0.6, 0), new UDim2(0.23, 0, 0.84, 0))}
				size={new UDim2(0.253, 0, 0.277, 0)}
				font={fonts.josefinSans.regular}
				richText={true}
				text={`Fluid Buffer :<br/>
<font weight="regular" color="rgb(176,208,255)">${
					transporterComponents !== undefined && transporterComponents.size() > 0
						? round(
								transporterComponents.reduce(
									(bufferedFluid, transporterComponent) =>
										(bufferedFluid +=
											transporterComponent.getFluids().size() > 0
												? Object.values(transporterComponent.getFluids())[0]
												: 0),
									0,
								),
								2,
						  )
						: 0
				}m³</font>/${
					transporterComponents !== undefined && transporterComponents.size() > 0
						? transporterComponents.reduce(
								(fluidCapacity, transporterComponent) =>
									(fluidCapacity +=
										(STRUCTURES[transporterComponent.instance.Name].constants[
											"FluidCapacity"
										] as number) ?? 0),
								0,
						  )
						: 0
				}m³`}
				textSize={12}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.42, 0), new UDim2(0.72, 0, 0.42, 0))}
				size={lerpBinding(onMountAnimation, new UDim2(0.144, 0, 0, 0), new UDim2(0.144, 0, 0.42, 0))}
				image="rbxassetid://74484423852592"
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(onMountAnimation, new UDim2(0.72, 0, 0.6, 0), new UDim2(0.72, 0, 0.84, 0))}
				size={new UDim2(0.253, 0, 0.277, 0)}
				font={fonts.josefinSans.regular}
				richText={true}
				text={`Flow Rate :<br/>
<font weight="regular" color="rgb(176,208,255)">${0}m³</font>/Min`}
				textSize={12}
				textColor={colors.white}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textXAlignment={Enum.TextXAlignment.Center}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>
		</Frame>
	);
}
