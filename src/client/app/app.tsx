import React from "@rbxts/react";
import { Layer } from "client/ui/core/layer";
import { BuildMenu } from "client/ui/context/tools/build/menu";
import { ItemsMenu } from "client/ui/context/sections/items";
import { MinerInfoPanel } from "client/ui/context/tools/info/panels/production/miner";
import { ManufacturerInfoPanel } from "client/ui/context/tools/info/panels/production/manufacturer";
import { BaseStructureInfoPanel } from "client/ui/context/tools/info/panels/base-structure";
import { Sections } from "client/ui/context/sections/sections";
import { Tools } from "client/ui/context/tools/tools";
import { PriortyMergerInfoPanel } from "client/ui/context/tools/info/panels/logistics/priority-merger";
import { BlueprintDesigner } from "client/ui/context/tools/copy/blueprint-designer";
import { PowerPoleInfoPanel } from "client/ui/context/tools/info/panels/power/power-pole";
import { PowerSwitchInfoPanel } from "client/ui/context/tools/info/panels/power/power-switch";
import { Tutorial } from "client/ui/hud/tutorial";
import BaseStructureBuildInputPanel from "client/ui/context/tools/build/input/base-structure-panel";
import PathStructureBuildInputPanel from "client/ui/context/tools/build/input/path-structure-panel";
import UndergroundStructureBuildInputPanel from "client/ui/context/tools/build/input/underground-structure-panel";
import PowerLineBuildInputPanel from "client/ui/context/tools/build/input/power-line-panel";
import InfoInputPanel from "client/ui/context/tools/info/input/panel";
import EditInputPanel from "client/ui/context/tools/edit/input-panel";
import CleanerInputPanel from "client/ui/context/tools/cleaner/input-panel";
import DeleteInputPanel from "client/ui/context/tools/delete/input-panel";
import CopyInputPanel from "client/ui/context/tools/copy/input-panel";
import { SmartSplitterInfoPanel } from "client/ui/context/tools/info/panels/logistics/splitters/smart-splitter";
import { ProgrammableSplitterInfoPanel } from "client/ui/context/tools/info/panels/logistics/splitters/programmable-splitter";
import LiftStructureBuildInputPanel from "client/ui/context/tools/build/input/lift-structure-panel";
import { PipelineInfoPanel } from "client/ui/context/tools/info/panels/logistics/pipeline";
import { FluidExtractorInfoPanel } from "client/ui/context/tools/info/panels/production/fluid-extractor";
import CarBuildInputPanel from "client/ui/context/tools/build/input/car-panel";
import { Cash } from "client/ui/hud/cash";
import { DeleteWarning } from "client/ui/context/tools/delete/warning";
import { Notifications } from "client/ui/hud/notifications";
import { SettingsMenu } from "client/ui/context/sections/settings";
import { Load } from "client/ui/hud/load";
import { ShopMenu } from "client/ui/context/sections/shop";

export function App() {
	return (
		<Layer>
			<Load></Load>
			<Tutorial></Tutorial>
			<Cash></Cash>
			<Notifications></Notifications>

			<Sections></Sections>
			<ShopMenu></ShopMenu>
			<ItemsMenu></ItemsMenu>
			<SettingsMenu></SettingsMenu>

			<Tools></Tools>
			<InfoInputPanel></InfoInputPanel>
			<BaseStructureInfoPanel></BaseStructureInfoPanel>
			<PipelineInfoPanel></PipelineInfoPanel>
			<PriortyMergerInfoPanel></PriortyMergerInfoPanel>
			<SmartSplitterInfoPanel></SmartSplitterInfoPanel>
			<ProgrammableSplitterInfoPanel></ProgrammableSplitterInfoPanel>
			<MinerInfoPanel></MinerInfoPanel>
			<FluidExtractorInfoPanel></FluidExtractorInfoPanel>
			<ManufacturerInfoPanel></ManufacturerInfoPanel>
			<PowerPoleInfoPanel></PowerPoleInfoPanel>
			<PowerSwitchInfoPanel></PowerSwitchInfoPanel>

			<BuildMenu></BuildMenu>
			<BaseStructureBuildInputPanel></BaseStructureBuildInputPanel>
			<PathStructureBuildInputPanel></PathStructureBuildInputPanel>
			<UndergroundStructureBuildInputPanel></UndergroundStructureBuildInputPanel>
			<LiftStructureBuildInputPanel></LiftStructureBuildInputPanel>
			<CarBuildInputPanel></CarBuildInputPanel>
			<PowerLineBuildInputPanel></PowerLineBuildInputPanel>
			<EditInputPanel></EditInputPanel>
			<CopyInputPanel></CopyInputPanel>
			<BlueprintDesigner></BlueprintDesigner>
			<CleanerInputPanel></CleanerInputPanel>
			<DeleteInputPanel></DeleteInputPanel>
			<DeleteWarning></DeleteWarning>
		</Layer>
	);
}
