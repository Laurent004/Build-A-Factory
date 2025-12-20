import React from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { useSelector } from "@rbxts/react-reflex";
import { lerpBinding, useUpdateEffect, useMotion } from "@rbxts/pretty-react-hooks";
import { SmartSplitterComponent } from "client/components/logistics/splitters/smart-splitter";
import { useRem } from "client/hooks/use-rem";
import { SmartSplitterInfoPanelFiltersDropdown } from "./filters-dropdown";
import { splitterOutputDirections } from "client/components/logistics/splitters/splitter";
import { BaseInfoPanel } from "../../../base";
import { selectContextStructureModelComponent } from "client/store/context";

export function SmartSplitterInfoPanel() {
	const rem = useRem();
	const smartSplitterComponent = useSelector(selectContextStructureModelComponent(SmartSplitterComponent));
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(smartSplitterComponent !== undefined ? 1 : 0, springs.gentle);
	}, [smartSplitterComponent]);

	return (
		<BaseInfoPanel
			active={smartSplitterComponent !== undefined}
			size={new UDim2(0, rem(409), 0, rem(372))}
			headerSize={new UDim2(1, 0, 0.119, 0)}
			headerIconSize={new UDim2(0.052, 0, 0.502, 0)}
			descriptionPosition={new UDim2(0.5, 0, 0.212, 0)}
			descriptionSize={new UDim2(0.913, 0, 0.095, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.634, 0)}
				size={new UDim2(0.913, 0, 0.656, 0)}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0, 0)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.25, 0, 0, 0), new UDim2(0, 0, 0, 0))}
					size={new UDim2(0.5, 0, 0.08, 0)}
					font={fonts.josefinSans.medium}
					text={"Configuration :"}
					textSize={20}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Frame
					anchorPoint={new Vector2(0.5, 1)}
					position={new UDim2(0.5, 0, 1, 0)}
					size={new UDim2(1, 0, 0.87, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 0)}
						FillDirection={Enum.FillDirection.Horizontal}
						SortOrder={Enum.SortOrder.LayoutOrder}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>

					{splitterOutputDirections.map((outputDirection) => {
						return (
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(0.331, 0, 1, 0)}
								backgroundTransparency={1}
							>
								<Text
									anchorPoint={new Vector2(0.5, 0)}
									position={lerpBinding(
										onMountAnimation,
										outputDirection === "LeftOutput"
											? new UDim2(1, 0, 0, 0)
											: outputDirection === "ForwardOutput"
											? new UDim2(0.5, 0, 0.2, 0)
											: new UDim2(0, 0, 0, 0),
										new UDim2(0.5, 0, 0, 0),
									)}
									size={new UDim2(1, 0, 0.143, 0)}
									font={fonts.josefinSans.regular}
									text={`${outputDirection.gsub("(%u)", " %1")[0].gsub("^%s+", "")[0]} :`}
									textSize={14}
									textColor={colors.white}
									textTransparency={onMountAnimation.map((value) => 1 - value)}
									textXAlignment={Enum.TextXAlignment.Center}
									textYAlignment={Enum.TextYAlignment.Center}
								></Text>

								<Frame
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.565, 0)}
									size={new UDim2(0.9, 0, 0.78, 0)}
									backgroundTransparency={1}
								>
									<uistroke
										ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
										Color={Color3.fromRGB(45, 45, 45)}
										LineJoinMode={Enum.LineJoinMode.Miter}
										Thickness={1}
									>
										<uigradient
											Rotation={90}
											Transparency={onMountAnimation.map(
												(value) =>
													new NumberSequence([
														new NumberSequenceKeypoint(0, 0),
														new NumberSequenceKeypoint(
															math.clamp(value, 0, 0.999),
															1 - value,
														),
														new NumberSequenceKeypoint(1, 1),
													]),
											)}
										></uigradient>
									</uistroke>

									<SmartSplitterInfoPanelFiltersDropdown
										outputDirection={outputDirection}
									></SmartSplitterInfoPanelFiltersDropdown>
								</Frame>
							</Frame>
						);
					})}
				</Frame>
			</Frame>
		</BaseInfoPanel>
	);
}
