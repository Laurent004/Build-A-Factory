import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectTips } from "client/store/overlay";
import { Frame, Text } from "../core";
import { useMouse } from "@rbxts/pretty-react-hooks";

export function Tooltip() {
	const tips = useSelector(selectTips);
	const mouse = useMouse();

	return (
		<Frame
			AnchorPoint={new Vector2(0, 1)}
			AutomaticSize={Enum.AutomaticSize.XY}
			Position={mouse.map((value) => UDim2.fromOffset(value.X, value.Y))}
			Size={UDim2.fromScale(0.058, 0.023)}
			BackgroundColor3={Color3.fromRGB(32, 32, 32)}
			Visible={tips.size() > 0}
			ZIndex={100}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={Color3.fromRGB(47, 47, 47)}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<uipadding
				PaddingTop={new UDim(0, 8)}
				PaddingLeft={new UDim(0, 8)}
				PaddingRight={new UDim(0, 8)}
				PaddingBottom={new UDim(0, 8)}
			></uipadding>

			<uilistlayout Padding={new UDim(0, 6)} SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

			{tips.map((tip) => (
				<Text
					AutomaticSize={Enum.AutomaticSize.XY}
					RichText={true}
					Text={tip}
					TextSize={11}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>
			))}
		</Frame>
	);
}
