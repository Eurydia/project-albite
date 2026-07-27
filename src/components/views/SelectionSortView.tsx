import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";
import { ShuffleRequestRegion } from "@/components/ShuffleRequestRegion";
import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { SelectionSortVisualizer } from "@/components/visualizers/SelectionSortVisualizer";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { SelectionSortAnimator } from "@/services/sorting-animators/selection-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";

export const SelectionSortView: FC = memo(() => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { palette } = useTheme();
  const { frame, nextFrame, prevFrame, shuffleDataset } = useSortAnimator(
    new SelectionSortAnimator(size),
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
        <Typography component="h1" variant="h5" sx={{ fontWeight: 900 }}>
          {`Selection sort`}
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
      {frame !== undefined && <SelectionSortVisualizer frame={frame} />}
    </Box>
  );
});
