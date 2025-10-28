import React, { useRef, useState } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoSelectionStructureModel } from "client/store/context/info";
import { ITEMS } from "shared/constants/items";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Dependency } from "@flamework/core";
import { Components } from "@flamework/components";
import StorageContainerComponent from "client/components/transporters/storage-container";
import { Image } from "client/ui/core/image";
import { STRUCTURES } from "shared/constants/structures";
import { useRem } from "client/hooks/use-rem";
import { BaseInfoPanel } from "../base-panel";

export function StorageContainerInfoPanel() {
	const rem = useRem();

	const components = Dependency<Components>();

	const structureModel = useSelector(selectInfoSelectionStructureModel);
	const [storageContainerComponent, setStorageContainerComponent] = useState<StorageContainerComponent>();

	const [slots, setSlots] = useState<{ itemName: string; count: number }[]>();

	const onInputConnectionRef = useRef<RBXScriptConnection>();
	const onOutputConnectionRef = useRef<RBXScriptConnection>();

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onInputConnectionRef.current?.Disconnect();
		onInputConnectionRef.current = undefined;
		onOutputConnectionRef.current?.Disconnect();
		onOutputConnectionRef.current = undefined;

		setStorageContainerComponent(
			structureModel !== undefined
				? components.getComponent<StorageContainerComponent>(structureModel)
				: undefined,
		);
	}, [structureModel]);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(storageContainerComponent !== undefined ? 1 : 0, springs.gentle);
		if (storageContainerComponent === undefined) return;
		const updateSlots = () => {
			const slots: { itemName: string; count: number }[] = [];
			for (const item of storageContainerComponent.getItems()) {
				const slot = slots.find(
					(itemSlot) =>
						itemSlot.itemName === item.Name &&
						itemSlot.count < (STRUCTURES["Storage Container"].constants["SlotStackSize"] as number),
				);
				if (slot !== undefined) {
					slot.count++;
				} else {
					slots.push({ itemName: item.Name, count: 1 });
				}
			}
			setSlots(slots);
		};

		updateSlots();
		onInputConnectionRef.current = storageContainerComponent.OnInput.Connect(updateSlots);
		onOutputConnectionRef.current = storageContainerComponent.OnOutput.Connect(updateSlots);
	}, [storageContainerComponent]);

	return (
		<BaseInfoPanel
			structuresNames={["Storage Container"]}
			size={new UDim2(0, rem(351), 0, rem(284))}
			headerSize={new UDim2(1, 0, 0.136, 0)}
			headerIconSize={new UDim2(0.06, 0, 0.55, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.245, 0)}
			descriptionSize={new UDim2(0.924, 0, 0.119, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.635, 0)}
				size={new UDim2(0.924, 0, 0.58, 0)}
				backgroundTransparency={1}
			>
				<Text
					position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0, 0), new UDim2(0, 0, 0, 0))}
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
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.836, 0)}
					backgroundTransparency={1}
				>
					<uigridlayout
						CellPadding={new UDim2(0, 11, 0, 11)}
						CellSize={new UDim2(0, 36, 0, 36)}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uigridlayout>

					<uipadding PaddingLeft={new UDim(0, 1)} PaddingRight={new UDim(0, 1)}></uipadding>

					{slots !== undefined
						? slots.map((itemSlot) => (
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
										image={ITEMS[itemSlot.itemName].image}
									></Image>

									<Text
										anchorPoint={new Vector2(0, 0)}
										position={new UDim2(0.825, 0, 0.825, 0)}
										size={new UDim2(0.257, 0, 0.257, 0)}
										font={fonts.josefinSans.regular}
										text={tostring(itemSlot.count)}
										textSize={18}
										textColor={colors.white}
										textXAlignment={Enum.TextXAlignment.Center}
										textYAlignment={Enum.TextYAlignment.Center}
									></Text>
								</Frame>
						  ))
						: undefined}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
