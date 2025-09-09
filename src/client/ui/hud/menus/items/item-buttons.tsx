import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { Frame } from "client/ui/core/frame";
import { SearchBar } from "client/ui/primitive/search-bar";
import { ITEMS } from "shared/constants/items";
import { ItemButton } from "./item-button";
import { Object } from "@rbxts/luau-polyfill";
import { colors } from "client/constants/colors";

export function ItemButtons() {
	const store = useStore();

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={new UDim2(0.131, 0, 0.54, 0)}
			size={new UDim2(0.262, 0, 0.92, 0)}
			backgroundTransparency={1}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.grey}
				LineJoinMode={Enum.LineJoinMode.Miter}
			></uistroke>

			<scrollingframe
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				CanvasSize={new UDim2(0, 0, 2, 0)}
				ScrollBarThickness={6}
				ScrollBarImageColor3={Color3.fromRGB(206, 206, 206)}
			>
				<SearchBar
					position={new UDim2(0.387, 0, 0.029, 0)}
					size={new UDim2(0.78, 0, 0.017, 0)}
					magnifierImagePosition={new UDim2(0.937, 0, 0.5, 0)}
					magnifierImageSize={new UDim2(0.099, 0, 0.835, 0)}
					onSearchTextChanged={(text) => {
						store.setItemMenuItemSearchText(text);
					}}
				></SearchBar>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5265, 0)}
					size={new UDim2(1, 0, 0.945, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					{Object.keys(ITEMS).map((itemName) => (
						<ItemButton itemName={itemName}></ItemButton>
					))}
				</Frame>
			</scrollingframe>
		</Frame>
	);
}
