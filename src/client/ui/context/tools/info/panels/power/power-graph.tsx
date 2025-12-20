import { useUpdate, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import React, { useRef } from "@rbxts/react";
import { PowerNetworkInfo, PowerService } from "client/services/plot/power-service";
import { Frame } from "client/ui/core/frame";
import { round } from "shared/utils/math";
import { InfoPanelPowerGraphSegment } from "./power-graph-segment";
import { InfoPanelPowerGraphInfo } from "./power-graph-info";

export interface InfoPanelPowerGraphProps {
	graphWidth: number;
	graphHeight: number;
	infoIconSize: UDim2;
	attachment: Attachment | undefined;
}

export function InfoPanelPowerGraph(props: InfoPanelPowerGraphProps) {
	const powerService = PowerService.getInst();
	const powerNetworkHistory =
		props.attachment !== undefined ? powerService.getAttachmentHistory(props.attachment) : undefined;
	const powerNetworkHistoryConnectionRef = useRef<RBXScriptConnection>();
	const update = useUpdate();

	useUpdateEffect(() => {
		powerNetworkHistoryConnectionRef.current?.Disconnect();
		powerNetworkHistoryConnectionRef.current = undefined;
		if (props.attachment === undefined || powerService.getAttachmentHistory(props.attachment) === undefined) return;
		powerNetworkHistoryConnectionRef.current = powerService.onUpdate.Connect(() => {
			update();
		});
	}, [props.attachment]);

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
				{(["consumption", "production", "maxConsumption", "maxProduction"] as (keyof PowerNetworkInfo)[]).map(
					(powerNetworkInfoName) => {
						const points = (powerNetworkHistory ?? []).map((powerNetworkInfo, index) => {
							return {
								startX: (index * props.graphWidth) / (powerNetworkHistory ?? []).size(),
								value: powerNetworkInfo[powerNetworkInfoName],
							};
						});
						return points.map((point, index) => {
							if (index === points.size() - 1) return;
							const endX = points[index + 1].startX;
							const startY =
								props.graphHeight -
								(point.value! /
									math.max(
										...(powerNetworkHistory ?? []).map((powerNetworkInfo) =>
											math.max(powerNetworkInfo.maxConsumption, powerNetworkInfo.maxProduction),
										),
									)) *
									props.graphHeight;
							const endY =
								props.graphHeight -
								(points[index + 1].value! /
									math.max(
										...(powerNetworkHistory ?? []).map((powerNetworkInfo) =>
											math.max(powerNetworkInfo.maxConsumption, powerNetworkInfo.maxProduction),
										),
									)) *
									props.graphHeight;
							return (
								<InfoPanelPowerGraphSegment
									index={index}
									info={powerNetworkInfoName}
									position={new UDim2(0, (point.startX + endX) / 2, 0, (startY + endY) / 2)}
									rotation={math.deg(math.atan2(endY - startY, endX - point.startX))}
									size={
										new UDim2(
											0,
											math.sqrt(math.pow(endX - point.startX, 2) + math.pow(endY - startY, 2)),
											0,
											2,
										)
									}
								></InfoPanelPowerGraphSegment>
							);
						});
					},
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
							info={info}
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
							value={
								powerNetworkHistory !== undefined && powerNetworkHistory.size() > 0
									? round(powerNetworkHistory[powerNetworkHistory.size() - 1][info], 2)
									: 0
							}
						></InfoPanelPowerGraphInfo>
					),
				)}
			</Frame>
		</Frame>
	);
}
