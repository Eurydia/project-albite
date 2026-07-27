import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { InsertionSortVisualizer } from "@/components/visualizers/InsertionSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { InsertionSortAnimator } from "@/services/sorting-animators/insertion-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

export const InsertionSortView: FC = memo(() => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new InsertionSortAnimator(size),
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
          {`Insertion sort`}
        </Typography>
        <Stack
          spacing={1}
          direction={"row"}
          sx={{ flexWrap: "wrap", alignItems: "center" }}
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
      {frame !== undefined && <InsertionSortVisualizer frame={frame} />}
    </Box>
  );
});
