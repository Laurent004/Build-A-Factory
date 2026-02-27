import React from "@rbxts/react";
import { fonts } from "client/ui/constants";
import { useSelector } from "@rbxts/react-reflex";
import { BaseInfoPanel } from "../base";
import { Frame, Text } from "client/ui/core";
import { InfoPanelPowerGraph } from "./power-graph";
import { selectContextStructureModels } from "client/hooks/store/context";

export function PowerPoleInfoPanel() {
	const structureModel = useSelector(selectContextStructureModels)[0];

	return (
		<BaseInfoPanel active={structureModel?.Name === "Power Pole"} size={UDim2.fromScale(0.212, 0.454)}>
			<Frame Size={UDim2.fromScale(1, 0.855)} BackgroundTransparency={1} LayoutOrder={1}>
				<Text
					Size={UDim2.fromScale(0.355, 0.048)}
					FontFace={fonts.josefinSans.medium}
					Text={"Power Graph :"}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<InfoPanelPowerGraph
					attachment={
						structureModel !== undefined
							? structureModel
									.GetDescendants()
									.find(
										(instance): instance is Attachment =>
											instance.IsA("Attachment") && instance.Name === "PowerAttachment",
									)
							: undefined
					}
				></InfoPanelPowerGraph>
			</Frame>
		</BaseInfoPanel>
	);
}
