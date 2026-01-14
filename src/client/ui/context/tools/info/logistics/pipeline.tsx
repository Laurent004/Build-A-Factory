import React, { useBinding, useRef } from "@rbxts/react";
import { Frame, Image, Text } from "client/ui/core";
import { colors, fonts } from "client/ui/constants";
import { BaseInfoPanel } from "../base";
import { InfoPanelFluidIndicator } from "../components";
import { useSelector } from "@rbxts/react-reflex";
import { selectContextStructureComponents } from "client/store/context";
import TransporterComponent from "client/components/logistics/transporter";
import { Object } from "@rbxts/luau-polyfill";
import { round } from "shared/utils/math";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { RunService } from "@rbxts/services";
import { STRUCTURES } from "shared/constants/structures";
import { ITEMS } from "shared/constants/items";

export function PipelineInfoPanel() {
	const transporterComponents = useSelector(selectContextStructureComponents(TransporterComponent));
	const [fluid, setFluid] = useBinding<[string, number] | undefined>(undefined);
	const connectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		connectionRef.current?.Disconnect();
		connectionRef.current = undefined;
		if (
			transporterComponents.size() === 0 ||
			transporterComponents.find((transporter) => transporter.instance.Name.find("Pipeline")[0] !== undefined) ===
				undefined
		)
			return;
		connectionRef.current = RunService.Heartbeat.Connect(() => {
			const transporter = transporterComponents.find((transporter) => transporter.getFluids().size() > 0);
			if (transporter === undefined) return;
			const fluid = Object.keys(transporter.getFluids())[0];
			setFluid([
				fluid,
				transporterComponents.reduce(
					(volume, transporter) => (volume += transporter.getFluids().get(fluid) ?? 0),
					0,
				),
			]);
		});
	}, [transporterComponents]);

	return (
		<BaseInfoPanel
			active={transporterComponents.some(
				(transporterComponent) => transporterComponent.instance.Name.find("Pipeline")[0] !== undefined,
			)}
			size={UDim2.fromScale(0.183, 0.292)}
		>
			<Frame Size={UDim2.fromScale(1, 0.784)} BackgroundTransparency={1}>
				<Text
					Size={UDim2.fromScale(0.231, 0.1)}
					FontFace={fonts.josefinSans.medium}
					Text="Buffer :"
					TextSize={20}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame Position={UDim2.fromScale(0, 0.16)} Size={UDim2.fromScale(1, 0.84)} BackgroundTransparency={1}>
					<InfoPanelFluidIndicator fluid={fluid}></InfoPanelFluidIndicator>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.23)}
						Size={UDim2.fromScale(0.139, 0.271)}
						BackgroundColor3={Color3.fromRGB(32, 32, 32)}
					>
						<uicorner CornerRadius={new UDim(0, 4)}></uicorner>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.7, 0.7)}
							Image={fluid.map((value) => (value !== undefined ? ITEMS[value[0]].image : ""))}
						></Image>
					</Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.48)}
						Size={UDim2.fromScale(0.35, 1)}
						Text={fluid.map((value) => value?.[0] ?? "")}
						TextSize={16}
					></Text>

					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.568)}
						Size={UDim2.fromScale(0.43, 0.006)}
						BackgroundColor3={colors.grey}
					></Frame>

					<Text
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.705, 0.75)}
						Size={UDim2.fromScale(0.4, 0.22)}
						LineHeight={1.65}
						RichText={true}
						Text={fluid.map(
							(value) =>
								`Current Volume : <br></br> <font color="rgb(176,208,255)" weight="regular">${round(
									value?.[1] ?? 0,
									2,
								)}m³</font>/${transporterComponents.reduce(
									(capacity, transporter) =>
										(capacity +=
											(STRUCTURES[transporter.instance.Name].constants["FluidCapacity"] as
												| number
												| undefined) ?? 0),
									0,
								)}m³`,
						)}
						TextSize={13}
					></Text>
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
