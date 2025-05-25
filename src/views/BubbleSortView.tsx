import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { performBubbleSort } from "@/services/bubblesort";
import { generateDataset } from "@/services/generate-dataset";
import type { SorterRouterLoaderData } from "@/types/loader-data";
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
import { isEqual } from "lodash";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type ItemProps = {
  height: number;
  compare: boolean;
  swapped: boolean;
  verify: boolean;
};
const ItemElement: FC<ItemProps> = memo(
  ({ height, compare, swapped, verify }) => {
    let backgroundColor: string = grey["300"];
    if (compare) {
      backgroundColor = blue["A200"];
    } else if (swapped) {
      backgroundColor = green["A200"];
    } else if (verify) {
      backgroundColor = orange["A200"];
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor: alpha(backgroundColor, 0.8),
          height: `${height}%`,
        }}
      ></Grid>
    );
  },
  isEqual
);

const BubbleSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(
      generateDataset(size),
      performBubbleSort
    );

  const { playNote } = useMusicalScale({
    scalePattern: [0, 2, 4, 6, 7, 9, 11],
    baseMidiNote: 60,
    gain: 0.3,
    duration: 0.6,
    fadeDuration: 0.2,
    waveform: "sine",
  });

  useEffect(() => {
    if (frame === null || frame.swapped === undefined) {
      return;
    }
    playNote(frame.items.at(Math.max(...frame.swapped))!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.compare == undefined) {
      return;
    }
    playNote(frame.items.at(Math.max(...frame.compare))!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.verify === undefined) {
      return;
    }
    playNote(frame.items.at(frame.verify)!);
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const {
    items,
    compare,
    swapped,
    swapCount,
    compareCount,
    verify,
  } = frame;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack
        spacing={1}
        component="div"
      >
        <Typography
          fontWeight={900}
          sx={{ userSelect: "none" }}
        >
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
              userSelect: "none",
              color: green["A200"],
            }}
          >
            {`Swaps: ${swapCount}`}
          </Typography>
          <Typography
            sx={{
              userSelect: "none",
              color: blue["A200"],
            }}
          >
            {`Comparisons: ${compareCount}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
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
          <ItemElement
            key={`sort-item-${index}`}
            height={(value / items.length) * 100}
            compare={
              compare !== undefined &&
              compare.includes(index)
            }
            swapped={
              swapped !== undefined &&
              swapped.includes(index)
            }
            verify={verify === index}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const BubbleSortView: FC = memo(BubbleSortView_);
