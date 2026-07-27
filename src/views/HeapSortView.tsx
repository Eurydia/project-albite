import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { HeapSortVisualizer } from "@/components/visualizers/HeapSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { HeapSortAnimator } from "@/services/sorting-animators/heap-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

const HeapSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new HeapSortAnimator(size),
  );

  return (
    <Box
      component="section"
      tabIndex={0}
      sx={{
        flexBasis: 0,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack component="header" spacing={1}>
        <Typography component="h1" variant="h5" fontWeight={900}>
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
      {frame === undefined && <ShuffleRequestRegion onClick={shuffleDataset} />}
      {frame !== undefined && <HeapSortVisualizer frame={frame} size={size} />}
    </Box>
  );
};

export const HeapSortView = memo(HeapSortView_);
