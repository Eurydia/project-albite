import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { RadixSortVisualizer } from "@/components/visualizers/RadixSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { RadixSortAnimator } from "@/services/sorting-animators/radix-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  Box,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { memo, type FC } from "react";
import { useLoaderData } from "react-router";

const RadixSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(new RadixSortAnimator(size));

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
          {`Radix sort`}
        </Typography>
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          spacing={1}
          useFlexGap
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
      {frame === undefined && (
        <ShuffleRequestRegion onClick={shuffleDataset} />
      )}
      {frame !== undefined && (
        <RadixSortVisualizer frame={frame} />
      )}
    </Box>
  );
};

export const RadixSortView = memo(RadixSortView_);
