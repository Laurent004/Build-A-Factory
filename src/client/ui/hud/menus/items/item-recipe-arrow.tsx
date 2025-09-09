import { useLifetime } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { colors } from "client/constants/colors";
import { Frame } from "client/ui/core/frame";
import { Image } from "client/ui/core/image";

export function ItemRecipeArrow() {
	return (
		<Frame size={new UDim2(0.089, 0, 0.373, 0)} backgroundTransparency={1}>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(1, 0, 1, 0)}
				image="rbxassetid://87835167641652"
				imageColor={colors.lightblue}
			>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(2, 0, 2, 0)}
					image="rbxassetid://137038247592087"
					imageColor={colors.lightblue}
					imageTransparency={0.88}
				></Image>
			</Image>
		</Frame>
	);
}
