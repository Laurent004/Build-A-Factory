import { Object } from "@rbxts/luau-polyfill";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useRef, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useStore } from "client/hooks";
import { colors, fonts } from "client/ui/constants";
import { Button, Frame, Text } from "client/ui/core";
import { TECHS } from "shared/constants/tech";
import { TechTreeMenuTechNode } from "./tech-node";
import { HttpService, Players } from "@rbxts/services";
import { selectContext } from "client/hooks/store/context";

export function TechTreeMenu() {
	const store = useStore();
	const context = useSelector(selectContext);
	const [techs, setTechs] = useState<string[]>([]);

	const isDragging = useRef(false);
	const lastMousePosition = useRef(Vector2.zero);
	const [position, setPosition] = useBinding<UDim2>(UDim2.fromScale(.5,.5))
	const [scale, setScale] = useBinding<number>(1);

	useEventListener(Players.LocalPlayer.GetAttributeChangedSignal("Techs"), () => {
		setTechs(HttpService.JSONDecode(Players.LocalPlayer.GetAttribute("Techs") as string) as string[]);
	});

	return (
		<Frame
			Active={context === "Tech Tree"}
			Size={UDim2.fromScale(1, 1)}
			BackgroundColor3={colors.black}
			Visible={context === "Tech Tree"}
			ZIndex={2}
			ClipsDescendants={true}
			Event={{
				InputBegan: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1||input.UserInputType===Enum.UserInputType.MouseButton3) {
						isDragging.current = true;
						lastMousePosition.current = new Vector2(input.Position.X, input.Position.Y);
					}
				},
				InputChanged: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseMovement && isDragging.current) {
						const mousePosition = new Vector2(input.Position.X, input.Position.Y);
						const offset = mousePosition.sub(lastMousePosition.current);
						lastMousePosition.current = mousePosition;
						setPosition(position.getValue().add(UDim2.fromOffset(offset.X, offset.Y)))
					}
					
					if(input.UserInputType===Enum.UserInputType.MouseWheel){
						const newScale=math.clamp(scale.getValue()*(1+input.Position.Z*.2),0.25,3)
						const mouseLocalPosition = UDim2.fromOffset(math.floor(input.Position.X - position.getValue().X.Offset), math.floor(input.Position.Y - position.getValue().Y.Offset + 36));
						setPosition(UDim2.fromOffset(position.getValue().X.Offset + (mouseLocalPosition.X.Offset - (mouseLocalPosition.X.Offset * (newScale/scale.getValue()))), position.getValue().Y.Offset + (mouseLocalPosition.Y.Offset - (mouseLocalPosition.Y.Offset * (newScale/scale.getValue())))));
						setScale(newScale)
					}
				},
				InputEnded: (_, input) => {
					if (input.UserInputType === Enum.UserInputType.MouseButton1||input.UserInputType===Enum.UserInputType.MouseButton3) {
						isDragging.current = false;
					}
				},
			}}
		>
			<Frame AnchorPoint={new Vector2(0.5, 0.5)} Position={position} BackgroundTransparency={1} ZIndex={0}>
				<uiscale Scale={scale}></uiscale>

				{Object.entries(TECHS)
					.filter(([, techDefinition]) => techDefinition.layout !== undefined)
					.map(([techName, techDefinition]) => (
						<>
							<TechTreeMenuTechNode
								techName={techName}
								isUnlocked={techs.includes(techName)}
							></TechTreeMenuTechNode>

							{techDefinition.requirements.mapFiltered((techName_)=>TECHS[techName_].layout!==undefined?TECHS[techName_]:undefined).map((techDefinition_)=>{
								const startPosition=new Vector2(techDefinition.layout!.column*300,techDefinition.layout!.row*300)
								const endPosition=new Vector2(techDefinition_.layout!.column*300,techDefinition_.layout!.row*300)
								const midY = (startPosition.Y+endPosition.Y) / 2;
								const distX = endPosition.X - startPosition.X;
								const distY = endPosition.Y - startPosition.Y;

								return (math.abs(distX) < 1?[
									{
										position: new UDim2(0, startPosition.X, 0, startPosition.Y + distY / 2),
										size: new UDim2(0, 2, 0, distY)
									}
									]:[
									// 1. Top Vertical (Start -> Mid)
									{
										position: new UDim2(0, startPosition.X, 0, (startPosition.Y + midY) / 2),
										size: new UDim2(0, 2, 0, math.abs(midY - startPosition.Y))
									},
									// 2. Horizontal (Across)
									{
										// Position is the center X between start and end, at Y=Mid
										position: new UDim2(0, (startPosition.X + endPosition.X) / 2, 0, midY),
										// Width is the distance + thickness (to plug gaps)
										size: new UDim2(0, math.abs(distX) + 2, 0, 2)
									},
									// 3. Bottom Vertical (Mid -> End)
									{
										position: new UDim2(0, endPosition.X, 0, (midY + endPosition.Y) / 2),
										size: new UDim2(0, 2, 0, math.abs(endPosition.Y - midY))
									}
								]).map((line)=>
									<Frame
										AnchorPoint={new Vector2(.5,.5)}
										Position={line.position}
										Size={line.size}
										BackgroundColor3={colors.white}
										ZIndex={0}
									></Frame>
								)

							}
								
							)}
						</>
					))}
			</Frame>

			<Button
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.94)}
				Size={UDim2.fromScale(0.03, 0.02)}
				Event={{
					MouseButton1Click: () => {
						store.setContext(undefined);
					},
				}}
			>
				<Text
					Size={UDim2.fromScale(1,1)}
					FontFace={fonts.josefinSans.bold}
					Text="Exit"
					TextSize={20}
				></Text>
			</Button>
		</Frame>
	);
}
