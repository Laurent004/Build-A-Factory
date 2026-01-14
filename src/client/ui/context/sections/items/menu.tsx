import React, { useEffect, useMemo, useState } from "@rbxts/react";
import { lerpBinding, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { colors, fonts, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { ITEM_RECIPES, ITEMS } from "shared/constants/items";
import { Object } from "@rbxts/luau-polyfill";
import { ItemsMenuItemButton } from "./item-button";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";
import { Button, CanvasGroup, Frame, Image, NumberSpinner, ScrollingFrame, Text, TextBox } from "client/ui/core";
import { useStore } from "client/hooks";
import { STRUCTURES } from "shared/constants/structures";

export function ItemsMenu() {
	const store = useStore();
	const context = useSelector(selectContext);
	const [selectedItemName, setSelectedItemName] = useState<string>("Iron Ore");

	const [searchText, setSearchText] = useState<string>("");
	const visibleItems = useMemo<string[]>(
		() => Object.keys(ITEMS).filter((itemName) => itemName.lower().find(searchText.lower())[0] !== undefined),
		[searchText],
	);

	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(context === "Items" ? 1 : 0, springs.gentle);
	}, [context]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={context === "Items"}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromOffset(0, 0), UDim2.fromScale(.473,.708))}
			BackgroundColor3={colors.black}
			Interactable={context === "Items"}
			ZIndex={2}
		>
			<Frame Size={UDim2.fromScale(1, 0.082)} BackgroundTransparency={1}>
				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.033, 0.465)}
					Size={UDim2.fromScale(0.035, 0.5)}
					Image={IMAGES.ui.Items}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.098, 0.5)}
					Size={UDim2.fromScale(0.069, 0.4)}
					FontFace={fonts.josefinSans.bold}
					Text="Items"
					TextSize={24}
					TextXAlignment={Enum.TextXAlignment.Left}
				></Text>

				<Button
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.96, 0.5)}
					Size={UDim2.fromScale(0.029, 0.42)}
					Event={{
						MouseButton1Click: () => {
							store.setContext(undefined);
						},
					}}
				>
					<Image Size={UDim2.fromScale(1, 1)} Image={IMAGES.ui.Close}></Image>
				</Button>
			</Frame>

			<ScrollingFrame
				Position={UDim2.fromScale(0, 0.082)}
				Size={UDim2.fromScale(0.262, 0.918)}
			>	
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					BorderStrokePosition={Enum.BorderStrokePosition.Center}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>
				
				<Frame
					Size={UDim2.fromScale(1,.125)}
					BackgroundTransparency={1}
					LayoutOrder={0}
				>
					<Frame
						Position={UDim2.fromScale(0, 0.33)}
						Size={UDim2.fromScale(0.88, 0.32)}
						BackgroundColor3={colors.white}
					>
						<uigradient
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, Color3.fromRGB(77, 77, 77)),
									new ColorSequenceKeypoint(1, Color3.fromRGB(31, 31, 31)),
								])
							}
							Rotation={90}
						></uigradient>

						<uistroke
							ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
							Color={Color3.fromRGB(71, 71, 71)}
							LineJoinMode={Enum.LineJoinMode.Miter}
						></uistroke>

						<TextBox
							Size={UDim2.fromScale(1, 1)}
							PlaceholderText={"Search for..."}
							PlaceholderColor3={colors.grey}
							TextSize={14}
							TextTruncate={Enum.TextTruncate.SplitWord}
							TextXAlignment={Enum.TextXAlignment.Left}
							Change={{
								Text: (textBox) => {
									setSearchText(textBox.Text);
								},
							}}
						>
							<uipadding PaddingLeft={new UDim(0, 9)} PaddingRight={new UDim(0, 28)}></uipadding>
						</TextBox>

						<Image
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.92, 0.5)}
							Size={UDim2.fromScale(0.082, 0.62)}
							Image="rbxassetid://136023776711700"
							ImageColor3={Color3.fromRGB(190, 190, 190)}
						></Image>
					</Frame>
				</Frame>

				{Object.keys(ITEMS)
					.sort((itemA, itemB) => ITEMS[itemA].index < ITEMS[itemB].index)
					.map((itemName, index) => (
						<ItemsMenuItemButton
							itemName={itemName}
							mouseButton1Click={() => setSelectedItemName(itemName)}
							index={index}
							isVisible={visibleItems.includes(itemName)}
							isSelected={selectedItemName===itemName}
						></ItemsMenuItemButton>
				))}
			</ScrollingFrame>

			<Frame
				Position={UDim2.fromScale(0.262, 0.082)}
				Size={UDim2.fromScale(0.738, 0.299)}
				BackgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.176, 0.462)}
					Size={UDim2.fromScale(0.26, 0.764)}
					Image={ITEMS[selectedItemName].image}
				></Image>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.563, 0.144)}
					Size={UDim2.fromScale(0.422, 0.124)}
					FontFace={fonts.josefinSans.medium}
					Text={selectedItemName}
					TextSize={30}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.638, 0.29)}
					Size={UDim2.fromScale(0.571, 0.07)}
					FontFace={fonts.josefinSans.italic}
					Text={ITEMS[selectedItemName].description}
					TextSize={13}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<Text
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.389, 0.4)}
					Size={UDim2.fromScale(0.071, 0.068)}
					Text={"Value :"}
					TextSize={13}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
				></Text>

				<NumberSpinner
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.47, 0.4)}
					Size={UDim2.fromScale(0.083, 0.068)}
					FontFace={fonts.josefinSans.italic}
					TextSize={13}
					TextColor3={colors.lightblue}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextYAlignment={Enum.TextYAlignment.Top}
					value={ITEMS[selectedItemName].value}
					duration={0.3}
					decimals={2}
					prefix="$"
					suffix=""
					commas={true}
					digitSize={new UDim2(0, 9, 1, 0)}
					prefixSize={UDim2.fromScale(0.16, 1)}
					suffixSize={UDim2.fromScale(0.16, 1)}
					commaSize={UDim2.fromScale(0.04, 1)}
				></NumberSpinner>

				<Image
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.441, 0.4)}
					Size={UDim2.fromScale(0.06, 0.179)}
					Image={IMAGES.ui.Glow}
					ImageColor3={colors.lightblue}
					ImageTransparency={0.9}
				></Image>
			</Frame>

			<ScrollingFrame
				Position={UDim2.fromScale(0.262, 0.381)}
				Size={UDim2.fromScale(0.738, 0.619)}
				ZIndex={0}
			>
				<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder}></uilistlayout>

				<Frame Size={UDim2.fromScale(1,0.04)} BackgroundTransparency={1} LayoutOrder={0}></Frame>

 				<Frame Size={UDim2.fromScale(0.428, 0.06)} BackgroundColor3={colors.white} LayoutOrder={1}>
					<uigradient
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(21, 21, 21)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(139, 139, 139)),
							])
						}
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0, 0),
								new NumberSequenceKeypoint(0.481, 0.72, 0),
								new NumberSequenceKeypoint(1, 1, 0),
							])
						}
					></uigradient>

					<Text
						Size={UDim2.fromScale(1, 1)}
						Text={"Recipes"}
						TextSize={14}
						TextXAlignment={Enum.TextXAlignment.Left}
					>
						<uipadding PaddingLeft={new UDim(0, 14)}></uipadding>
					</Text>
				</Frame>

				{Object.entries(ITEM_RECIPES)
					.filter(([, recipeDefinition]) => recipeDefinition.outputItems[selectedItemName] !== undefined).sort(([,recipeDefinitionA],[,recipeDefinitionB])=>recipeDefinitionA.index<recipeDefinitionB.index)
					.map(([recipeName, recipeDefinition],index) => (
						<Frame Size={UDim2.fromScale(1, 0.3)} BackgroundTransparency={1} LayoutOrder={index+2}>
							<Frame
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.92, .79)}
								BackgroundColor3={Color3.fromRGB(32, 32, 32)}
							>
								<uicorner CornerRadius={new UDim(0, 6)}></uicorner>

								<uistroke
									ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
									Color={Color3.fromRGB(47, 47, 47)}
								></uistroke>

								<Image
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.5, 0.5)}
									Size={UDim2.fromScale(1.3, 1)}
									ZIndex={0}
									Image="rbxassetid://122009683399101"
								>
									<uigradient
										Transparency={
											new NumberSequence([
												new NumberSequenceKeypoint(0, 0.99),
												new NumberSequenceKeypoint(0.5, 0.94),
												new NumberSequenceKeypoint(1, 0.99),
											])
										}
									></uigradient>
								</Image>

								<Text
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.163, 0.183)}
									Size={UDim2.fromScale(0.273, 0.11)}
									FontFace={fonts.josefinSans.semiBold}
									Text={recipeName}
									TextSize={14}
									TextXAlignment={Enum.TextXAlignment.Left}
								></Text>

								<Frame
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={UDim2.fromScale(0.484, 0.612)}
									Size={UDim2.fromScale(0.913, 0.63)}
									BackgroundTransparency={1}
								>
									<uilistlayout
										Padding={new UDim(0, 12)}
										FillDirection={Enum.FillDirection.Horizontal}
										SortOrder={Enum.SortOrder.LayoutOrder}
										VerticalAlignment={Enum.VerticalAlignment.Center}
									></uilistlayout>

									{Object.entries(recipeDefinition.inputItems)
										.sort(
											([itemNameA], [itemNameB]) =>
												ITEMS[itemNameA].index < ITEMS[itemNameB].index,
										)
										.map(([itemName, count], index) => (
											<Frame
												Size={UDim2.fromScale(0.095, 0.75)}
												BackgroundColor3={Color3.fromRGB(42, 42, 42)}
												LayoutOrder={index}
												Event={{MouseEnter:()=>{
													store.setTips([itemName,`<font weight="regular" color="rgb(176,208,255)">${
																			math.floor(60 / recipeDefinition.time) * count
																		}</font> per minute`,])

												},MouseLeave:()=>{
													store.setTips([])
												}}}
											>
												<Image
													AnchorPoint={new Vector2(0.5, 0.5)}
													Position={UDim2.fromScale(0.5, 0.5)}
													Size={UDim2.fromScale(0.7, 0.7)}
													Image={ITEMS[itemName].image}
												></Image>

												<Text
													Position={UDim2.fromScale(0.6, 0.77)}
													Size={UDim2.fromScale(0.67, 0.3)}
													Text={`x${count}`}
													TextSize={22}
												></Text>
											</Frame>
										))}

									<Image
										Size={UDim2.fromScale(0.064, 0.414)}
										LayoutOrder={Object.entries(recipeDefinition.inputItems).size()}
										Visible={Object.entries(recipeDefinition.inputItems).size() > 0}
										Image="rbxassetid://87835167641652"
										ImageColor3={colors.lightblue}
									>
										<Image
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={UDim2.fromScale(0.5, 0.5)}
											Size={UDim2.fromScale(1.65, 2)}
											Image={IMAGES.ui.Glow}
											ImageColor3={colors.lightblue}
											ImageTransparency={0.9}
										></Image>
									</Image>

								
									<Frame
										Size={UDim2.fromScale(0.095, 0.75)}
										BackgroundColor3={Color3.fromRGB(42, 42, 42)}
										LayoutOrder={
											Object.entries(recipeDefinition.inputItems).size() > 0
												? Object.entries(recipeDefinition.inputItems).size() + 1
												: 0
										}
										Event={{MouseEnter:()=>{
											store.setTips([recipeDefinition.structureName])
										},MouseLeave:()=>{
											store.setTips([])
										}}}
									>
										<Image
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={UDim2.fromScale(0.5, 0.5)}
											Size={UDim2.fromScale(0.7, 0.7)}
											Image={STRUCTURES[recipeDefinition.structureName].image}
										></Image>

										<Text
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={UDim2.fromScale(0.5, 1)}
											Size={UDim2.fromScale(0.5, 0.307)}
											Text={`${recipeDefinition.time}s`}
											TextSize={18}
										></Text>
									</Frame>

									<Image
										Size={UDim2.fromScale(0.064, 0.414)}
										LayoutOrder={
											Object.entries(recipeDefinition.inputItems).size() > 0
												? Object.entries(recipeDefinition.inputItems).size() + 2
												: 1
										}
										Image="rbxassetid://87835167641652"
										ImageColor3={colors.lightblue}
									>
										<Image
											AnchorPoint={new Vector2(0.5, 0.5)}
											Position={UDim2.fromScale(0.5, 0.5)}
											Size={UDim2.fromScale(1.65, 2)}
											Image={IMAGES.ui.Glow}
											ImageColor3={colors.lightblue}
											ImageTransparency={0.9}
										></Image>
									</Image>

									{Object.entries(recipeDefinition.outputItems)
										.sort(
											([itemNameA], [itemNameB]) =>
												ITEMS[itemNameA].index < ITEMS[itemNameB].index,
										)
										.map(([itemName, count], index) => (
											<Frame
												Size={UDim2.fromScale(0.095, 0.75)}
												BackgroundColor3={Color3.fromRGB(42, 42, 42)}
												LayoutOrder={index+Object.entries(recipeDefinition.inputItems).size()+3}
												Event={{MouseEnter:()=>{
													store.setTips([itemName,`<font weight="regular" color="rgb(176,208,255)">${
																			math.floor(60 / recipeDefinition.time) * count
																		}</font> per minute`,])

												},MouseLeave:()=>{
													store.setTips([])
												}}}
											>
												<Image
													AnchorPoint={new Vector2(0.5, 0.5)}
													Position={UDim2.fromScale(0.5, 0.5)}
													Size={UDim2.fromScale(0.7, 0.7)}
													Image={ITEMS[itemName].image}
												></Image>

												<Text
													Position={UDim2.fromScale(0.6, 0.77)}
													Size={UDim2.fromScale(0.67, 0.3)}
													Text={`x${count}`}
													TextSize={22}
												></Text>
											</Frame>
										))}
								</Frame>
							</Frame>
						</Frame>
					))}
			</ScrollingFrame>
		</CanvasGroup>
	);
}
