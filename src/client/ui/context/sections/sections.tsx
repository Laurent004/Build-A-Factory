import React from "@rbxts/react";
import { Frame } from "client/ui/core/frame";
import { SectionButton } from "./section-button";
import { colors } from "client/ui/constants";
import { Object } from "@rbxts/luau-polyfill";
import { SECTIONS } from "client/constants/navigation/sections";
import { useRem } from "client/hooks/use-rem";

export function Sections() {
	const rem = useRem();

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0, rem(60), 0, rem(432))}
			size={new UDim2(0, rem(84), 0, rem(252))}
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

			{Object.keys(SECTIONS).map((section) => {
				return <SectionButton section={section}></SectionButton>;
			})}
		</Frame>
	);
}
