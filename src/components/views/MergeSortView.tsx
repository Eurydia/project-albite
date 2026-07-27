import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { MergeSortVisualizer } from "@/components/visualizers/MergeSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { MergeSortAnimator } from "@/services/sorting-animators/merge-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

export const MergeSortView: FC = memo(() => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new MergeSortAnimator(size),
  );

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
          {`Merge sort`}
        </Typography>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ flexWrap: "wrap", alignItems: "center" }}
        >
          <Typography
            sx={{
              color: palette.opWrite.main,
            }}
          >
            {`Writes: ${frame?.writeCount ?? 0}`}
          </Typography>
          <Typography
            sx={{
              color: palette.opRead.main,
            }}
          >
            {`Reads: ${frame?.readCount ?? 0}`}
          </Typography>
          <Typography
            sx={{
              color: palette.opCompare.main,
            }}
          >
            {`Compares: ${frame?.compareCount ?? 0}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
        />
      </Stack>
      {frame === undefined && <ShuffleRequestRegion onClick={shuffleDataset} />}
      {frame !== undefined && <MergeSortVisualizer frame={frame} />}
    </Box>
  );
});
