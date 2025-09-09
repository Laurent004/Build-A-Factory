import { lerpBinding } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { colors } from "client/constants/colors";
import { fonts } from "client/constants/fonts";
import { springs } from "client/constants/springs";
import { useMotion, useStore } from "client/hooks";
import { selectPanelsStructureAttribute } from "client/store/panels";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { IMAGES } from "shared/assets/images";
import { ItemName } from "shared/constants/items";

export interface PanelItemButtonProps {
	itemName: ItemName;
}

export function PanelItemButton(props: PanelItemButtonProps) {
	const store = useStore();
	const selectedItem = useSelector(selectPanelsStructureAttribute("selectedItem"));
	const [animation, animationMotion] = useMotion(0);
	useEffect(() => {
		animationMotion.spring(selectedItem === props.itemName ? 1 : 0, springs.responsive);
	}, [selectedItem]);

	return (
		<Button
			onDoubleClick={() => {
				const selectedItem = store.getState().panels.structureAttributes?.selectedItem;
				if (selectedItem === props.itemName) {
					store.setPanelsStructureAttribute("selectedItem", undefined);
				} else {
					store.setPanelsStructureAttribute("selectedItem", props.itemName);
				}
			}}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={lerpBinding(animation, colors.grey, colors.lightblue)}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.4, 0)}
					size={new UDim2(0.8, 0, 0.8, 0)}
					image={IMAGES.items[props.itemName]}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.5, 0, 1.5, 0)}
					image="rbxassetid://137038247592087"
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(animation, 1, 0.7)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.85, 0)}
					size={new UDim2(0.83, 0, 0.146, 0)}
					font={fonts.josefinSans.regular}
					text={props.itemName}
					textSize={10}
					textColor={lerpBinding(animation, colors.grey, colors.lightblue)}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
			</Frame>
		</Button>
	);
}
