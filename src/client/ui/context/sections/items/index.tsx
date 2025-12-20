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
import { ItemsMenuRecipeItem } from "./recipe-item";
import { STRUCTURES } from "shared/constants/structures";
import { ItemsMenuRecipeArrow } from "./recipe-arrow";
import { useRem } from "client/hooks/use-rem";
import { ItemsMenuItemButton } from "./item-button";
import { NumberSpinner } from "client/ui/core/number-spinner";

export function ItemsMenu() {
	const store = useStore();
	const rem = useRem();
	const context = useSelector(selectContext);
	const itemName = useSelector(selectItemMenuItemName);
	const [searchText, setSearchText] = useState<string>("");
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onUpdateAnimation, onUpdateAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		onMountAnimationMotion.spring(context === "Items" ? 1 : 0, springs.gentle);
	}, [context]);

	useEffect(() => {
		if (context !== "Items") return;
		onUpdateAnimationMotion.immediate(0);
		onUpdateAnimationMotion.spring(1, springs.gentle);
	}, [context, itemName]);

	return (
		<canvasgroup
			GroupTransparency={onMountAnimation.map((value) => 1 - value)}
			Active={context === "Items"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={lerpBinding(onMountAnimation, new UDim2(0.5, 0, 0.66, 0), new UDim2(0.5, 0, 0.5, 0))}
			Size={lerpBinding(onMountAnimation, new UDim2(0, 0, 0, 0), new UDim2(0, rem(908), 0, rem(764)))}
			BackgroundColor3={colors.black}
			BorderSizePixel={0}
			Interactable={context === "Items"}
			ZIndex={2}
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
					text="Items"
					textSize={24}
					textColor={colors.white}
					textTransparency={onMountAnimation.map((value) => 1 - value)}
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
					Thickness={1}
				></uistroke>

				<scrollingframe
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Size={new UDim2(1, 0, 1, 0)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					CanvasSize={new UDim2(0, 0, 2, 0)}
					ScrollBarThickness={0}
					ScrollBarImageTransparency={1}
					ScrollingDirection={Enum.ScrollingDirection.Y}
				>
					<Frame
						anchorPoint={new Vector2(0, 0.5)}
						position={lerpBinding(
							onMountAnimation,
							new UDim2(-0.78, 0, 0.026, 0),
							new UDim2(0, 0, 0.026, 0),
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
							PlaceholderText={"Search for..."}
							PlaceholderColor3={colors.grey}
							Text=""
							TextSize={14}
							TextColor3={Color3.fromRGB(207, 207, 207)}
							TextXAlignment={Enum.TextXAlignment.Left}
							TextYAlignment={Enum.TextYAlignment.Center}
							Change={{
								Text: (textbox) => {
									setSearchText(textbox.Text);
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
							Padding={new UDim(0, 0)}
							FillDirection={Enum.FillDirection.Vertical}
							SortOrder={Enum.SortOrder.LayoutOrder}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						></uilistlayout>
						{Object.keys(ITEMS).map((itemName) => (
							<ItemsMenuItemButton itemName={itemName} searchText={searchText}></ItemsMenuItemButton>
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
					Thickness={1}
				></uistroke>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onUpdateAnimation,
						new UDim2(0.176, 0, 0.62, 0),
						new UDim2(0.176, 0, 0.462, 0),
					)}
					size={new UDim2(0.26, 0, 0.764, 0)}
					image={ITEMS[itemName].image}
					imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
				></Image>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onUpdateAnimation,
						new UDim2(0.563, 0, 0.3, 0),
						new UDim2(0.563, 0, 0.174, 0),
					)}
					size={new UDim2(0.422, 0, 0.184, 0)}
					font={fonts.josefinSans.medium}
					text={itemName}
					textSize={30}
					textColor={colors.white}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={lerpBinding(
						onUpdateAnimation,
						new UDim2(0.56, 0, 0.321, 0),
						new UDim2(0.638, 0, 0.321, 0),
					)}
					size={new UDim2(0.571, 0, 0.072, 0)}
					font={fonts.josefinSans.regular}
					text={`${ITEMS[itemName].description}`}
					textSize={13}
					textColor={colors.white}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.39, 0, 0.42, 0)}
					size={new UDim2(0.075, 0, 0.072, 0)}
					font={fonts.josefinSans.regular}
					text={"Value :"}
					textSize={13}
					textColor={colors.white}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<NumberSpinner
					value={ITEMS[itemName].value}
					duration={0.3}
					decimals={2}
					prefix="$"
					suffix=""
					commas={true}
					digitSize={new UDim2(0, 8, 1, 0)}
					prefixSize={new UDim2(0.16, 0, 1, 0)}
					suffixSize={new UDim2(0.16, 0, 1, 0)}
					commaSize={new UDim2(0.04, 0, 1, 0)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.47, 0, 0.42, 0)}
					size={new UDim2(0.083, 0, 0.072, 0)}
					font={fonts.josefinSans.regular}
					text=""
					textSize={13}
					textColor={colors.lightblue}
					textTransparency={onUpdateAnimation.map((value) => 1 - value)}
					textXAlignment={Enum.TextXAlignment.Left}
					textYAlignment={Enum.TextYAlignment.Top}
				></NumberSpinner>

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.447, 0, 0.41, 0)}
					size={new UDim2(0.11, 0, 0.2, 0)}
					image={IMAGES.ui.Glow}
					imageColor={colors.lightblue}
					imageTransparency={lerpBinding(onUpdateAnimation, 1, 0.9)}
				></Image>
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
					size={lerpBinding(onUpdateAnimation, new UDim2(0, 0, 0.047, 0), new UDim2(0.428, 0, 0.047, 0))}
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
						text={"Recipes"}
						textSize={14}
						textColor={colors.white}
						textTransparency={onUpdateAnimation.map((value) => 1 - value)}
						textXAlignment={Enum.TextXAlignment.Left}
						textYAlignment={Enum.TextYAlignment.Center}
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
						SortOrder={Enum.SortOrder.LayoutOrder}
					></uilistlayout>

					{Object.entries(ITEM_RECIPES)
						.filter(([, itemRecipeDefinition]) =>
							Object.keys(itemRecipeDefinition.outputItems).includes(itemName),
						)
						.map(([, recipeDefinition]) => (
							<Frame
								anchorPoint={new Vector2(0, 0)}
								position={new UDim2(0, 0, 0, 0)}
								size={new UDim2(1, 0, 0.217, 0)}
								backgroundColor={Color3.fromRGB(30, 30, 30)}
								backgroundTransparency={onUpdateAnimation.map((value) => 1 - value)}
								layoutOrder={recipeDefinition.index}
							>
								<uicorner CornerRadius={new UDim(0, 12)}></uicorner>
								<uistroke
									Color={Color3.fromRGB(50, 50, 50)}
									Transparency={onUpdateAnimation.map((value) => 1 - value)}
									Thickness={1}
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
										SortOrder={Enum.SortOrder.LayoutOrder}
										HorizontalAlignment={Enum.HorizontalAlignment.Left}
										VerticalAlignment={Enum.VerticalAlignment.Center}
									></uilistlayout>

									{Object.entries(recipeDefinition.inputItems).map(([itemName, count], index) => {
										return (
											<ItemsMenuRecipeItem
												index={index}
												itemName={itemName}
												itemCount={count}
												itemPerMinute={math.ceil(60 / recipeDefinition.time) * count}
											></ItemsMenuRecipeItem>
										);
									})}

									<>
										{Object.entries(recipeDefinition.inputItems).size() > 0 ? (
											<ItemsMenuRecipeArrow
												index={Object.entries(recipeDefinition.inputItems).size()}
											></ItemsMenuRecipeArrow>
										) : undefined}
									</>

									<Frame
										anchorPoint={new Vector2(0, 0)}
										position={new UDim2(0, 0, 0, 0)}
										size={new UDim2(0.097, 0, 0.63, 0)}
										backgroundColor={colors.mediumgrey}
										layoutOrder={
											Object.entries(recipeDefinition.inputItems).size() > 0
												? Object.entries(recipeDefinition.inputItems).size() + 1
												: 0
										}
									>
										<uicorner CornerRadius={new UDim(0, 64)}></uicorner>

										<Image
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.5, 0, 0.5, 0)}
											size={new UDim2(0.7, 0, 0.7, 0)}
											image={STRUCTURES[recipeDefinition.structureName].image}
											imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
										></Image>

										<Text
											anchorPoint={new Vector2(0.5, 0.5)}
											position={new UDim2(0.36, 0, 1, 0)}
											size={new UDim2(0.311, 0, 0.307, 0)}
											font={fonts.josefinSans.medium}
											text={`${recipeDefinition.time}s`}
											textSize={18}
											textColor={colors.white}
											textXAlignment={Enum.TextXAlignment.Center}
											textYAlignment={Enum.TextYAlignment.Center}
										>
											<Image
												anchorPoint={new Vector2(0.5, 0.5)}
												position={new UDim2(1.85, 0, 0.42, 0)}
												size={new UDim2(0.981, 0, 1, 0)}
												image="rbxassetid://121749492491165"
												imageTransparency={onUpdateAnimation.map((value) => 1 - value)}
											></Image>
										</Text>
									</Frame>

									<ItemsMenuRecipeArrow
										index={
											Object.entries(recipeDefinition.inputItems).size() > 0
												? Object.entries(recipeDefinition.inputItems).size() + 2
												: 1
										}
									></ItemsMenuRecipeArrow>

									{Object.entries(recipeDefinition.outputItems).map(([itemName, count], index) => (
										<ItemsMenuRecipeItem
											index={Object.entries(recipeDefinition.inputItems).size() + 2 + index}
											itemName={itemName}
											itemCount={count}
											itemPerMinute={math.ceil(60 / recipeDefinition.time) * count}
										></ItemsMenuRecipeItem>
									))}
								</Frame>

								<Image
									anchorPoint={new Vector2(0.5, 0.5)}
									position={new UDim2(0.5, 0, 0.5, 0)}
									size={new UDim2(1, 0, 1, 0)}
									zIndex={0}
									image="rbxassetid://122009683399101"
									imageTransparency={lerpBinding(onUpdateAnimation, 1, 0.94)}
								></Image>
							</Frame>
						))}
				</Frame>
			</Frame>
		</canvasgroup>
	);
}
