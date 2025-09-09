import React from "@rbxts/react";
import { useStore } from "client/hooks";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useMotion } from "client/hooks";
import { springs } from "client/constants/springs";

import { Frame } from "../../core/frame";
import { Image } from "../../core/image";
import { Text } from "../../core/text";
import { fonts } from "client/constants/fonts";

import { selectContext, selectContextOpen } from "client/store/context";
import { Context, TOOLS } from "client/constants/navigation";
import { Button } from "client/ui/core/button";
import { colors } from "client/constants/colors";
import { IMAGES } from "shared/assets/images";

export interface ContextMenuProps extends React.PropsWithChildren {
	context: Context;

	openPosition: UDim2;
	closedPosition: UDim2;
	openSize: UDim2;
	closedSize?: UDim2;
}

export function ContextMenu(props: ContextMenuProps) {
	const store = useStore();

	const currentContext = useSelector(selectContext);
	const currentContextState = useSelector(selectContextOpen);

	const [menuPosition, menuPositionMotion] = useMotion(0);
	const [menuSize, menuSizeMotion] = useMotion(0);
	const [menuTransparency, menuTransparencyMotion] = useMotion(1);

	useUpdateEffect(() => {
		const isPropsContext = currentContext === props.context;
		menuPositionMotion.spring(isPropsContext ? 1 : 0, springs.responsive);
		menuSizeMotion.spring(isPropsContext ? 1 : 0, springs.gentle);
		menuTransparencyMotion.spring(isPropsContext ? 0 : 1, springs.gentle);
	}, [currentContext]);

	useUpdateEffect(() => {
		if (!currentContextState) {
			menuPositionMotion.spring(0, springs.responsive);
			menuSizeMotion.spring(0, springs.gentle);
		}
	}, [currentContextState]);

	return (
		<canvasgroup
			GroupTransparency={menuTransparency}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(menuPosition, props.closedPosition, props.openPosition)}
			Size={lerpBinding(menuSize, props.closedSize ?? new UDim2(0, 0, 0, 0), props.openSize)}
			BackgroundColor3={colors.black}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.025, 0, 0.5, 0)}
					size={new UDim2(0.031, 0, 0.586, 0)}
					image={
						props.context in TOOLS
							? IMAGES.context.toolbar[props.context]
							: IMAGES.context.sections[props.context]
					}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.202, 0, 0.55, 0)}
					size={new UDim2(0.304, 0, 0.676, 0)}
					font={fonts.josefinSans.medium}
					textSize={24}
					textColor={colors.white}
					text={props.context}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.96, 0, 0.5, 0)}
					size={new UDim2(0.026, 0, 0.409, 0)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						size={new UDim2(1, 0, 1, 0)}
						image="rbxassetid://85748466046800"
					></Image>
				</Button>
			</Frame>

			{props.children}
		</canvasgroup>
	);
}
