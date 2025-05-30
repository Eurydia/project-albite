import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { QuickSortVisualizer } from "@/components/visualizers/QuickSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { QuickSortAnimator } from "@/services/sorting-animators/quick-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, type FC } from "react";
import { useLoaderData } from "react-router";

const QuickSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(new QuickSortAnimator(size));

  return (
    <Box
      component="div"
      tabIndex={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexBasis: 0,
      }}
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
        <QuickSortVisualizer frame={frame} />
      )}
    </Box>
  );
};

export const QuickSortView = memo(QuickSortView_);
