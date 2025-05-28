import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { SelectionSortVisualizer } from "@/components/visualizers/SelectionSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { SelectionSortAnimator } from "@/services/sorting-animators/selection-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, type FC } from "react";
import { useLoaderData } from "react-router";

const SelectionSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const {
    frame,
    nextFrame,
    prevFrame,
    shuffleDataset,
    handleAnimationControlKeyDown,
  } = useSortAnimator(new SelectionSortAnimator(size));

  return (
    <Box
      component="div"
      tabIndex={0}
      onKeyDown={handleAnimationControlKeyDown}
      sx={{
        flexBasis: 0,
        flexGrow: 1,
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
        <SelectionSortVisualizer frame={frame} />
      )}
    </Box>
  );
};

export const SelectionSortView: FC = memo(
  SelectionSortView_
);
