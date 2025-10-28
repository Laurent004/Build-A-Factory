import { lerpBinding, useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { colors, fonts } from "client/ui/constants";
import { springs } from "client/ui/constants";
import { useStore } from "client/hooks";
import { Button } from "client/ui/core/button";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { ITEMS } from "shared/constants/items";
import { IMAGES } from "shared/assets/images";
import { useSelector } from "@rbxts/react-reflex";
import { selectInfoStructureAttribute } from "client/store/context/info";

export interface InfoPanelItemButtonProps {
	index: number;
	itemName: string;
}

export function InfoPanelItemButton(props: InfoPanelItemButtonProps) {
	const store = useStore();
	const selectedItemName = useSelector(selectInfoStructureAttribute("SelectedItem")) as string | undefined;

	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onHoverAnimation, onHoverAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		task.delay((props.index + 1) * 0.005, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});
	});

	useEffect(() => {
		onClickAnimationMotion.spring(selectedItemName === props.itemName ? 1 : 0, springs.gentle);
	}, [selectedItemName]);

	return (
		<Button
			onDoubleClick={() => {
				store.setInfoStructuresAttribute(
					"SelectedItem",
					selectedItemName === props.itemName ? undefined : props.itemName,
				);
			}}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					onMountAnimation,
					new UDim2(0.5, 0, 0.5 + (props.index + 1) * 0.35, 0),
					new UDim2(0.5, 0, 0.5, 0),
				)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onMountAnimation,
						new UDim2(0.5, 0, 0.4 - (props.index + 1) * 0.55, 0),
						new UDim2(0.5, 0, 0.4, 0),
					)}
					size={lerpBinding(onHoverAnimation, new UDim2(0.8, 0, 0.8, 0), new UDim2(0.87, 0, 0.87, 0))}
					image={ITEMS[props.itemName].image}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
					event={{
						MouseEnter: () => {
							onHoverAnimationMotion.spring(1, springs.responsive);
						},
						MouseLeave: () => {
							onHoverAnimationMotion.spring(0, springs.responsive);
						},
					}}
				></Image>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(1.5, 0, 1.5, 0)}
					image={IMAGES.ui.Glow}
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(onClickAnimation, 1, 0.7)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.85, 0)}
					size={new UDim2(0.9, 0, 0.146, 0)}
					font={fonts.josefinSans.regular}
					text={props.itemName}
					textSize={9}
					textColor={lerpBinding(onClickAnimation, colors.grey, colors.lightblue)}
					textXAlignment={Enum.TextXAlignment.Center}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>
			</Frame>
		</Button>
	);
}
