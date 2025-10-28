import React, { useEffect } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { SplitterOutputFilter, splitterOutputFilters } from "client/components/transporters/splitters/smart-splitter";

export interface SplitterDropdownFilterButtonProps {
	size: UDim2;
	index: number;
	outputFilter: SplitterOutputFilter;
	selectedOutputFilter: SplitterOutputFilter;
	dropdownOpen: boolean;
	searchText: string;
	onClick: () => void;
}

export function SplitterInfoPanelFilterDropdownButton(props: SplitterDropdownFilterButtonProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (!props.dropdownOpen) return;
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.07, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});

		if (props.selectedOutputFilter === props.outputFilter) {
			onClickAnimationMotion.immediate(0);
			task.delay((props.index + 1) * 0.07, () => {
				onClickAnimationMotion.spring(1, springs.slow);
			});
		}
	}, [props.dropdownOpen]);

	useEffect(() => {
		onClickAnimationMotion.spring(props.selectedOutputFilter === props.outputFilter ? 1 : 0, springs.slow);
	}, [props.selectedOutputFilter]);

	return (
		<Button
			size={props.size}
			layoutOrder={splitterOutputFilters.indexOf(props.outputFilter)}
			visible={
				string.find(string.lower(props.outputFilter), string.lower(props.searchText), 1, true)[0] !== undefined
			}
			onClick={() => {
				props.onClick();
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Transparency={onClickAnimation.map((value) => 1 - value)}
				Enabled={props.selectedOutputFilter === props.outputFilter}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.12, 0, 0.5, 0)}
				size={new UDim2(0.162, 0, 0.4, 0)}
				image={IMAGES.ui[props.outputFilter]}
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.625, 0, 0.5, 0)}
				size={new UDim2(0.76, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				text={props.outputFilter}
				textSize={11}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
				textColor={lerpBinding(onClickAnimation, colors.white, colors.lightblue)}
				textWrapped={true}
				textXAlignment={Enum.TextXAlignment.Left}
				textYAlignment={Enum.TextYAlignment.Center}
			></Text>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				size={new UDim2(2, 0, 2, 0)}
				image={IMAGES.ui.Glow}
				imageColor={colors.lightblue}
				imageTransparency={lerpBinding(onClickAnimation, 1, 0.75)}
			></Image>
		</Button>
	);
}
