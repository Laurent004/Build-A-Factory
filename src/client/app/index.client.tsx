import React from "@rbxts/react";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "./app";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/hooks/store";

const root = createRoot(new Instance("Folder"));
root.render(
	createPortal(
		<StrictMode>
			<ReflexProvider producer={store}>
				<App></App>
			</ReflexProvider>
		</StrictMode>,
		Players.LocalPlayer.WaitForChild("PlayerGui"),
	),
);
