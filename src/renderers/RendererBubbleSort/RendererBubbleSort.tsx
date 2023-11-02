import { FC, useState } from "react";
import {
	Box,
	Button,
	Stack,
	Typography,
} from "@mui/material";
import {
	blue,
	orange,
	red,
} from "@mui/material/colors";

import {
	bubbleSort,
	ElementState,
	FrameState,
} from "./helper";

type ElementBubbleSortProps = {
	value: number;
	maxValue: number;
	size: number;
	states: ElementState;
};
const ElementBubbleSort: FC<
	ElementBubbleSortProps
> = (props) => {
	const { value, maxValue, size, states } = props;

	const {
		compared,
		beingSwapped,
		swapped,
		lastElementOfUnsortedRegion,
		bubbling,
	} = states;

	const height: number = (value / maxValue) * 100;

	const width: number = (1 / size) * 100;

	let bgColor: string = `hsl(0, 0%, ${
		(value / maxValue) * 80
	}%)`;

	if (lastElementOfUnsortedRegion) {
		bgColor = red.A100;
	}

	if (compared) {
		bgColor = blue.A100;
	}

	if (beingSwapped) {
		bgColor = orange["A100"];
	}

	if (swapped) {
		bgColor = orange["A200"];
	}

	return (
		<Box
			sx={{
				width: `${width}%`,
				height: `${height}%`,
				backgroundColor: bgColor,
			}}
		>
			{bubbling ? "🚀" : ""}
		</Box>
	);
};

type RendererBubbleSortProps = {
	dataset: number[];
};
export const RendererBubbleSort: FC<
	RendererBubbleSortProps
> = (props) => {
	const { dataset } = props;

	const size: number = dataset.length;
	const maxValue: number = Math.max(...dataset);

	const [frame, setFrame] = useState<number>(0);

	const [frameStates] = useState<FrameState[]>(
		() => {
			const frameStates: FrameState[] = [];

			bubbleSort([...dataset], size, frameStates);

			return frameStates;
		},
	);

	const onFrameAdvance = () => {
		if (frame === frameStates.length - 1) {
			return;
		}

		setFrame((prevFrame) => {
			return prevFrame + 1;
		});
	};

	const onFrameRewind = () => {
		if (frame === 0) {
			return;
		}

		setFrame((prevFrame) => {
			return prevFrame - 1;
		});
	};

	const onKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
	) => {
		switch (event.key) {
			case "ArrowRight":
				onFrameAdvance();
				break;
			case "ArrowLeft":
				onFrameRewind();
				break;
			default:
				break;
		}
	};

	const heightPx: number = 600;

	const currFrame: FrameState =
		frameStates[frame];

	return (
		<Box>
			<Stack spacing={2}>
				<Box>
					<Typography variant="body1">
						{`Frame ${frame + 1}/${
							frameStates.length
						}`}
					</Typography>
					<Typography variant="body1">
						{`Comparison: ${currFrame.comparisonCount}`}
					</Typography>
					<Typography variant="body1">
						{`Swap: ${currFrame.swapCount}`}
					</Typography>
					<Typography
						variant="body1"
						minHeight="3rem"
					>
						{currFrame.frameDescription}
					</Typography>
				</Box>
				<Box
					display="flex"
					flexDirection="row"
					alignItems="flex-end"
					sx={{
						width: "100%",
						height: `${heightPx}px`,
					}}
				>
					{currFrame.elementStates.map(
						({ value, states }, index) => {
							return (
								<ElementBubbleSort
									key={`key-${index}`}
									value={value}
									maxValue={maxValue}
									size={size}
									states={states}
								/>
							);
						},
					)}
				</Box>
				<Stack
					direction="row"
					spacing={2}
				>
					<Button
						fullWidth
						variant="contained"
						onClick={onFrameRewind}
						disabled={frame === 0}
					>
						Previous Frame
					</Button>
					<Button
						fullWidth
						variant="contained"
						onClick={onFrameAdvance}
						onKeyDown={onKeyDown}
						disabled={
							frame === frameStates.length - 1
						}
					>
						Next Frame
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};
