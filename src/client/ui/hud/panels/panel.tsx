import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useMountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useMotion, useStore } from "client/hooks";
import { springs } from "client/constants/springs";
import { fonts } from "client/constants/fonts";

import { StructureAttributes, StructureName } from "shared/constants/structures";
import { selectContext } from "client/store/context";
import { Frame } from "../../core/frame";
import { Text } from "../../core/text";
import { Image } from "../../core/image";
import { colors } from "client/constants/colors";
import { EventBus } from "client/event-bus";
import { selectPanelsStructureModel } from "client/store/panels";

export interface PanelProps extends React.PropsWithChildren {
	structureNames: StructureName[];

	openPosition: UDim2;
	closedPosition: UDim2;
	openSize: UDim2;
	closedSize?: UDim2;

	headerSize: UDim2;
	headerIconPosition: UDim2;
	headerIconSize: UDim2;
	headerTextPosition: UDim2;
	headerTextSize: UDim2;
}

export function Panel(props: PanelProps) {
	const store = useStore();
	const currentContext = useSelector(selectContext);
	const structureModel = useSelector(selectPanelsStructureModel);
	const [animation, animationMotion] = useMotion(0);

	useMountEffect(() => {
		EventBus.ToolEvents.Info.OnSelection.Connect((selectedStructuresModels) => {
			if (selectedStructuresModels.size() <= 0) {
				animationMotion.spring(0, springs.responsive);
				store.setPanelsStructureModel(undefined);
				store.setPanelsStructureAttributes(undefined);
				return;
			}

			const selectedStructureModel = selectedStructuresModels[0];
			const isStructureNameIncluded = props.structureNames.includes(selectedStructureModel.Name as StructureName);
			animationMotion.spring(isStructureNameIncluded ? 1 : 0, { tension: 420, mass: 0.65 });
			store.setPanelsStructureModel(selectedStructureModel);

			const structureAttributes: Partial<Record<keyof StructureAttributes, AttributeValue>> = {};
			for (const [structureAttributeName, structureAttributeValue] of selectedStructureModel.GetAttributes()) {
				structureAttributes[structureAttributeName as keyof StructureAttributes] = structureAttributeValue;
			}
			store.setPanelsStructureAttributes(structureAttributes);
		});
	});

	useUpdateEffect(() => {
		if (currentContext !== "Info") {
			animationMotion.spring(0, springs.responsive);
			store.setPanelsStructureModel(undefined);
			store.setPanelsStructureAttributes(undefined);
		}
	}, [currentContext]);

	return (
		<canvasgroup
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(animation, props.closedPosition, props.openPosition)}
			Size={lerpBinding(animation, props.closedSize ?? new UDim2(0, 0, 0, 0), props.openSize)}
			BackgroundColor3={colors.black}
			GroupTransparency={animation.map((value) => 1 - value)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={props.headerSize}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={props.headerIconPosition}
					size={props.headerIconSize}
					image="rbxassetid://81869066413292"
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={props.headerTextPosition}
					size={props.headerTextSize}
					font={fonts.josefinSans.medium}
					textSize={19}
					textColor={colors.white}
					textTransparency={animation.map((value) => 1 - value)}
					text={structureModel?.Name}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.02, 0)}
					backgroundColor={colors.grey}
				></Frame>
			</Frame>

			{props.children}
		</canvasgroup>
	);
}
