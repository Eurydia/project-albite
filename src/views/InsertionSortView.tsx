import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { performInsertionSort } from "@/services/sorters/insertion-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { InsertionSortFrameState } from "@/types/sorters/insertion-sort";
import { CircleRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  blue,
  deepPurple,
  grey,
  orange,
  purple,
} from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortItemProps = {
  index: number;
  value: number;
  data: InsertionSortFrameState;
};
const SortItem: FC<SortItemProps> = ({
  value,
  data,
  index,
}) => {
  const { palette } = useTheme();

  const { leftBound, verify, compared, swapped, key } =
    data;

  let backgroundColor: string = grey["300"];
  if (leftBound !== undefined && index > leftBound) {
    backgroundColor = grey["900"];
  } else if (verify === index) {
    backgroundColor = orange["A200"];
  } else if (
    compared !== undefined &&
    compared.includes(index)
  ) {
    backgroundColor = blue["A200"];
  } else if (
    swapped !== undefined &&
    swapped.includes(index)
  ) {
    backgroundColor = deepPurple["A200"];
  }

  const height = (value / Math.max(...data.items)) * 100;

  return (
    <Grid
      size={1}
      sx={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        height: `${height}%`,
        overflow: "clip",
      }}
    >
      {key !== undefined && key === index && (
        <CircleRounded
          sx={{
            width: "100%",
            aspectRatio: "1/1",
            color: palette.getContrastText(backgroundColor),
          }}
        />
      )}
    </Grid>
  );
};

const InsertionSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const {
    frame,
    nextFrame,
    prevFrame,
    reset: shuffleDataset,
  } = useSortAnimator(
    generateDataset(size),
    performInsertionSort
  );

  const { playNote } = useMusicalScale();

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

  const { compareCount, items, swapCount } = frame;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Stack spacing={1}>
        <Typography
          fontWeight={900}
          sx={{ userSelect: "none" }}
        >
          {`Insertion sort`}
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
              color: purple["A100"],
            }}
          >
            {`Swaps: ${swapCount}`}
          </Typography>
          <Typography
            sx={{
              userSelect: "none",
              color: blue["A100"],
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
          <SortItem
            key={`sort-item-${index}`}
            index={index}
            value={value}
            data={frame}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const InsertionSortView: FC = memo(
  InsertionSortView_
);
