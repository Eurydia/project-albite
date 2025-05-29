import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { InsertionSortVisualizer } from "@/components/visualizers/InsertionSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { InsertionSortAnimator } from "@/services/sorting-animators/insertion-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, type FC } from "react";
import { useLoaderData } from "react-router";

const InsertionSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const {
    frame,
    nextFrame,
    prevFrame,
    shuffleDataset,
    handleAnimationControlKeyDown,
  } = useSortAnimator(new InsertionSortAnimator(size));
  const { palette } = useTheme();
  return (
    <Box
      component="div"
      tabIndex={0}
      onKeyDown={handleAnimationControlKeyDown}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: 0,
        flexGrow: 1,
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
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
              color: palette.opSwap.main,
            }}
          >
            {`Swaps: ${frame?.swapCount ?? 0}`}
          </Typography>
          <Typography
            sx={{
              color: palette.opCompare.main,
            }}
          >
            {`Comparisons: ${frame?.compareCount ?? 0}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
        />
      </Stack>
      {frame === undefined && (
        <ShuffleRequestRegion onClick={shuffleDataset} />
      )}
      {frame !== undefined && (
        <InsertionSortVisualizer frame={frame} />
      )}
    </Box>
  );
};

export const InsertionSortView: FC = memo(
  InsertionSortView_
);
