import React from "@rbxts/react";
import { Layer } from "client/ui/core";
import { SaveSelector } from "client/ui/save-selector";
import { TutorialPanel } from "client/ui/hud/tutorial-panel";
import { CurrencyDisplay } from "client/ui/hud/currency-display";
import { Notifications } from "client/ui/overlay/notifications";
import { SectionBar } from "client/ui/hud/context/sections";
import { ItemsMenu } from "client/ui/context/sections/items";
import { SettingsMenu } from "client/ui/context/sections/settings";
import {
	BaseStructureInfoPanel,
	FluidExtractorInfoPanel,
	ManufacturerInfoPanel,
	MinerInfoPanel,
	PipelineInfoPanel,
	PowerPoleInfoPanel,
	PowerSwitchInfoPanel,
	PriortyMergerInfoPanel,
	SmartSplitterInfoPanel,
	ProgrammableSplitterInfoPanel,
	CoalGeneratorInfoPanel,
} from "client/ui/context/tools/info";
import { BuildMenu } from "client/ui/context/tools/build";
import {
	BaseStructureBuildInputPanel,
	CleanerInputPanel,
	CopyInputPanel,
	DeleteInputPanel,
	EditInputPanel,
	InfoEfficiencyPanel,
	InfoInputPanel,
	LiftStructureBuildInputPanel,
	PathStructureBuildInputPanel,
	PowerLineBuildInputPanel,
	ToolBar,
	UndergroundStructureBuildInputPanel,
} from "client/ui/hud/context/tools";
import { BlueprintDesigner } from "client/ui/context/tools/copy";
import { ExpansionModal } from "client/ui/overlay/expansion-modal";
import { Tooltip } from "client/ui/overlay/tooltip";
import { DeleteModal } from "client/ui/overlay/delete-modal";
import { TechTreeMenu } from "client/ui/context/sections/tech-tree";

export function App() {
	return (
		<Layer>
			<SaveSelector></SaveSelector>
			<TutorialPanel></TutorialPanel>
			<CurrencyDisplay></CurrencyDisplay>
			<Notifications></Notifications>

			<SectionBar></SectionBar>
			<TechTreeMenu></TechTreeMenu>
			<ItemsMenu></ItemsMenu>
			<SettingsMenu></SettingsMenu>

			<ToolBar></ToolBar>
			<InfoInputPanel></InfoInputPanel>
			<InfoEfficiencyPanel></InfoEfficiencyPanel>
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
			<CoalGeneratorInfoPanel></CoalGeneratorInfoPanel>
			<BuildMenu></BuildMenu>
			<BaseStructureBuildInputPanel></BaseStructureBuildInputPanel>
			<PathStructureBuildInputPanel></PathStructureBuildInputPanel>
			<UndergroundStructureBuildInputPanel></UndergroundStructureBuildInputPanel>
			<LiftStructureBuildInputPanel></LiftStructureBuildInputPanel>
			<PowerLineBuildInputPanel></PowerLineBuildInputPanel>
			<EditInputPanel></EditInputPanel>
			<CopyInputPanel></CopyInputPanel>
			<BlueprintDesigner></BlueprintDesigner>
			<CleanerInputPanel></CleanerInputPanel>
			<DeleteInputPanel></DeleteInputPanel>
			<DeleteModal></DeleteModal>
			<ExpansionModal></ExpansionModal>

			<Tooltip></Tooltip>
		</Layer>
	);
}
