import { Box, Stack, Typography, useTheme } from "@mui/material";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { CountingSortVisualizer } from "@/components/visualizers/CountingSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { CountingSortAnimator } from "@/services/sorting-animators/counting-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

const CountingSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new CountingSortAnimator(size),
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
        <Typography component="h1" variant="h5" fontWeight={900}>
          {`Counting sort`}
        </Typography>
        <Stack flexDirection="row" flexWrap="wrap" spacing={1} useFlexGap>
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
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
        />
      </Stack>
      {frame === undefined && <ShuffleRequestRegion onClick={shuffleDataset} />}
      {frame !== undefined && <CountingSortVisualizer frame={frame} />}
    </Box>
  );
};

export const CountingSortView = memo(CountingSortView_);
