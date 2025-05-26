import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { performQuickSort } from "@/services/sorters/quick-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { QuicksortFrameState } from "@/types/sorters/quick-sort";
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
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { Fragment, memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortElementProps = {
  value: number;
  index: number;
  frame: QuicksortFrameState;
};
const SortElement: FC<SortElementProps> = memo(
  ({ frame, index, value }) => {
    const { palette } = useTheme();
    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor: string = grey["A200"];
    if (frame.terminals !== undefined) {
      const tMin = Math.min(...frame.terminals);
      const tMax = Math.max(...frame.terminals);
      if (index < tMin || index > tMax) {
        backgroundColor = grey["A700"];
      }
    }
    if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = blue["A200"];
    }
    if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = green["A200"];
    }

    if (frame.verify === index) {
      backgroundColor = orange["A200"];
    }
    let icon = <Fragment />;
    if (frame.partition === index) {
      icon = (
        <ChangeHistoryRounded
          sx={{
            color: palette.getContrastText(backgroundColor),
            width: "100%",
          }}
        />
      );
    } else if (frame.key === index) {
      icon = (
        <CircleOutlined
          sx={{
            color: palette.getContrastText(backgroundColor),
            width: "100%",
          }}
        />
      );
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor: alpha(backgroundColor, 0.6),
          height: `${height}%`,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "clip",
        }}
      >
        {icon}
      </Grid>
    );
  }
);

const QuickSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();

  const {
    frame,
    nextFrame,
    prevFrame,
    reset: shuffleDataset,
  } = useSortAnimator(
    generateDataset(size),
    performQuickSort
  );

  const { playNote } = useMusicalScale({
    maxOctave: 3,
  });
  useEffect(() => {
    if (frame === null || frame.compared === undefined) {
      return;
    }
    playNote(frame.items.at(frame.compared.at(0)!)!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.swapped === undefined) {
      return;
    }
    playNote(frame.items.at(frame.swapped.at(0)!)!);
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

  const { items, compareCount, swapCount } = frame;

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
          {`Quick sort`}
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
          <SortElement
            key={`sort-item-${index}`}
            frame={frame}
            index={index}
            value={value}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const QuickSortView = memo(QuickSortView_);
