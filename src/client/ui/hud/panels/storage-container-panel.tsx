import React, { useRef, useState } from "@rbxts/react";
import { Panel } from "./panel";
import { Text } from "client/ui/core/text";
import { fonts } from "client/constants/fonts";
import { STRUCTURES } from "shared/constants/structures";
import { colors } from "client/constants/colors";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectPanelsStructureAttribute, selectPanelsStructureModel } from "client/store/panels";
import { ITEMS } from "shared/constants/items";
import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Object } from "@rbxts/luau-polyfill";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import StorageContainerComponent from "client/components/transporters/storage-container";
import { Image } from "client/ui/core/image";

export function StorageContainerPanel() {
	const components = Dependency<Components>();
	const structureModel = useSelector(selectPanelsStructureModel);
	const [storedItems, setStoredItems] = useState<Model[]>([]);
	const itemsSlots = useSelector(selectPanelsStructureAttribute("itemsSlots"));
	const itemsPerSlot = useSelector(selectPanelsStructureAttribute("itemsPerSlot"));

	const storedItemsConnectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		storedItemsConnectionRef.current?.Disconnect();
		storedItemsConnectionRef.current = undefined;
		if (structureModel === undefined) return;
		const storageContainerComponent = components.getComponent<StorageContainerComponent>(structureModel);
		if (storageContainerComponent !== undefined) {
			setStoredItems([...storageContainerComponent.getStoredItems()]);
			storedItemsConnectionRef.current = storageContainerComponent.OnInput.Connect(() => {
				setStoredItems([...storageContainerComponent.getStoredItems()]);
			});
		}
	}, [structureModel]);

	return (
		<Panel
			structureNames={["Storage Container"]}
			openPosition={new UDim2(0.896, 0, 0.842, 0)}
			closedPosition={new UDim2(0.896, 0, 0.979, 0)}
			openSize={new UDim2(0.183, 0, 0.293, 0)}
			closedSize={new UDim2(0.183, 0, 0, 0)}
			//
			headerSize={new UDim2(1, 0, 0.136, 0)}
			headerIconPosition={new UDim2(0.064, 0, 0.5, 0)}
			headerIconSize={new UDim2(0.053, 0, 0.504, 0)}
			headerTextPosition={new UDim2(0.37, 0, 0.5, 0)}
			headerTextSize={new UDim2(0.489, 0, 0.59, 0)}
		>
			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.459, 0, 0.238, 0)}
				size={new UDim2(0.829, 0, 0.123, 0)}
				font={fonts.josefinSans.medium}
				lineHeight={1.4}
				text={STRUCTURES["Storage Container"].description}
				textSize={14}
				textColor={colors.white}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.627, 0)}
				size={new UDim2(0.91, 0, 0.58, 0)}
				backgroundTransparency={1}
			>
				<Text
					size={new UDim2(0.318, 0, 0.12, 0)}
					font={fonts.josefinSans.medium}
					text={"All Items :"}
					textSize={20}
					textColor={colors.white}
					textWrapped={true}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.495, 0, 1, 0)}
					size={new UDim2(1, 0, 0.83, 0)}
					backgroundTransparency={1}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 10, 0, 10)}
						CellSize={new UDim2(0, 35, 0, 35)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uigridlayout>

					<uipadding PaddingLeft={new UDim(0, 1)} PaddingRight={new UDim(0, 1)}></uipadding>

					{itemsSlots !== undefined && itemsPerSlot !== undefined
						? Object.keys(ITEMS).map((itemName) => {
								const storedItemCount = storedItems.filter((item) => item.Name === itemName).size();
								const itemSlotsCounts: number[] = [];
								for (let i = 0; i < math.ceil(storedItemCount / itemsPerSlot); i++) {
									const itemSlotCount = math.min(itemsPerSlot, storedItemCount - i * itemsPerSlot!);
									itemSlotsCounts.push(itemSlotCount);
								}

								return itemSlotsCounts.map((itemSlotCount) => {
									return (
										<Frame
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											size={new UDim2(1, 0, 1, 0)}
											backgroundColor={colors.mediumgrey}
										>
											<uicorner CornerRadius={new UDim(0, 10)}></uicorner>

											<Image
												anchorPoint={new Vector2(0.5, 0.5)}
												position={new UDim2(0.5, 0, 0.5, 0)}
												size={new UDim2(0.7, 0, 0.7, 0)}
												image={ITEMS[itemName].image}
											></Image>

											<Text
												anchorPoint={new Vector2(0, 0)}
												position={new UDim2(0.825, 0, 0.825, 0)}
												size={new UDim2(0.257, 0, 0.257, 0)}
												font={fonts.josefinSans.regular}
												text={`x${itemSlotCount}`}
												textSize={18}
												textColor={colors.white}
												textXAlignment={Enum.TextXAlignment.Center}
												textYAlignment={Enum.TextYAlignment.Center}
											></Text>
										</Frame>
									);
								});
						  })
						: undefined}
				</Frame>
			</Frame>
		</Panel>
	);
}
