import { useMemo, useState } from "@rbxts/react";

export interface ButtonEvents {
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onMouseDown: () => void;
	onMouseUp: () => void;
}

export function useButtonState() {
	const [{ hover, press }, setState] = useState({ hover: false, press: false });
	const buttonEvents: ButtonEvents = useMemo(() => {
		return {
			onMouseEnter: () => {
				setState((state) => ({ ...state, hover: true }));
			},
			onMouseLeave: () => {
				setState((state) => ({ ...state, hover: false }));
			},
			onMouseDown: () => {
				setState((state) => ({ ...state, press: true }));
			},
			onMouseUp: () => {
				setState((state) => ({ ...state, press: false }));
			},
		};
	}, []);

	return $tuple(hover, press, buttonEvents);
}
