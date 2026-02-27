import { Component } from "@flamework/components";
import { Solid } from "shared/constants/items";
import TransporterComponent from "./transporter";

@Component({ tag: "DataCenter" })
export default class DataCenterComponent extends TransporterComponent {
	private readonly openWindowDuration: number = 10;
	private readonly dataAnalysisDuration: number = 6;
	private closeThread: thread | undefined;
	private isClosed: boolean = false;

	private startDataAnalysis(): void {
		this.isClosed = true;
		task.delay(this.dataAnalysisDuration, () => {
			this.clearItems();
		});
	}

	public override inputItem(solid: Solid): void;
	public override inputItem(fluid: string, volume: number): void;
	public override inputItem(item: Solid | string, volume?: number): void {
		if (!typeIs(item, "table")) return;
		super.inputItem(item);
		item.m?.Destroy();
		item.p = -1;
		if (this.solids.size() === 1) {
			this.closeThread = task.delay(this.openWindowDuration, () => {
				this.closeThread = undefined;
				this.startDataAnalysis();
			});
		} else if (this.solids.size() === this.player.GetAttribute("DataCapacity")) {
			task.cancel(this.closeThread!);
			this.closeThread = undefined;
			this.startDataAnalysis();
		}
	}

	public override canInputItem(solid: Solid): boolean;
	public override canInputItem(fluid: string): boolean;
	public override canInputItem(item: Solid | string): boolean {
		return (
			typeIs(item, "table") &&
			this.queuedSolids.size() + this.solids.size() < (this.player.GetAttribute("DataCapacity") as number) &&
			!this.isClosed
		);
	}

	protected override clearItems(): void {
		if (this.closeThread !== undefined) {
			task.cancel(this.closeThread);
			this.closeThread = undefined;
		}
		this.isClosed = false;
		super.clearItems();
	}
}
