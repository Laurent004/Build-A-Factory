import { Workspace } from "@rbxts/services";
import { StructureData, STRUCTURES } from "shared/constants/structures";

export default class CollisionService {
	//#region Singleton
	private static _inst: CollisionService;
	public static getInst(): CollisionService {
		this._inst = this._inst ?? new CollisionService();
		return this._inst;
	}
	//#endregion

	public canPlace(player: Player, structuresModels: Model[]): boolean;
	public canPlace(player: Player, structuresData: StructureData[]): boolean;
	public canPlace(player: Player, structures: Model[] | StructureData[]): boolean {
		const overlapParams = new OverlapParams();
		overlapParams.FilterType = Enum.RaycastFilterType.Include;
		overlapParams.AddToFilter(player.Character!);

		return typeIs(structures[0], "Instance")
			? structures.every(
					(structureModel) =>
						STRUCTURES[(structureModel as Model).Name].nodes.cells.size() === 0 ||
						Workspace.GetPartsInPart((structureModel as Model).PrimaryPart!, overlapParams).size() === 0,
			  )
			: structures.every(
					(structure) =>
						STRUCTURES[(structure as StructureData).name].nodes.cells.size() === 0 ||
						Workspace.GetPartBoundsInBox(
							new CFrame(...(structure as StructureData).cf).mul(
								STRUCTURES[(structure as StructureData).name].model.PrimaryPart!.PivotOffset.Inverse(),
							),
							STRUCTURES[(structure as StructureData).name].model.PrimaryPart!.Size,
							overlapParams,
						).size() === 0,
			  );
	}
}
