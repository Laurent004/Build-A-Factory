import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { colors, springs, fonts } from "client/ui/constants";
import { STRUCTURES } from "shared/constants/structures";
import { CanvasGroup, Frame, Image, Text } from "client/ui/core";
import { selectContext, selectContextStructureModels } from "client/hooks/store/context";

interface BaseInfoPanelProps extends React.PropsWithChildren {
	active: boolean;
	size: UDim2;
}

export function BaseInfoPanel({ active, size, children }: BaseInfoPanelProps) {
	const context = useSelector(selectContext);
	const structureModel = useSelector(selectContextStructureModels)[0];
	const isActive = context === "Info" && active;
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(isActive ? 1 : 0, springs.gentle);
	}, [structureModel, isActive]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={isActive}
			AnchorPoint={new Vector2(1, 1)}
			Position={UDim2.fromScale(0.989, 0.99)}
			Size={size}
			BackgroundColor3={colors.black}
			Interactable={isActive}
		>
			<uilistlayout
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalFlex={Enum.UIFlexAlignment.Fill}
			></uilistlayout>

			<Frame Size={UDim2.fromScale(1, 0)} BackgroundTransparency={1}>
				<uiaspectratioconstraint
					AspectRatio={9.658273233}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>

				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.064, 0.5)}
					Size={UDim2.fromScale(0.06, 0.5)}
					Image="rbxassetid://81869066413292"
				>
					<uiaspectratioconstraint AspectType={Enum.AspectType.ScaleWithParentSize}></uiaspectratioconstraint>
				</Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.545, 0.5)}
					Size={UDim2.fromScale(0.84, 0.56)}
					FontFace={fonts.josefinSans.semiBold}
					Text={structureModel?.Name}
					TextSize={19}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>
			</Frame>

			<Frame Size={UDim2.fromScale(1, 0)} BackgroundTransparency={1}>
				<uipadding
					PaddingTop={new UDim(0, 15)}
					PaddingLeft={new UDim(0, 15)}
					PaddingRight={new UDim(0, 15)}
					PaddingBottom={new UDim(0, 12)}
				></uipadding>

				<uilistlayout Padding={new UDim(0, 17)} SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

				<Text
					Size={UDim2.fromScale(1, 0)}
					LayoutOrder={0}
					LineHeight={1.4}
					Text={structureModel !== undefined ? STRUCTURES[structureModel.Name].description : undefined}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				>
					<uiaspectratioconstraint
						AspectRatio={8.623006037}
						AspectType={Enum.AspectType.ScaleWithParentSize}
					></uiaspectratioconstraint>
				</Text>

				{children}
			</Frame>
		</CanvasGroup>
	);
}
