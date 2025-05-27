import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimatorGenerator";
import { BubbleSortAnimator } from "@/services/sorting-animators/bubble-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import { PanToolAltRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
  type KeyboardEvent,
} from "react";
import { useLoaderData } from "react-router";

type SortRegionElementProps = {
  index: number;
  value: number;
  frame: BubbleSortFrameData;
};
const SortRegionElement: FC<SortRegionElementProps> = memo(
  ({ index, value, frame }) => {
    const { palette } = useTheme();
    const height = (value / frame.items.length) * 100;

    let backgroundColor: string = grey["200"];
    if (frame.verifyAt === index) {
      backgroundColor = palette.opVerify.main;
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = palette.opCompare.main;
    } else if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = palette.opSwap.main;
    } else if (
      frame.rightBound !== undefined &&
      index > frame.rightBound
    ) {
      backgroundColor = palette.rangeBounded.main;
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${height}%`,
        }}
      />
    );
  }
);

type SortRegionProps = {
  size: number;
  frame: BubbleSortFrameData;
};
const SortRegion: FC<SortRegionProps> = memo(
  ({ frame, size }) => {
    const { playNote } = useMusicalScale();

    useEffect(() => {
      if (frame.compared !== undefined) {
        const pos = Math.max(...frame.compared);
        playNote(frame.items.at(pos)!);
      }
      if (frame.swapped !== undefined) {
        const pos = Math.max(...frame.swapped);
        playNote(frame.items.at(pos)!);
      }
      if (frame.verifyAt !== undefined) {
        playNote(frame.verifyAt);
      }
    }, [frame, playNote]);

    return (
      <Grid
        container
        columns={size}
        spacing={0}
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {frame.items.map((value, index) => (
          <SortRegionElement
            key={`sort-item-${index}`}
            index={index}
            value={value}
            frame={frame}
          />
        ))}
      </Grid>
    );
  }
);

const BubbleSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(new BubbleSortAnimator(size));
  const { palette } = useTheme();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case "ArrowRight":
          nextFrame();
          break;
        case "ArrowLeft":
          prevFrame();
          break;
        case "r":
          shuffleDataset();
          break;
        default:
          return;
      }
    },
    [nextFrame, prevFrame, shuffleDataset]
  );

  return (
    <Box
      tabIndex={0}
      onKeyDown={handleKeyDown}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: 0,
        flexGrow: 1,
      }}
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
          {`Bubble sort`}
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
        <Box
          onClick={shuffleDataset}
          sx={{
            flexBasis: 0,
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <PanToolAltRounded />
          <Typography>Shuffle once</Typography>
        </Box>
      )}
      {frame !== undefined && (
        <SortRegion
          frame={frame}
          size={size}
        />
      )}
    </Box>
  );
};

export const BubbleSortView: FC = memo(BubbleSortView_);
