import React from "@rbxts/react";
import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { App } from "./app";
import { RootProvider } from "client/providers/root-provider";

const root = createRoot(new Instance("Folder"));
root.render(
	createPortal(
		<StrictMode>
			<RootProvider>
				<App></App>
			</RootProvider>
		</StrictMode>,
		Players.LocalPlayer.WaitForChild("PlayerGui"),
	),
);
