import { lerpBinding, useEventListener, useMotion, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { TOOLS } from "client/constants/navigation/tools";
import { EventBus } from "client/event-bus";
import { Events } from "client/network";
import { selectContext } from "client/store/context";
import { colors, fonts, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { Button, CanvasGroup, Frame, Image, Text } from "../core";

export function ExpansionModal() {
	const context = useSelector(selectContext);
	const [expansion, setExpansion] = useState<Part>();
	const [mountAnimation, mountAnimationMotion] = useMotion(0);

	useEventListener(EventBus.OnPlotInitialization, (player, plot) => {
		if (player !== Players.LocalPlayer) return;
		for (const expansion of plot.WaitForChild("Expansions").GetChildren() as Part[]) {
			const frame = expansion.GetDescendants().find((instance): instance is Frame => instance.IsA("Frame"))!;
			const textLabel = expansion
				.GetDescendants()
				.find((instance): instance is TextLabel => instance.IsA("TextLabel"))!;
			const button = expansion
				.GetDescendants()
				.find((instance): instance is TextButton => instance.IsA("TextButton"))!;
			const beam = expansion.GetDescendants().find((instance): instance is Beam => instance.IsA("Beam"))!;

			if (expansion.GetAttribute("Owned") === true) {
				expansion.CanQuery = false;
				frame.BackgroundTransparency = 1;
				textLabel.TextTransparency = 1;
				button.Active = false;
				button.Interactable = false;
				beam.Enabled = false;
			} else {
				const connections = [
					UserInputService.InputBegan.Connect((input) => {
						if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							expansion.CanQuery = false;
							button.Active = false;
							button.Interactable = false;
						}
					}),
					UserInputService.InputEnded.Connect((input) => {
						if (input.UserInputType === Enum.UserInputType.MouseButton1) {
							expansion.CanQuery = true;
							button.Active = true;
							button.Interactable = true;
						}
					}),
					button.MouseButton1Down.Connect(() => {
						setExpansion(expansion);
					}),
					Events.OnPlotReset.connect((player) => {
						if (player !== Players.LocalPlayer) return;
						for (const connection of connections) {
							connection.Disconnect();
						}
						connections.clear();
					}),
					Events.OnExpansionPurchase.connect((player, expansion_) => {
						if (player === Players.LocalPlayer && expansion_ === expansion) {
							expansion.CanQuery = false;
							frame.BackgroundTransparency = 1;
							textLabel.TextTransparency = 1;
							button.Active = false;
							button.Interactable = false;
							beam.Enabled = false;
							for (const connection of connections) {
								connection.Disconnect();
							}
							connections.clear();
						}
					}),
				];
			}
		}
	});

	useUpdateEffect(() => {
		if (context === undefined) {
			setExpansion(undefined);
		}
		for (const expansion of Workspace.WaitForChild("Plots")
			.GetChildren()
			.find((plot): plot is Model => plot.GetAttribute("UserId") === Players.LocalPlayer.UserId)!
			.WaitForChild("Expansions")
			.GetChildren()
			.filter((expansion): expansion is Part => expansion.GetAttribute("Owned") === false)) {
			expansion.CanQuery = context !== undefined && context in TOOLS;
			TweenService.Create(
				expansion.FindFirstChildOfClass("SurfaceGui")!.FindFirstChildOfClass("Frame")!,
				new TweenInfo(0.5),
				{ BackgroundTransparency: context !== undefined && context in TOOLS ? 0.25 : 1 },
			).Play();
			TweenService.Create(
				expansion.FindFirstChildOfClass("SurfaceGui")!.FindFirstChildOfClass("TextLabel")!,
				new TweenInfo(0.5),
				{ TextTransparency: context !== undefined && context in TOOLS ? 0 : 1 },
			).Play();
			expansion.FindFirstChildOfClass("SurfaceGui")!.FindFirstChildOfClass("TextButton")!.Interactable =
				context !== undefined && context in TOOLS;
			expansion.FindFirstChildOfClass("Beam")!.Enabled = context !== undefined && context in TOOLS;
		}
	}, [context]);

	useUpdateEffect(() => {
		mountAnimationMotion.spring(
			context !== undefined && context in TOOLS && expansion !== undefined ? 1 : 0,
			springs.gentle,
		);
	}, [expansion]);

	return (
		<CanvasGroup
			GroupTransparency={mountAnimation.map((value) => 1 - value)}
			Active={context !== undefined && context in TOOLS && expansion !== undefined}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={lerpBinding(mountAnimation, UDim2.fromScale(0, 0), UDim2.fromScale(0.264, 0.157))}
			BackgroundColor3={colors.black}
			Interactable={context !== undefined && context in TOOLS && expansion !== undefined}
			ZIndex={4}
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
				Text={`You can unlock this expansion for $${
					expansion !== undefined
						? expansion
								.FindFirstChildOfClass("SurfaceGui")!
								.FindFirstChildOfClass("TextLabel")!
								.Text.gsub("%D", "")[0]
						: ""
				}. Are you sure you want to unlock this expansion ?`}
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
									.Value >=
								tonumber(
									expansion!
										.FindFirstChildOfClass("SurfaceGui")!
										.FindFirstChildOfClass("TextLabel")!
										.Text.gsub("%D", "")[0],
								)!
							) {
								Events.PurchaseExpansion(expansion!);
							} else {
								EventBus.OnNotification.Fire(
									`<FontFace color="rgb(255, 98, 98)">You need $${
										tonumber(
											expansion!
												.FindFirstChildOfClass("SurfaceGui")!
												.FindFirstChildOfClass("TextLabel")!
												.Text.gsub("%D", "")[0],
										)! -
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
						Image={IMAGES.ui.Glow}
						ImageColor3={colors.lightblue}
						ImageTransparency={0.8}
					></Image>
				</Button>
			</Frame>
		</CanvasGroup>
	);
}
