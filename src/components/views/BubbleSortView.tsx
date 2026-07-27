import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { BubbleSortVisualizer } from "@/components/visualizers/BubbleSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { BubbleSortAnimator } from "@/services/sorting-animators/bubble-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

export const BubbleSortView: FC = memo(() => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new BubbleSortAnimator(size),
  );
  const { palette } = useTheme();

  return (
    <Box
      component="section"
      tabIndex={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: 0,
        flexGrow: 1,
      }}
    >
      <Stack component="header" spacing={1}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 900 }}>
          {`Bubble sort`}
        </Typography>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ alignItems: "center", flexWrap: "wrap" }}
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
      {frame !== undefined && <BubbleSortVisualizer frame={frame} />}
    </Box>
  );
});
