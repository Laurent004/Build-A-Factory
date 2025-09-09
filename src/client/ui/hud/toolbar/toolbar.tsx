import React from "@rbxts/react";
import { TOOLS } from "client/constants/navigation";
import { Object } from "@rbxts/luau-polyfill";
import { Frame } from "client/ui/core/frame";
import { ToolbarButton } from "./toolbar-button";
import { colors } from "client/constants/colors";

export function Toolbar() {
	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.027, 0, 0.765, 0)}
			size={new UDim2(0.038, 0, 0.45, 0)}
			backgroundColor={colors.black}
		>
			<uilistlayout
				Padding={new UDim(0, 4)}
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={Enum.SortOrder.LayoutOrder}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				VerticalFlex={Enum.UIFlexAlignment.SpaceAround}
			></uilistlayout>

			{Object.entries(TOOLS).map(([tool, _]) => {
				return <ToolbarButton tool={tool}></ToolbarButton>;
			})}
		</Frame>
	);
}
