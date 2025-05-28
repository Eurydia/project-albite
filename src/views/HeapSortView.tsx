import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { heapSortAnimator } from "@/services/sorting-animators/heap-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { HeapSortFrameState } from "@/types/sorting-animators/heap-sort";
import {
  ChangeHistoryRounded,
  CircleOutlined,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  blue,
  deepOrange,
  deepPurple,
  green,
  grey,
} from "@mui/material/colors";
import { Fragment, memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortElementProps = {
  value: number;
  index: number;
  frame: HeapSortFrameState;
};
const SortElement: FC<SortElementProps> = memo(
  ({ value, index, frame }) => {
    const { palette } = useTheme();
    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor: string = grey["A200"];
    if (frame.verifyAt === index) {
      backgroundColor = deepOrange["A200"];
    }
    if (
      frame.rightBound !== undefined &&
      index > frame.rightBound
    ) {
      backgroundColor = grey["A700"];
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = blue["A200"];
    } else if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = deepPurple["A400"];
    }

    backgroundColor = alpha(backgroundColor, 0.7);
    const labelColor =
      palette.getContrastText(backgroundColor);
    let label = <Fragment />;
    if (frame.parent === index) {
      label = (
        <CircleOutlined
          sx={{
            color: labelColor,
            width: "100%",
          }}
        />
      );
    } else if (
      frame.children !== undefined &&
      frame.children.includes(index)
    ) {
      label = (
        <ChangeHistoryRounded
          sx={{
            color: labelColor,
            width: "100%",
          }}
        />
      );
    }
    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "clip",
        }}
      >
        {label}
      </Grid>
    );
  }
);

const HeapSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const {
    frame,
    nextFrame,
    prevFrame,
    shuffleDataset: reset,
  } = useSortAnimator(() =>
    heapSortAnimator(generateDataset(size))
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
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
          {`Heap sort`}
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
            value={value}
            index={index}
            frame={frame}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const HeapSortView = memo(HeapSortView_);
