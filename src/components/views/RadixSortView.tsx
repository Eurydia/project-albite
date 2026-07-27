import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { RadixSortVisualizer } from "@/components/visualizers/RadixSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { RadixSortAnimator } from "@/services/sorting-animators/radix-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

export const RadixSortView: FC = memo(() => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new RadixSortAnimator(size),
  );

  return (
    <Box
      component="section"
      tabIndex={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        flexBasis: 0,
      }}
    >
      <Stack component="header" spacing={1}>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 900 }}>
          {`Radix sort`}
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
            {`Writes: ${frame?.memWriteCount ?? 0}`}
          </Typography>
          <Typography
            sx={{
              color: palette.opRead.main,
            }}
          >
            {`Reads: ${frame?.memReadCount ?? 0}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
        />
      </Stack>
      {frame === undefined && <ShuffleRequestRegion onClick={shuffleDataset} />}
      {frame !== undefined && <RadixSortVisualizer frame={frame} />}
    </Box>
  );
});
