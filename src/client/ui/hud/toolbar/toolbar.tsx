import React from "@rbxts/react";
import { Object } from "@rbxts/luau-polyfill";
import { Frame } from "client/ui/core/frame";
import { ToolbarButton } from "./toolbar-button";
import { colors } from "client/ui/constants";
import { TOOLS } from "client/constants/navigation/tools";
import { useRem } from "client/hooks/use-rem";

export function Toolbar() {
	const rem = useRem();

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0, rem(60), 0, rem(819))}
			size={new UDim2(0, rem(84), 0, rem(496))}
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

			{Object.keys(TOOLS).map((tool) => {
				return <ToolbarButton tool={tool}></ToolbarButton>;
			})}
		</Frame>
	);
}
