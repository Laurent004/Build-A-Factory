import React from "@rbxts/react";
import { SECTIONS } from "client/constants/navigation";
import { Frame } from "client/ui/core/frame";
import { SectionButton } from "./section-button";
import { colors } from "client/constants/colors";
import { Object } from "@rbxts/luau-polyfill";

export function Sections() {
	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.027, 0, 0.5, 0)}
			size={new UDim2(0.038, 0, 0.071, 0)}
			backgroundColor={colors.black}
		>
			<uilistlayout
				Padding={new UDim(0, 4)}
				FillDirection={Enum.FillDirection.Vertical}
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
