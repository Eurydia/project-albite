import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimatorGenerator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { performBubbleSortGenerator } from "@/services/sorters/bubblesort";
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
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { useLoaderData } from "react-router";

type ItemProps = {
  height: number;
  compare: boolean;
  swapped: boolean;
  verify: boolean;
  locked: boolean;
};
const ItemElement: FC<ItemProps> = memo(
  ({ height, compare, swapped, verify, locked }) => {
    let backgroundColor: string = grey["50"];
    if (compare) {
      backgroundColor = blue["A200"];
    } else if (swapped) {
      backgroundColor = green["A200"];
    } else if (verify) {
      backgroundColor = orange["A200"];
    } else if (locked) {
      backgroundColor = grey["A700"];
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
      performBubbleSortGenerator(generateDataset(size))
    );
  const { playNote } = useMusicalScale({});

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

  const handleReset = useCallback(() => {
    reset(
      performBubbleSortGenerator(generateDataset(size))
    );
  }, [reset, size]);

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
    rightBound,
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
            locked={
              rightBound !== undefined &&
              index >= rightBound
            }
          />
        ))}
      </Grid>
    </Box>
  );
};

export const BubbleSortView: FC = memo(BubbleSortView_);
