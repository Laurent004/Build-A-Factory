import { lerpBinding, useMotion, useMountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { Players, Workspace } from "@rbxts/services";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import { colors, fonts, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { Button, CanvasGroup, Frame, Image, Text } from "../core";

export function ExpansionModal() {
	const [expansion, setExpansion] = useState<Part>();
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useMountEffect(() => {
		for (const plot of Workspace.WaitForChild("Plots").GetChildren()) {
			for (const expansion of plot.WaitForChild("Expansions").GetChildren() as Part[]) {
				expansion.FindFirstChildOfClass("ClickDetector")?.MouseClick.Connect(() => {
					if (plot.GetAttribute("UserId") !== Players.LocalPlayer.UserId) return;
					setExpansion(expansion);
				});
				expansion.GetAttributeChangedSignal("IsOwned").Connect(() => {
					expansion.Transparency = expansion.GetAttribute("IsOwned") === true ? 1 : 0;
					expansion.CanCollide = expansion.GetAttribute("IsOwned") === false;
					expansion.CanQuery = expansion.GetAttribute("IsOwned") === false;
				});
			}
		}
	});

	useUpdateEffect(() => {
		mountAnimationMotion.spring(expansion !== undefined ? 1 : 0, springs.gentle);
	}, [expansion]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={expansion !== undefined}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.264, 0.157))}
			BackgroundColor3={colors.black}
			Interactable={expansion !== undefined}
			ZIndex={3}
		>
			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.273, 0.188)}
				Size={UDim2.fromScale(0.47, 0.11)}
				FontFace={fonts.josefinSans.bold}
				Text={"Unlock plot expansion ?"}
				TextSize={20}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Text
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.493, 0.49)}
				Size={UDim2.fromScale(0.91, 0.253)}
				LineHeight={1.5}
				Text={`You can unlock this expansion for $${expansion?.GetAttribute(
					"Cost",
				)}. Are you sure you want to unlock this expansion ?`}
				TextSize={16}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			></Text>

			<Frame
				AnchorPoint={new Vector2(0, 1)}
				Position={UDim2.fromScale(0, 1)}
				Size={UDim2.fromScale(1, 0.248)}
				BackgroundTransparency={1}
			>
				<Button
					Position={UDim2.fromScale(0, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							setExpansion(undefined);
						},
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text Size={UDim2.fromScale(1, 1)} Text={"Cancel"} TextSize={14}></Text>
				</Button>

				<Button
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.5, 1)}
					Event={{
						MouseButton1Click: () => {
							if (
								(Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild("Cash") as NumberValue)
									.Value >= (expansion!.GetAttribute("Cost") as number)
							) {
								Events.PurchaseExpansion(expansion!);
							} else {
								EventBus.OnNotification.Fire(
									`<FontFace color="rgb(255, 98, 98)">You need $${
										(expansion!.GetAttribute("Cost") as number) -
										(
											Players.LocalPlayer.WaitForChild("leaderstats").WaitForChild(
												"Cash",
											) as NumberValue
										).Value
									} more to unlock this expansion!</FontFace>`,
									"sfx/error",
								);
							}
							setExpansion(undefined);
						},
					}}
				>
					<uistroke
						ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
						Color={colors.grey}
						LineJoinMode={Enum.LineJoinMode.Miter}
					></uistroke>

					<Text
						Size={UDim2.fromScale(1, 1)}
						Text="Expand Plot"
						TextColor3={colors.lightblue}
						TextSize={14}
					></Text>

					<Image
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.8, 1)}
						Image={IMAGES.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={0.8}
					></Image>
				</Button>
			</Frame>
		</CanvasGroup>
	);
}
