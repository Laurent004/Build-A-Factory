import React, { useState } from "@rbxts/react";
import { Frame } from "../core/frame";
import { colors, fonts, springs } from "../constants";
import { Image } from "../core/image";
import { IMAGES } from "shared/assets/images";
import { useMotion, useMountEffect } from "@rbxts/pretty-react-hooks";
import { Players } from "@rbxts/services";
import { NumberSpinner } from "../core";
import { STRUCTURE_CATEGORIES } from "shared/constants/structures";

export function CurrencyDisplay() {
	const [cash, setCash] = useState<number>(0);
	const [data, setData] = useState<Record<string, number>>(
		STRUCTURE_CATEGORIES.reduce<Record<string, number>>((data, structureCategory) => {
			data[structureCategory] = 0;
			return data;
		}, {}),
	);
	const [updateAnimation, updateAnimationMotion] = useMotion(colors.white);

	useMountEffect(() => {
		const leaderstats = Players.LocalPlayer.WaitForChild("leaderstats");
		(leaderstats.WaitForChild("Cash") as NumberValue).Changed.Connect((cash) => {
			setCash((previousCash) => {
				updateAnimationMotion.spring(cash > previousCash ? colors.lightgreen : colors.lightred, springs.slow);
				const cleanup = updateAnimationMotion.onComplete(() => {
					updateAnimationMotion.spring(colors.white, springs.slow);
					cleanup();
				});
				return cash;
			});
		});
		for (const structureCategory of STRUCTURE_CATEGORIES) {
			(leaderstats.WaitForChild(`${structureCategory} Data`) as NumberValue).Changed.Connect((data) => {
				setData((previousData) => {
					return {
						...previousData,
						[structureCategory]: data,
					};
				});
			});
		}
	});

	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0)}
			AutomaticSize={Enum.AutomaticSize.X}
			Position={UDim2.fromScale(0.5, 0)}
			Size={UDim2.fromScale(0, 0.042)}
			BackgroundColor3={colors.black}
			ZIndex={0}
		>
			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.02)}
				BackgroundColor3={colors.white}
			></Frame>

			<Frame AutomaticSize={Enum.AutomaticSize.X} Size={UDim2.fromScale(0, 1)} BackgroundTransparency={1}>
				<uipadding PaddingLeft={new UDim(0, 30)} PaddingRight={new UDim(0, 30)}></uipadding>

				<uilistlayout
					Padding={new UDim(0, 20)}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
				></uilistlayout>

				<Frame
					AutomaticSize={Enum.AutomaticSize.X}
					Size={UDim2.fromScale(0, 1)}
					BackgroundTransparency={1}
					LayoutOrder={0}
				>
					<NumberSpinner
						FontFace={fonts.josefinSans.bold}
						TextSize={15}
						TextColor3={updateAnimation}
						value={cash}
						duration={0.3}
						decimals={2}
						prefix="$ "
						suffix=""
						commas={true}
					>
						<uigradient
							Rotation={90}
							Transparency={
								new NumberSequence([
									new NumberSequenceKeypoint(0, 1),
									new NumberSequenceKeypoint(0.25, 0.6),
									new NumberSequenceKeypoint(0.5, 0),
									new NumberSequenceKeypoint(0.75, 0.6),
									new NumberSequenceKeypoint(1, 1),
								])
							}
						></uigradient>
					</NumberSpinner>
				</Frame>
			</Frame>

			{STRUCTURE_CATEGORIES.filter((_, index) => index < 3).map((structureCategory, index) => (
				<Frame
					AutomaticSize={Enum.AutomaticSize.X}
					Size={UDim2.fromScale(0, 1)}
					BackgroundTransparency={1}
					LayoutOrder={index + 1}
				>
					<Frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.12, 0.5)}
						Rotation={45}
						Size={UDim2.fromScale(0, 0.211)}
						BackgroundColor3={colors.white}
					>
						<uiaspectratioconstraint
							AspectType={Enum.AspectType.ScaleWithParentSize}
							DominantAxis={Enum.DominantAxis.Height}
						></uiaspectratioconstraint>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(4, 4)}
							Image={IMAGES.Glow}
							ImageTransparency={0.8}
						></Image>
					</Frame>

					<NumberSpinner
						FontFace={fonts.josefinSans.bold}
						TextSize={15}
						value={data[structureCategory]}
						duration={0.3}
						decimals={2}
						prefix=""
						suffix=""
						commas={true}
					>
						<uigradient
							Rotation={90}
							Transparency={
								new NumberSequence([
									new NumberSequenceKeypoint(0, 1),
									new NumberSequenceKeypoint(0.25, 0.6),
									new NumberSequenceKeypoint(0.5, 0),
									new NumberSequenceKeypoint(0.75, 0.6),
									new NumberSequenceKeypoint(1, 1),
								])
							}
						></uigradient>

						<uipadding PaddingLeft={new UDim(0, 27)}></uipadding>
					</NumberSpinner>
				</Frame>
			))}
		</Frame>
	);
}
