import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { bubbleSortAnimator } from "@/services/sorting-animators/bubble-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  blue,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortElementProps = {
  index: number;
  value: number;
  frame: BubbleSortFrameData;
};
const SortElement: FC<SortElementProps> = memo(
  ({ index, value, frame }) => {
    const height = (value / frame.items.length) * 100;

    let backgroundColor: string = grey["200"];
    if (frame.verifyAt === index) {
      backgroundColor = orange["A200"];
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = blue["A200"];
    } else if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = green["A200"];
    } else if (
      frame.rightBound !== undefined &&
      index > frame.rightBound
    ) {
      backgroundColor = grey["A700"];
    }
    backgroundColor = alpha(backgroundColor, 0.7);

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${height}%`,
        }}
      />
    );
  }
);

const BubbleSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const {
    frame,
    nextFrame,
    prevFrame,
    shuffleDataset: reset,
  } = useSortAnimator(() =>
    bubbleSortAnimator(generateDataset(size))
  );

  const { playNote } = useMusicalScale();

  useEffect(() => {
    if (frame === null || frame.compared === undefined) {
      return;
    }
    playNote(frame.items.at(Math.max(...frame.compared))!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.swapped === undefined) {
      return;
    }
    playNote(frame.items.at(Math.max(...frame.swapped))!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.verifyAt === undefined) {
      return;
    }
    playNote(frame.items.at(frame.verifyAt)!);
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const { items, swapCount, compareCount } = frame;

  return (
    <Box
      height="100vh"
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
          {`Bubble sort`}
        </Typography>
        <Stack
          spacing={1}
          flexDirection="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Typography
            sx={{
              color: green["A200"],
            }}
          >
            {`Swaps: ${swapCount}`}
          </Typography>
          <Typography
            sx={{
              color: blue["A200"],
            }}
          >
            {`Comparisons: ${compareCount}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={reset}
        />
      </Stack>
      <Grid
        container
        columns={size}
        spacing={0}
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {items.map((value, index) => (
          <SortElement
            key={`sort-item-${index}`}
            index={index}
            value={value}
            frame={frame}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const BubbleSortView: FC = memo(BubbleSortView_);
