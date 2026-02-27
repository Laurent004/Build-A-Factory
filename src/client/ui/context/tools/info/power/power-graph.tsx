import { useMountEffect, useUpdate } from "@rbxts/pretty-react-hooks";
import React, { useRef } from "@rbxts/react";
import { round } from "shared/utils";
import { Frame, Text } from "client/ui/core";
import { colors } from "client/ui/constants";
import { PowerService } from "shared/services/plot";

const attachmentsHistories = new Map<Attachment, number[][]>();
const powerService = PowerService.getInst();
task.spawn(() => {
	while (task.wait(1)) {
		for (const [attachment, powerNetwork] of powerService.getPowerNetworks()) {
			const newAttachmentHistory = attachmentsHistories.get(attachment) ?? [];
			newAttachmentHistory.push([
				powerService.getPowerNetworkConsumption(powerNetwork),
				powerService.getPowerNetworkProduction(powerNetwork),
				powerService.getPowerNetworkMaxConsumption(powerNetwork),
				powerService.getPowerNetworkMaxProduction(powerNetwork),
			]);
			if (newAttachmentHistory.size() === 30) {
				newAttachmentHistory.shift();
			}
			attachmentsHistories.set(attachment, newAttachmentHistory);
		}
	}
});

interface InfoPanelPowerGraphProps {
	attachment: Attachment | undefined;
}

export function InfoPanelPowerGraph({ attachment }: InfoPanelPowerGraphProps) {
	const update = useUpdate();
	const frameRef = useRef<Frame>();
	const attachmentHistory = attachment !== undefined ? attachmentsHistories.get(attachment) : undefined;

	useMountEffect(() => {
		task.spawn(() => {
			while (task.wait(1)) {
				update();
			}
		});
	});

	return (
		<Frame Position={UDim2.fromScale(0, 0.099)} Size={UDim2.fromScale(1, 0.901)} BackgroundTransparency={1}>
			<Frame ref={frameRef} Size={UDim2.fromScale(1, 0.717)} BackgroundTransparency={1}>
				{attachmentHistory !== undefined
					? [0, 1, 2, 3].map((value) =>
							attachmentHistory
								.map((powerNetworkInfo) => powerNetworkInfo[value])
								.map((point, index, points) => {
									if (index === points.size() - 1) return undefined;
									const startX =
										(index * (frameRef.current?.AbsoluteSize.X ?? 0)) / attachmentHistory.size();
									const endX =
										((index + 1) * (frameRef.current?.AbsoluteSize.X ?? 0)) /
										attachmentHistory.size();
									const startY =
										(frameRef.current?.AbsoluteSize.Y ?? 0) -
										(point /
											math.max(
												...attachmentHistory.map((powerNetworkInfo) =>
													math.max(powerNetworkInfo[1], powerNetworkInfo[3]),
												),
											)) *
											(frameRef.current?.AbsoluteSize.Y ?? 0);
									const endY =
										(frameRef.current?.AbsoluteSize.Y ?? 0) -
										(points[index + 1] /
											math.max(
												...attachmentHistory.map((powerNetworkInfo) =>
													math.max(powerNetworkInfo[1], powerNetworkInfo[3]),
												),
											)) *
											(frameRef.current?.AbsoluteSize.Y ?? 0);
									return (
										<InfoPanelPowerGraphSegment
											value={value}
											position={new UDim2(0, (startX + endX) / 2, 0, (startY + endY) / 2)}
											rotation={math.deg(math.atan2(endY - startY, endX - startX))}
											size={UDim2.fromOffset(
												math.sqrt(math.pow(endX - startX, 2) + math.pow(endY - startY, 2)),
												2,
											)}
										></InfoPanelPowerGraphSegment>
									);
								}),
					  )
					: undefined}
			</Frame>

			<Frame Position={UDim2.fromScale(0, 0.772)} Size={UDim2.fromScale(1, 0.228)} BackgroundTransparency={1}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					Wraps={true}
				></uilistlayout>

				{[0, 1, 2, 3].map((value) => (
					<Frame Size={UDim2.fromScale(0.5, 0.5)} BackgroundTransparency={1} LayoutOrder={value}>
						<Frame
							AnchorPoint={new Vector2(0, 0.5)}
							Position={UDim2.fromScale(0.02, 0.5)}
							Size={UDim2.fromScale(0.076, 0.395)}
							BackgroundColor3={
								value === 0
									? colors.lightblue
									: value === 1
									? Color3.fromRGB(173, 173, 173)
									: value === 2
									? colors.white
									: Color3.fromRGB(79, 79, 79)
							}
						>
							<uiaspectratioconstraint
								AspectType={Enum.AspectType.ScaleWithParentSize}
							></uiaspectratioconstraint>
						</Frame>

						<Text
							Size={UDim2.fromScale(1, 1)}
							RichText={true}
							Text={`${
								value === 0
									? "Cons."
									: value === 1
									? "Production"
									: value === 2
									? "Max Cons."
									: "Max Prod."
							} : <font color="${
								value === 0
									? "rgb(176,208,255)"
									: value === 1
									? "rgb(173,173,137)"
									: value === 2
									? "rgb(255,255,255)"
									: "rgb(79,79,79)"
							}" weight="regular">${
								attachmentHistory !== undefined && attachmentHistory.size() > 0
									? round(attachmentHistory[attachmentHistory.size() - 1][value], 2)
									: 0
							} MW</font>`}
							TextSize={12}
							TextXAlignment={Enum.TextXAlignment.Left}
						>
							<uipadding PaddingLeft={new UDim(0, 30)}></uipadding>
						</Text>
					</Frame>
				))}
			</Frame>
		</Frame>
	);
}

interface InfoPanelPowerGraphSegmentProps {
	value: number;
	position: UDim2;
	rotation: number;
	size: UDim2;
}

function InfoPanelPowerGraphSegment({ value, position, rotation, size }: InfoPanelPowerGraphSegmentProps) {
	return (
		<Frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={position}
			Size={size}
			Rotation={rotation}
			BackgroundColor3={
				value === 0
					? colors.lightblue
					: value === 1
					? Color3.fromRGB(173, 173, 173)
					: value === 2
					? colors.white
					: Color3.fromRGB(79, 79, 79)
			}
		></Frame>
	);
}
