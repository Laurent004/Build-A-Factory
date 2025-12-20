import React from "@rbxts/react";
import { Object } from "@rbxts/luau-polyfill";
import { Frame } from "client/ui/core/frame";
import { ToolButton } from "./button";
import { colors } from "client/ui/constants";
import { TOOLS } from "client/constants/navigation/tools";
import { useRem } from "client/hooks/use-rem";
import { useStore } from "client/hooks";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { EventBus } from "client/event-bus";

export function Tools() {
	const store = useStore();
	const rem = useRem();

	useEventListener(EventBus.ToolEvents.OnSelection, (selectedStructuresModels) => {
		store.setContextStructuresModels(selectedStructuresModels);
	});

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
				return <ToolButton tool={tool}></ToolButton>;
			})}
		</Frame>
	);
}
