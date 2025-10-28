import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useRef, useState } from "@rbxts/react";
import { PowerNetworkInfo, PowerService } from "client/services/plot/power-service";
import { colors } from "client/ui/constants";
import { Frame } from "client/ui/core/frame";
import { round } from "shared/utils/math";
import { InfoPanelPowerGraphSegment } from "./power-graph-segment";
import { InfoPanelPowerGraphInfo } from "./power-graph-info";

export interface InfoPanelPowerGraphProps {
	graphWidth: number;
	graphHeight: number;
	infoIconSize: UDim2;
	powerAttachment: Attachment | undefined;
}

export function InfoPanelPowerGraph(props: InfoPanelPowerGraphProps) {
	const powerService = PowerService.getInst();
	const [powerNetworkHistory, setPowerNetworkHistory] = useState<PowerNetworkInfo[]>();
	const powerNetworkHistoryConnectionRef = useRef<RBXScriptConnection>();

	useUpdateEffect(() => {
		powerNetworkHistoryConnectionRef.current?.Disconnect();
		powerNetworkHistoryConnectionRef.current = undefined;
		if (props.powerAttachment === undefined) return;
		const powerNetworkHistory = powerService.getPowerNetworkHistory(props.powerAttachment);
		setPowerNetworkHistory(powerNetworkHistory);
		if (powerNetworkHistory === undefined) return;
		powerNetworkHistoryConnectionRef.current = powerService.onUpdate.Connect(() => {
			setPowerNetworkHistory(powerService.getPowerNetworkHistory(props.powerAttachment!));
		});
	}, [props.powerAttachment]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 1)}
			position={new UDim2(0.5, 0, 1, 0)}
			size={new UDim2(1, 0, 0.901, 0)}
			backgroundTransparency={1}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
				size={new UDim2(1, 0, 0.717, 0)}
				backgroundTransparency={1}
				clipsDescendants={true}
			>
				{powerNetworkHistory !== undefined && powerNetworkHistory.size() > 0 && (
					<>
						{(() => {
							const max = math.max(
								...powerNetworkHistory.map((powerNetworkInfo) =>
									math.max(powerNetworkInfo.maxConsumption, powerNetworkInfo.maxProduction),
								),
							);

							return (
								[
									"consumption",
									"production",
									"maxConsumption",
									"maxProduction",
								] as (keyof PowerNetworkInfo)[]
							).map((info) => {
								const points = powerNetworkHistory.map((powerNetworkInfo, index) => {
									return {
										startX: (index * props.graphWidth) / powerNetworkHistory.size(),
										value: powerNetworkInfo[info],
									};
								});

								return points.map((point, index) => {
									if (index === points.size() - 1) return;

									const endX = points[index + 1].startX;
									const startY = props.graphHeight - (point.value! / max) * props.graphHeight;
									const endY =
										props.graphHeight - (points[index + 1].value! / max) * props.graphHeight;

									return (
										<InfoPanelPowerGraphSegment
											index={index}
											position={new UDim2(0, (point.startX + endX) / 2, 0, (startY + endY) / 2)}
											size={
												new UDim2(
													0,
													math.sqrt(
														math.pow(endX - point.startX, 2) + math.pow(endY - startY, 2),
													),
													0,
													2,
												)
											}
											rotation={math.deg(math.atan2(endY - startY, endX - point.startX))}
											color={
												info === "consumption"
													? colors.lightblue
													: info === "production"
													? Color3.fromRGB(173, 173, 173)
													: info === "maxConsumption"
													? colors.white
													: Color3.fromRGB(79, 79, 79)
											}
										></InfoPanelPowerGraphSegment>
									);
								});
							});
						})()}
					</>
				)}
			</Frame>


			<Frame
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, 0)}
				size={new UDim2(1, 0, 0.228, 0)}
				backgroundTransparency={1}
			>
				{(["consumption", "production", "maxConsumption", "maxProduction"] as (keyof PowerNetworkInfo)[]).map(
					(info, index) => (
						<InfoPanelPowerGraphInfo
							index={index}
							position={
								info === "consumption"
									? new UDim2(0, 0, 0, 0)
									: info === "production"
									? new UDim2(0.5, 0, 0, 0)
									: info === "maxConsumption"
									? new UDim2(0, 0, 0.5, 0)
									: new UDim2(0.5, 0, 0.5, 0)
							}
							iconSize={props.infoIconSize}
							iconColor={
								info === "consumption"
									? colors.lightblue
									: info === "production"
									? Color3.fromRGB(173, 173, 173)
									: info === "maxConsumption"
									? colors.white
									: Color3.fromRGB(79, 79, 79)
							}
							text={`${
								info === "consumption"
									? "Cons."
									: info === "production"
									? "Production"
									: info === "maxConsumption"
									? "Max Cons."
									: "Max Prod."
							} : <font color="${
								info === "consumption"
									? "rgb(176,208,255)"
									: info === "production"
									? "rgb(173,173,137)"
									: info === "maxConsumption"
									? "rgb(255,255,255)"
									: "rgb(79,79,79)"
							}" weight="regular">${
								powerNetworkHistory !== undefined && powerNetworkHistory.size() > 0
									? round(powerNetworkHistory[powerNetworkHistory.size() - 1][info], 2)
									: 0
							} MW</font>`}
						></InfoPanelPowerGraphInfo>
					),
				)}
			</Frame>
		</Frame>
	);
}
