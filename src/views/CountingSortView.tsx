import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { performCountingSort } from "@/services/sorters/counting-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { grey, orange, teal } from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type ItemElementProps = {
  height: number;
  isRead: boolean;
  isWritten: boolean;
};
const ItemElement: FC<ItemElementProps> = memo(
  ({ height, isRead, isWritten }) => {
    let bgColor: string;
    if (isRead) {
      bgColor = teal.A200;
    } else if (isWritten) {
      bgColor = orange.A200;
    } else {
      bgColor = grey[200];
    }

    return (
      <Grid
        size={1}
        height={`${height}%`}
        bgcolor={alpha(bgColor, 0.8)}
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
            <ItemElement
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
  const {
    frame,
    nextFrame,
    prevFrame,
    reset: shuffleDataset,
  } = useSortAnimator(
    generateDataset(size),
    performCountingSort
  );

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const { memReadCount, memWriteCount } = frame;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack
        spacing={1}
        component="div"
      >
        <Typography
          fontWeight={900}
          sx={{
            userSelect: "none",
          }}
        >
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
              userSelect: "none",
              color: teal["A200"],
            }}
          >
            {`Writes: ${memWriteCount}`}
          </Typography>
          <Typography
            sx={{
              userSelect: "none",
              color: orange["A200"],
            }}
          >
            {`Reads: ${memReadCount}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={shuffleDataset}
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
