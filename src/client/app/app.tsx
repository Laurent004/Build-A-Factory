import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { store } from "client/store";
import { Layer } from "client/ui/core/layer";
import { BuildMenu } from "client/ui/hud/menus/build/build-menu";
import { ItemMenu } from "client/ui/hud/menus/items/item-menu";
import { Notifications } from "client/ui/hud/notifications/notifications";
import { ExtractorPanel } from "client/ui/hud/panels/extractor-panel";
import { ManufacturerPanel } from "client/ui/hud/panels/manufacturer-panel";
import { SplitterPanel } from "client/ui/hud/panels/splitter-panel";
import { StorageContainerPanel } from "client/ui/hud/panels/storage-container-panel";
import { StructurePanel } from "client/ui/hud/panels/structure-panel";
import { Sections } from "client/ui/hud/sections/sections";
import { Toolbar } from "client/ui/hud/toolbar/toolbar";

export function App() {
	return (
		<ReflexProvider producer={store}>
			<Layer>
				<Toolbar></Toolbar>
				<Sections></Sections>

				<BuildMenu></BuildMenu>
				<ItemMenu></ItemMenu>

				<StructurePanel></StructurePanel>
				<ExtractorPanel></ExtractorPanel>
				<SplitterPanel></SplitterPanel>
				<ManufacturerPanel></ManufacturerPanel>
				<StorageContainerPanel></StorageContainerPanel>

				<Notifications></Notifications>
			</Layer>
		</ReflexProvider>
	);
}
