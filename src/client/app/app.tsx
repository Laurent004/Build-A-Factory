import React from "@rbxts/react";
import { Layer } from "client/ui/core";
import { SaveSelector } from "client/ui/save-selector";
import { TutorialPanel } from "client/ui/hud/tutorial-panel";
import { CashDisplay } from "client/ui/hud/cash-display";
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
	InfoInputPanel,
	LiftStructureBuildInputPanel,
	PathStructureBuildInputPanel,
	PowerLineBuildInputPanel,
	ToolBar,
	UndergroundStructureBuildInputPanel,
} from "client/ui/hud/context/tools";
import { BlueprintDesigner } from "client/ui/context/tools/copy";
import { DeleteModal } from "client/ui/overlay/tools";
import { ExpansionModal } from "client/ui/overlay/expansion-modal";
import { Tooltip } from "client/ui/overlay/tooltip";

export function App() {
	return (
		<Layer>
			<SaveSelector></SaveSelector>
			<TutorialPanel></TutorialPanel>
			<CashDisplay></CashDisplay>
			<Notifications></Notifications>

			<SectionBar></SectionBar>
			<ItemsMenu></ItemsMenu>
			<SettingsMenu></SettingsMenu>

			<ToolBar></ToolBar>
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
