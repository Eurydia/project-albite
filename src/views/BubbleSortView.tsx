import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimatorGenerator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { bubbleSortAnimator } from "@/services/sorting-animators/bubble-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  BubbleSortFrameDataVariants,
  type BubbleSortFrameData,
} from "@/types/sorters/bubble-sort";
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
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
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
    switch (frame.variant) {
      case BubbleSortFrameDataVariants.NORMAL:
        backgroundColor = grey["200"];
        break;
      case BubbleSortFrameDataVariants.COMPARE:
        backgroundColor = blue["A200"];
        if (index > frame.rightBound) {
          backgroundColor = grey["A700"];
        }
        break;
      case BubbleSortFrameDataVariants.SWAP:
        backgroundColor = green["A200"];
        if (index > frame.rightBound) {
          backgroundColor = grey["A700"];
        }
        break;
      case BubbleSortFrameDataVariants.VERIFY:
        backgroundColor = orange["A200"];
        break;
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor: alpha(backgroundColor, 0.7),
          height: `${height}%`,
        }}
      ></Grid>
    );
  },
  isEqual
);

const BubbleSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, reset } =
    useSortAnimatorGenerator(
      bubbleSortAnimator(generateDataset(size))
    );
  const { playNote } = useMusicalScale({});

  useEffect(() => {
    if (frame === null) {
      return;
    }
    let note: number | undefined;
    switch (frame.variant) {
      case BubbleSortFrameDataVariants.SWAP:
        note = frame.items.at(Math.max(...frame.swapped))!;
        break;
      case BubbleSortFrameDataVariants.COMPARE:
        note = frame.items.at(Math.max(...frame.compared))!;
        break;
      case BubbleSortFrameDataVariants.VERIFY:
        note = frame.items.at(frame.verifyAt)!;
        break;
      default:
        return;
    }
    playNote(note);
  }, [frame, playNote]);

  const handleReset = useCallback(() => {
    reset(bubbleSortAnimator(generateDataset(size)));
  }, [reset, size]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const { items, swapCount, compareCount } = frame;

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
          onShuffle={handleReset}
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
