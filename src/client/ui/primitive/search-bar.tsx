import React from "@rbxts/react";
import { Frame } from "../core/frame";
import { Image } from "../core/image";
import { fonts } from "client/constants/fonts";

export interface SearchBarProps {
	position: UDim2 | React.Binding<UDim2>;
	size: UDim2 | React.Binding<UDim2>;

	magnifierImagePosition: UDim2 | React.Binding<UDim2>;
	magnifierImageSize: UDim2 | React.Binding<UDim2>;
	onSearchTextChanged: (newSearchText: string) => void;
}

export function SearchBar(props: SearchBarProps) {
	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			position={props.position}
			size={props.size}
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
				PlaceholderColor3={Color3.fromRGB(158, 158, 158)}
				PlaceholderText={"Search for..."}
				TextSize={14}
				TextColor3={Color3.fromRGB(207, 207, 207)}
				Text=""
				TextXAlignment={Enum.TextXAlignment.Left}
				Change={{
					Text: (textBox) => {
						props.onSearchTextChanged(textBox.Text);
					},
				}}
			></textbox>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={props.magnifierImagePosition}
				size={props.magnifierImageSize}
				image="rbxassetid://84360806740997"
				imageColor={Color3.fromRGB(158, 158, 158)}
			></Image>
		</Frame>
	);
}
