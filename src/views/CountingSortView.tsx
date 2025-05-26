import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import { useSortAnimatorGenerator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { countingSortAnimator } from "@/services/sorting-animators/counting-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortItemProps = {
  height: number;
  isRead: boolean;
  isWritten: boolean;
};
const SortItem: FC<SortItemProps> = memo(
  ({ height, isRead, isWritten }) => {
    let backgroundColor: string = grey[200];
    if (isRead) {
      backgroundColor = blue["A200"];
    } else if (isWritten) {
      backgroundColor = orange["A200"];
    }

    return (
      <Grid
        size={1}
        height={`${height}%`}
        bgcolor={alpha(backgroundColor, 0.8)}
      />
    );
  }
);

type MemoryDisplayProps = {
  items: number[];
  readAt?: number;
  writtenAt?: number;
  pattern: readonly number[];
};
const MemoryDisplay: FC<MemoryDisplayProps> = memo(
  ({ items, readAt, writtenAt, pattern }) => {
    const { playNote } = useMusicalScale({
      scalePattern: pattern,
    });

    useEffect(() => {
      if (readAt !== undefined) {
        const item = items.at(readAt);
        if (item !== undefined && item >= 0) {
          playNote(item + 1);
        }
      }
      if (writtenAt !== undefined) {
        const item = items.at(writtenAt);
        if (item !== undefined && item >= 0) {
          playNote(item + 1);
        }
      }
    }, [items, playNote, readAt, writtenAt]);

    return (
      <Grid
        container
        columns={items.length}
        spacing={0}
        sx={{
          height: "100%",
          alignItems: "flex-end",
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        {items.map((value, index) => {
          return (
            <SortItem
              key={`sort-item-${index}`}
              height={(value / items.length) * 100}
              isRead={readAt === index}
              isWritten={writtenAt === index}
            />
          );
        })}
      </Grid>
    );
  }
);

const CountingSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, reset } =
    useSortAnimatorGenerator(() =>
      countingSortAnimator(generateDataset(size))
    );

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const { readCount, writeCount } = frame;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
          {`Counting sort`}
        </Typography>
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          spacing={1}
          useFlexGap
        >
          <Typography
            sx={{
              color: blue["A200"],
            }}
          >
            {`Writes: ${writeCount}`}
          </Typography>
          <Typography
            sx={{
              color: orange["A100"],
            }}
          >
            {`Reads: ${readCount}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={reset}
        />
      </Stack>
      <Grid
        container
        spacing={2}
        columns={1}
        sx={{
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            {...frame.mainMem}
            pattern={MusicalScales.Phrygian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            {...frame.auxiMem}
            pattern={MusicalScales.Dorian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            {...frame.sortMem}
            pattern={MusicalScales.Major}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const CountingSortView = memo(CountingSortView_);
