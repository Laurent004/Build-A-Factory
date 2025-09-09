import React from "@rbxts/react";
import { STRUCTURE_CATEGORIES } from "shared/constants/structures";
import { StructureCategoryButton } from "./structure-category-button";
import { StructureInformation } from "./structure-information";
import { StructureButtons } from "./structure-buttons";
import { Frame } from "client/ui/core/frame";
import { ContextMenu } from "../menu";
import { colors } from "client/constants/colors";
import { useStore } from "client/hooks";
import { EventBus } from "client/event-bus";
import { useMountEffect, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { selectContext } from "client/store/context";

export function BuildMenu() {
	const store = useStore();
	const currentContext = useSelector(selectContext);

	useMountEffect(() => {
		EventBus.InputEvents.Tools.Build.SwapStructure.Connect(() => {
			const isContextBuild = store.getState().context.context === "Build";
			const buildingStructureName = store.getState().buildMenu.buildingStructureName;
			if (!isContextBuild || buildingStructureName === undefined) return;
			const previousBuildingStructureName = store.getState().buildMenu.previousBuildingStructureName;
			if (buildingStructureName !== previousBuildingStructureName) {
				store.setBuildMenuBuildingStructureName(previousBuildingStructureName);
				store.setBuildMenuPreviousBuildingStructureName(buildingStructureName);
			}
		});
	});

	useUpdateEffect(() => {
		if (currentContext !== "Build") {
			const buildingStructureName = store.getState().buildMenu.buildingStructureName;
			const previousBuildingStructureName = store.getState().buildMenu.previousBuildingStructureName;
			store.setBuildMenuBuildingStructureName(undefined);
			if (buildingStructureName !== undefined && buildingStructureName !== previousBuildingStructureName) {
				store.setBuildMenuPreviousBuildingStructureName(buildingStructureName);
			}
		}
	}, [currentContext]);

	return (
		<ContextMenu
			context="Build"
			openPosition={new UDim2(0.5, 0, 0.5, 0)}
			closedPosition={new UDim2(0.5, 0, 0.66, 0)}
			openSize={new UDim2(0.565, 0, 0.707, 0)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.348, 0, 0.106, 0)}
				size={new UDim2(0.697, 0, 0.052, 0)}
				backgroundTransparency={1}
			>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={colors.grey}
					LineJoinMode={Enum.LineJoinMode.Miter}
				></uistroke>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				></uilistlayout>
				{STRUCTURE_CATEGORIES.map((structureCategory) => (
					<StructureCategoryButton structureCategory={structureCategory}></StructureCategoryButton>
				))}
			</Frame>

			<StructureInformation></StructureInformation>

			{STRUCTURE_CATEGORIES.map((structureCategory) => (
				<StructureButtons structureCategory={structureCategory}></StructureButtons>
			))}
		</ContextMenu>
	);
}
