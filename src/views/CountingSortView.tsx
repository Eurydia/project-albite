import {
  SCALES,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { performCountingSort } from "@/services/counting-sort";
import { generateDataset } from "@/services/generate-dataset";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import {
  AutorenewRounded,
  FastForwardRounded,
  FastRewindRounded,
} from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Grid,
  Stack,
  Toolbar,
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
const ItemElement: FC<ItemElementProps> = (props) => {
  const { height, isRead, isWritten } = props;

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
};

type MemoryDisplayProps = {
  items: number[];
  readAt: number;
  writtenAt: number;
  pattern: readonly number[];
};
const MemoryDisplay: FC<MemoryDisplayProps> = memo(
  ({ items, readAt, writtenAt, pattern }) => {
    const { playNote } = useMusicalScale({
      scalePattern: pattern,
      baseMidiNote: 60,
      gain: 0.3,
      duration: 0.6,
      fadeDuration: 0.2,
      waveform: "sine",
    });

    useEffect(() => {
      if (readAt !== -1) {
        const item = items.at(readAt);
        if (item !== undefined && item >= 0) {
          playNote(item + 1);
        }
      }
      if (writtenAt !== -1) {
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

export const CountingSortView: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(
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
        <Stack spacing={1}>
          <Stack
            flexDirection="row"
            flexWrap="wrap"
            spacing={1}
            useFlexGap
          >
            <Typography
              fontWeight={900}
              sx={{
                userSelect: "none",
              }}
            >
              {`Counting sort`}
            </Typography>
            <Typography
              fontWeight={700}
              sx={{
                userSelect: "none",
                color: teal["A200"],
              }}
            >
              {`Writes: ${memWriteCount}`}
            </Typography>
            <Typography
              fontWeight={700}
              sx={{
                userSelect: "none",
                color: orange["A200"],
              }}
            >
              {`Reads: ${memReadCount}`}
            </Typography>
          </Stack>
        </Stack>
        <Toolbar
          variant="dense"
          disableGutters
          sx={{ gap: { xs: 1, md: 2 }, flexWrap: "wrap" }}
        >
          <Button
            startIcon={<FastRewindRounded />}
            variant="contained"
            onClick={prevFrame}
          >
            Previous Frame
          </Button>
          <Button
            startIcon={<AutorenewRounded />}
            variant="contained"
            onClick={shuffleDataset}
          >
            Shuffle
          </Button>
          <Button
            variant="contained"
            endIcon={<FastForwardRounded />}
            onClick={nextFrame}
          >
            Next Frame
          </Button>
        </Toolbar>
      </Stack>
      <Grid
        container
        padding={2}
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
            pattern={SCALES.Phrygian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            {...frame.auxiMem}
            pattern={SCALES.Dorian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            {...frame.sortMem}
            pattern={SCALES.Major}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
