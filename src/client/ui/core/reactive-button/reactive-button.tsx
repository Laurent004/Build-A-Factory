import React, { forwardRef, useRef } from "@rbxts/react";
import { useButtonState } from "./use-button-state";
import { useButtonAnimation } from "./use-button-animation";
import { Button } from "../button";
import { lerpBinding, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { Frame } from "../frame";

export interface ReactiveButtonProps extends React.PropsWithChildren {
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onClick?: () => void;
	onDoubleClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;

	onHover?: (hover: boolean) => void;
	onPress?: (press: boolean) => void;

	ref?: React.Ref<TextButton>;
	enabled?: boolean | React.Binding<boolean>;
	anchorPoint?: Vector2 | React.Binding<Vector2>;
	position?: UDim2 | React.Binding<UDim2>;
	size?: UDim2 | React.Binding<UDim2>;
	rotation?: number | React.Binding<number>;
	backgroundTransparency?: number | React.Binding<number>;
	backgroundColor?: Color3 | React.Binding<Color3>;
	borderColor?: Color3 | React.Binding<Color3>;
	borderMode?: Enum.BorderMode | React.Binding<Enum.BorderMode>;
	borderSizePixels?: number | React.Binding<number>;
	layoutOrder?: number | React.Binding<number>;
	visible?: boolean | React.Binding<boolean>;
	zIndex?: number | React.Binding<number>;
	clipsDescendants?: boolean | React.Binding<boolean>;
	event?: React.InstanceEvent<TextButton>;
	change?: React.InstanceChangeEvent<TextButton>;

	animatePosition?: boolean;
	animatePositionDirection?: Vector2;
	animatePositionStrength?: number;
	animateSize?: boolean;
	animateSizeStrength?: number;
}

export const ReactiveButton = forwardRef((props: ReactiveButtonProps, ref: React.Ref<TextButton>) => {
	const {
		onMouseEnter,
		onMouseLeave,
		onClick,
		onDoubleClick,
		onMouseDown,
		onMouseUp,

		onHover,
		onPress,

		enabled = true,
		anchorPoint,
		position,
		size,
		rotation,
		backgroundTransparency,
		backgroundColor,
		borderColor,
		borderMode,
		layoutOrder,
		visible,
		zIndex,
		clipsDescendants,
		event,
		change,

		animatePosition = true,
		animatePositionDirection = new Vector2(0, 1),
		animatePositionStrength = 1,
		animateSize = true,
		animateSizeStrength = 1,
		children,
	} = props;

	const [hovered, pressed, buttonEvents] = useButtonState();
	const animation = useButtonAnimation(hovered, pressed);

	useUpdateEffect(() => {
		onHover?.(hovered);
	}, [hovered]);

	useUpdateEffect(() => {
		onPress?.(pressed);
	}, [pressed]);

	return (
		<Button
			ref={ref}
			onMouseEnter={() => {
				buttonEvents.onMouseEnter();
				onMouseEnter?.();
			}}
			onMouseLeave={() => {
				buttonEvents.onMouseLeave();
				onMouseLeave?.();
			}}
			onClick={() => {
				if (!enabled) return;
				onClick?.();
			}}
			onDoubleClick={() => {
				if (!enabled) return;
				onDoubleClick?.();
			}}
			onMouseDown={() => {
				if (!enabled) return;
				buttonEvents.onMouseDown();
				onMouseDown?.();
			}}
			onMouseUp={() => {
				if (!enabled) return;
				buttonEvents.onMouseUp();
				onMouseUp?.();
			}}
			anchorPoint={anchorPoint}
			position={position}
			rotation={rotation}
			size={size}
			backgroundTransparency={1}
			event={event}
			change={change}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={lerpBinding(
					animatePosition ? animation.position : 0,
					new UDim2(0.5, 0, 0.5, 0),
					new UDim2(0.5, 0, 0.5, 1.5 + animatePositionDirection.Y * animatePositionStrength),
				)}
				size={new UDim2(1, 0, 1, 0)}
				backgroundTransparency={backgroundTransparency ?? 1}
				backgroundColor={backgroundColor}
				borderColor={borderColor}
				borderMode={borderMode}
				layoutOrder={layoutOrder}
				visible={visible}
				zIndex={zIndex}
				clipsDescendants={clipsDescendants}
			>
				{children}
			</Frame>
		</Button>
	);
});
