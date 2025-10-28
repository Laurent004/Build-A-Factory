import React from "@rbxts/react";
import { Layer } from "client/ui/core/layer";
import { BuildMenu } from "client/ui/context/tools/build/build-menu";
import { ItemsMenu } from "client/ui/context/sections/items/items-menu";
import { MinerInfoPanel } from "client/ui/context/tools/info/production-panels/miner-panel";
import { ManufacturerInfoPanel } from "client/ui/context/tools/info/production-panels/manufacturer-panel";
import { BaseStructureInfoPanel } from "client/ui/context/tools/info/base-structure-panel";
import { Sections } from "client/ui/hud/sections/sections";
import { Toolbar } from "client/ui/hud/toolbar/toolbar";
import { PriortyMergerInfoPanel } from "client/ui/context/tools/info/transportation-panels/priority-merger-panel";
import { BlueprintDesigner } from "client/ui/context/tools/copy/blueprint-designer";
import { PowerPoleInfoPanel } from "client/ui/context/tools/info/power-panels/power-pole-panel";
import { PowerSwitchInfoPanel } from "client/ui/context/tools/info/power-panels/power-switch-panel";
import { ShopMenu } from "client/ui/context/sections/shop/shop-menu";
import { MilestonesMenu } from "client/ui/context/sections/milestones/milestones-menu";
import { StorageContainerInfoPanel } from "client/ui/context/tools/info/transportation-panels/storage-container-panel";
import { ProgrammableSplitterInfoPanel } from "client/ui/context/tools/info/transportation-panels/splitters-panels/programmable-splitter";
import { SmartSplitterInfoPanel } from "client/ui/context/tools/info/transportation-panels/splitters-panels/smart-splitter";
import { TutorialMenu } from "client/ui/intro/tutorial-menu";
import BaseStructureBuildInputPanel from "client/ui/hud/inputs/build/base-structure-panel";
import ConveyorBuildInputPanel from "client/ui/hud/inputs/build/conveyor-build-panel";
import UndergroundBeltBuildInputPanel from "client/ui/hud/inputs/build/underground-belt-panel";
import PowerLineBuildInputPanel from "client/ui/hud/inputs/build/power-line-panel";
import InfoInputPanel from "client/ui/hud/inputs/info-panel";
import EditInputPanel from "client/ui/hud/inputs/edit-panel";
import CleanerInputPanel from "client/ui/hud/inputs/cleaner-panel";
import DeleteInputPanel from "client/ui/hud/inputs/delete-panel";
import CopyInputPanel from "client/ui/hud/inputs/copy-panel";
import { MilestoneNotification } from "client/ui/hud/notifications/milestone";

export function App() {
	return (
		<Layer>
			<TutorialMenu></TutorialMenu>

			<Sections></Sections>
			<Toolbar></Toolbar>
			<BlueprintDesigner></BlueprintDesigner>

			<ShopMenu></ShopMenu>
			<MilestonesMenu></MilestonesMenu>
			<ItemsMenu></ItemsMenu>
			<BuildMenu></BuildMenu>

			<MilestoneNotification></MilestoneNotification>

			<InfoInputPanel></InfoInputPanel>
			<BaseStructureBuildInputPanel></BaseStructureBuildInputPanel>
			<ConveyorBuildInputPanel></ConveyorBuildInputPanel>
			<UndergroundBeltBuildInputPanel></UndergroundBeltBuildInputPanel>
			<PowerLineBuildInputPanel></PowerLineBuildInputPanel>
			<EditInputPanel></EditInputPanel>
			<CopyInputPanel></CopyInputPanel>
			<CleanerInputPanel></CleanerInputPanel>
			<DeleteInputPanel></DeleteInputPanel>

			<BaseStructureInfoPanel></BaseStructureInfoPanel>
			<PriortyMergerInfoPanel></PriortyMergerInfoPanel>
			<SmartSplitterInfoPanel></SmartSplitterInfoPanel>
			<ProgrammableSplitterInfoPanel></ProgrammableSplitterInfoPanel>
			<MinerInfoPanel></MinerInfoPanel>
			<ManufacturerInfoPanel></ManufacturerInfoPanel>
			<StorageContainerInfoPanel></StorageContainerInfoPanel>
			<PowerPoleInfoPanel></PowerPoleInfoPanel>
			<PowerSwitchInfoPanel></PowerSwitchInfoPanel>
		</Layer>
	);
}
