import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimatorGenerator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { selectionSortAnimator } from "@/services/sorting-animators/selection-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { SelectionSortFrameState } from "@/types/sorters/selection-sort";
import { KeyRounded } from "@mui/icons-material";
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
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortItemProps = {
  value: number;
  index: number;
  frame: SelectionSortFrameState;
};
const SortItem: FC<SortItemProps> = memo(
  ({ frame, index, value }) => {
    const { palette } = useTheme();

    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor: string = grey[200];
    if (frame.verifyAt === index) {
      backgroundColor = orange["A200"];
    } else if (
      frame.leftBound !== undefined &&
      index < frame.leftBound
    ) {
      backgroundColor = grey["A400"];
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
    }

    backgroundColor = alpha(backgroundColor, 0.7);

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "clip",
        }}
      >
        {frame.key === index && (
          <KeyRounded
            sx={{
              color:
                palette.getContrastText(backgroundColor),
            }}
          />
        )}
      </Grid>
    );
  }
);

const SelectionSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();

  const { frame, nextFrame, prevFrame, reset } =
    useSortAnimatorGenerator(() =>
      selectionSortAnimator(generateDataset(size))
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

  const { compareCount, swapCount, items } = frame;

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
        <Typography
          fontWeight={900}
          sx={{ userSelect: "none" }}
        >
          {`Selection sort`}
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
          <SortItem
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

export const SelectionSortView: FC = memo(
  SelectionSortView_
);
