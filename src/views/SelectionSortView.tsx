import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { selectionSortAnimator } from "@/services/sorting-animators/selection-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { SelectionSortFrameState } from "@/types/sorting-animators/selection-sort";
import { ChangeHistoryRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
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
      backgroundColor = palette.opVerify.main;
    } else if (
      frame.leftBound !== undefined &&
      index < frame.leftBound
    ) {
      backgroundColor = palette.rangeBounded.main;
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = palette.opCompare.main;
    } else if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = palette.opSwap.main;
    }

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
          <ChangeHistoryRounded
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
  const { palette } = useTheme();
  const {
    frame,
    nextFrame,
    prevFrame,
    shuffleDataset: reset,
  } = useSortAnimator(() =>
    selectionSortAnimator(generateDataset(size))
  );

  const { playNote } = useMusicalScale();

  useEffect(() => {
    if (frame === null) {
      return;
    }
    if (frame.compared !== undefined) {
      const pos = Math.max(...frame.compared);
      playNote(frame.items.at(pos)!);
    }
    if (frame.swapped !== undefined) {
      const pos = Math.max(...frame.swapped);
      playNote(frame.items.at(pos)!);
    }
    if (frame.verifyAt !== undefined) {
      playNote(frame.verifyAt);
    }
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const { compareCount, swapCount, items } = frame;

  return (
    <Box
      autoFocus
      tabIndex={0}
      component="div"
      onKeyDown={(e) => {
        console.log(e.key === " ");
        switch (e.key) {
          case "ArrowRight":
            nextFrame();
            break;
          case "ArrowLeft":
            prevFrame();
            break;
          case " ":
            reset();
            break;
        }
      }}
      sx={{
        flexBasis: 0,
        flexGrow: 1,
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
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
              color: palette.opSwap.main,
            }}
          >
            {`Swaps: ${swapCount}`}
          </Typography>
          <Typography
            sx={{
              color: palette.opCompare.main,
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
