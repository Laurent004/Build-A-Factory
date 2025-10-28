import React, { useEffect, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { selectItemMenuItemName } from "client/store/context/item";
import { selectContext } from "client/store/context";
import { useStore } from "client/hooks";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { colors, fonts, springs } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { IMAGES } from "shared/assets/images";
import { Image } from "client/ui/core/image";
import { Text } from "client/ui/core/text";
import { Button } from "client/ui/core/button";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { ItemRecipeItem } from "./item-recipe-item";
import { STRUCTURES } from "shared/constants/structures";
import { ItemRecipeArrow } from "./item-recipe-arrow";
import { useRem } from "client/hooks/use-rem";
import { ItemButton } from "./item-button";

export function ItemsMenu() {
	const store = useStore();
	const rem = useRem();

	const context = useSelector(selectContext);
	const selectedItemName = useSelector(selectItemMenuItemName);

	const [searchText, setSearchText] = useState<string>("");
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [animation, animationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(context === "Items" ? 1 : 0, springs.gentle);
	}, [context]);

	useEffect(() => {
		if (context !== "Items") return;
		animationMotion.immediate(0);
		animationMotion.spring(1, springs.gentle);
	}, [context, selectedItemName]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.66, 0), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(908), 0, rem(764)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Items"}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.082, 0)}
				backgroundTransparency={1}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(0.033, 0, 2.5, 0), new UDim2(0.033, 0, 0.465, 0))}
					size={new UDim2(0.035, 0, 0.5, 0)}
					image={IMAGES.ui.Items}
					imageTransparency={onMountAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(onMountAnimation, new UDim2(-0.5, 0, 0.5, 0), new UDim2(0.099, 0, 0.5, 0))}
					size={new UDim2(0.075, 0, 0.676, 0)}
					font={fonts.josefinSans.medium}
					textSize={24}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
					textColor={colors.white}
					text="Items"
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Center}
				></Text>

				<Button
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.96, 0, 0.5, 0)}
					size={new UDim2(0.029, 0, 0.42, 0)}
					onClick={() => {
						store.setContext(undefined);
					}}
				>
					<Image
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.5, 0, 0.5, 0)}
						rotation={lerpBinding(onMountAnimation, 0, 720)}
						size={new UDim2(1, 0, 1, 0)}
						image={IMAGES.ui.Close}
					></Image>
				</Button>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.131087348, 0, 0.539950013, 0)}
				size={new UDim2(0.262174696, 0, 0.920100033, 0)}
				backgroundTransparency={1}
				zIndex={2}
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
					CanvasSize={new UDim2(0, 0, 2, 0)}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={lerpBinding(
							onMountAnimation,
							new UDim2(-0.5, 0, 0.029, 0),
							new UDim2(0.387, 0, 0.029, 0),
						)}
						size={new UDim2(0.78, 0, 0.017, 0)}
						backgroundColor={Color3.fromRGB(134, 134, 134)}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromRGB(83, 83, 83)),
									new ColorSequenceKeypoint(1, Color3.fromRGB(173, 173, 173)),
								])
							}
							Rotation={-90}
						></uigradient>

						<uistroke
							Color={Color3.fromRGB(71, 71, 71)}
							LineJoinMode={Enum.LineJoinMode.Miter}
							Thickness={1.5}
						></uistroke>

						<textbox
							AnchorPoint={new Vector2(1, 0.5)}
							Position={new UDim2(1, 0, 0.5, 0)}
							Size={new UDim2(0.94, 0, 1, 0)}
							BackgroundTransparency={1}
							FontFace={fonts.josefinSans.regular}
							PlaceholderColor3={colors.grey}
							PlaceholderText={"Search for..."}
							TextSize={14}
							TextColor3={Color3.fromRGB(207, 207, 207)}
							Text=""
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							Change={{
								Text: (textBox) => {
									setSearchText(textBox.Text);
								},
							}}
						></textbox>

						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.938, 0, 0.5, 0)}
							size={new UDim2(0.08, 0, 0.62, 0)}
							image={IMAGES.ui.Magnifier}
							imageColor={Color3.fromRGB(190, 190, 190)}
						></Image>
					</Frame>

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
							<ItemButton itemName={itemName} searchText={searchText}></ItemButton>
						))}
					</Frame>
				</scrollingframe>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.631500006, 0, 0.229191825, 0)}
				size={new UDim2(0.736999929, 0, 0.298583716, 0)}
				backgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(animation, new UDim2(0.176, 0, 0.62, 0), new UDim2(0.176, 0, 0.462, 0))}
					size={new UDim2(0.26, 0, 0.764, 0)}
					image={ITEMS[selectedItemName].image}
					imageTransparency={animation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(animation, new UDim2(0.563, 0, 0.3, 0), new UDim2(0.563, 0, 0.174, 0))}
					size={new UDim2(0.422, 0, 0.184, 0)}
					font={fonts.josefinSans.medium}
					textSize={30}
					textTransparency={animation.map((value) => 1 - value)}
					textColor={colors.white}
					text={selectedItemName}
					textXAlignment={Enum.TextXAlignment.Left}
				></Text>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(animation, new UDim2(0.56, 0, 0.374, 0), new UDim2(0.638, 0, 0.374, 0))}
					size={new UDim2(0.571, 0, 0.164, 0)}
					font={fonts.josefinSans.regular}
					lineHeight={1.85}
					richText={true}
					textSize={13}
					textTransparency={animation.map((value) => 1 - value)}
					textColor={colors.white}
					text={`${ITEMS[selectedItemName].description} <br />Value : $${ITEMS[selectedItemName].value}`}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.631, 0, 0.691, 0)}
				size={new UDim2(0.737, 0, 0.619, 0)}
				backgroundTransparency={1}
			>
				<Frame
					anchorPoint={new Vector2(0, 0.5)}
					position={new UDim2(0, 0, 0.052, 0)}
					size={lerpBinding(animation, new UDim2(0, 0, 0.047, 0), new UDim2(0.428, 0, 0.047, 0))}
					backgroundColor={colors.white}
				>
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(21, 21, 21)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(139, 139, 139)),
							])
						}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(0.481, 0.72),
								new NumberSequenceKeypoint(1, 1),
							])
						}
					></uigradient>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						position={new UDim2(0.524, 0, 0.52, 0)}
						size={new UDim2(0.951, 0, 1, 0)}
						font={fonts.josefinSans.regular}
						textSize={14}
						textTransparency={animation.map((value) => 1 - value)}
						textColor={colors.white}
						text={"Recipes"}
						textXAlignment={Enum.TextXAlignment.Left}
					></Text>
				</Frame>

				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.485, 0, 0.55, 0)}
					size={new UDim2(0.897, 0, 0.848, 0)}
					backgroundTransparency={1}
				>
					<uilistlayout
						Padding={new UDim(0, 15)}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					></uilistlayout>
					{ITEM_RECIPES.filter((recipe) => recipe.outputItem === selectedItemName).map((itemRecipe) => (
						<Frame
							size={new UDim2(1, 0, 0.217, 0)}
							backgroundColor={Color3.fromRGB(30, 30, 30)}
							backgroundTransparency={animation.map((value) => 1 - value)}
						>
							<uicorner CornerRadius={new UDim(0, 12)}></uicorner>
							<uistroke
								Color={Color3.fromRGB(50, 50, 50)}
								Transparency={animation.map((value) => 1 - value)}
							></uistroke>

							<Frame
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.5, 0, 0.5, 0)}
								size={new UDim2(0.94, 0, 1, 0)}
								backgroundTransparency={1}
							>
								<uilistlayout
									Padding={new UDim(0, 12)}
									FillDirection={Enum.FillDirection.Horizontal}
									HorizontalAlignment={Enum.HorizontalAlignment.Left}
									VerticalAlignment={Enum.VerticalAlignment.Center}
								></uilistlayout>

								{Object.entries(itemRecipe.inputItems).map(([itemName, count], index) => {
									return (
										<ItemRecipeItem
											itemName={itemName}
											index={index}
											itemCount={count}
											itemPerMinute={math.ceil(count * (60 / itemRecipe.time))}
										></ItemRecipeItem>
									);
								})}

								{Object.entries(itemRecipe.inputItems).size() > 0 ? (
									<ItemRecipeArrow
										index={Object.entries(itemRecipe.inputItems).size()}
									></ItemRecipeArrow>
								) : undefined}

								<Frame size={new UDim2(0.097, 0, 0.63, 0)} backgroundColor={colors.mediumgrey}>
									<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

									<Image
										anchorPoint={new Vector2(0.5, 0.5)}
										position={new UDim2(0.5, 0, 0.5, 0)}
										size={new UDim2(0.7, 0, 0.7, 0)}
										image={STRUCTURES[itemRecipe.structureName].image}
										imageTransparency={animation.map((value) => 1 - value)}
									></Image>
									<Text
										anchorPoint={new Vector2(0.5, 0.5)}
										position={new UDim2(0.36, 0, 1, 0)}
										size={new UDim2(0.311, 0, 0.307, 0)}
										font={fonts.josefinSans.medium}
										text={`${itemRecipe.time}s`}
										textSize={18}
										textColor={colors.white}
									>
										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(1.85, 0, 0.42, 0)}
											size={new UDim2(0.981, 0, 1, 0)}
											image={IMAGES.ui.Clock}
											imageTransparency={animation.map((value) => 1 - value)}
										></Image>
									</Text>
								</Frame>

								<ItemRecipeArrow
									index={Object.entries(itemRecipe.inputItems).size() + 1}
								></ItemRecipeArrow>

								<ItemRecipeItem
									itemName={itemRecipe.outputItem}
									index={Object.entries(itemRecipe.inputItems).size() - 1}
									itemCount={1}
									itemPerMinute={math.ceil(60 / itemRecipe.time)}
								></ItemRecipeItem>
							</Frame>

							<Image
								anchorPoint={new Vector2(0.5, 0.5)}
								position={new UDim2(0.5, 0, 0.5, 0)}
								size={new UDim2(1, 0, 1, 0)}
								image="rbxassetid://122009683399101"
								imageTransparency={lerpBinding(animation, 1, 0.94)}
								zIndex={0}
							></Image>
						</Frame>
					))}
				</Frame>
			</Frame>
		</canvasgroup>
	);
}
