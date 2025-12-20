import React, { useEffect } from "@rbxts/react";
import { Text } from "client/ui/core/text";
import { fonts, colors, springs } from "client/ui/constants";
import { IMAGES } from "shared/assets/images";
import { lerpBinding, useMotion } from "@rbxts/pretty-react-hooks";
import { Image } from "client/ui/core/image";
import { Button } from "client/ui/core/button";
import { SplitterFilter, splitterFilters } from "client/components/logistics/splitters/smart-splitter";

export interface InfoPanelFiltersDropdownButtonProps {
	index: number;
	filter: SplitterFilter;
	dropdownOpen: boolean;
	selectedFilter: SplitterFilter;
	searchText: string;
	size: UDim2;
	onClick: () => void;
}

export function InfoPanelFiltersDropdownButton(props: InfoPanelFiltersDropdownButtonProps) {
	const [onMountAnimation, onMountAnimationMotion] = useMotion(0);
	const [onClickAnimation, onClickAnimationMotion] = useMotion(0);

	useEffect(() => {
		if (!props.dropdownOpen) return;
		onMountAnimationMotion.immediate(0);
		task.delay((props.index + 1) * 0.07, () => {
			onMountAnimationMotion.spring(1, springs.gentle);
		});

		if (props.selectedFilter === props.filter) {
			onClickAnimationMotion.immediate(0);
			task.delay((props.index + 1) * 0.07, () => {
				onClickAnimationMotion.spring(1, springs.slow);
			});
		}
	}, [props.dropdownOpen]);

	useEffect(() => {
		onClickAnimationMotion.spring(props.selectedFilter === props.filter ? 1 : 0, springs.slow);
	}, [props.selectedFilter]);

	return (
		<Button
			anchorPoint={new Vector2(0, 0)}
			position={new UDim2(0, 0, 0, 0)}
			size={props.size}
			layoutOrder={splitterFilters.indexOf(props.filter)}
			visible={string.find(string.lower(props.filter), string.lower(props.searchText), 1, true)[0] !== undefined}
			onClick={() => {
				props.onClick();
			}}
		>
			<uistroke
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Color={colors.lightblue}
				LineJoinMode={Enum.LineJoinMode.Miter}
				Thickness={1}
				Transparency={onClickAnimation.map((value) => 1 - value)}
				Enabled={props.selectedFilter === props.filter}
			></uistroke>

			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.12, 0, 0.5, 0)}
				size={new UDim2(0.162, 0, 0.4, 0)}
				image={IMAGES.ui[props.filter]}
				imageTransparency={onMountAnimation.map((value) => 1 - value)}
			></Image>

			<Text
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.625, 0, 0.5, 0)}
				size={new UDim2(0.76, 0, 1, 0)}
				font={fonts.josefinSans.regular}
				text={props.filter}
				textSize={11}
				textColor={lerpBinding(onClickAnimation, colors.white, colors.lightblue)}
				textTransparency={onMountAnimation.map((value) => 1 - value)}
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
