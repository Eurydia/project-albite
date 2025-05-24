import { useSortAnimator } from "@/hooks/useBubbleSort";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { performCountingSort } from "@/services/counting-sort";
import { generateDataset } from "@/services/generate-dataset";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { grey, orange, teal } from "@mui/material/colors";
import { useEffect, type FC } from "react";

type RendererElemenetProps = {
  size: number;
  value: number;
  maxValue: number;
  stateRead: boolean;
  stateWrite: boolean;
};
const ItemElement: FC<RendererElemenetProps> = (props) => {
  const { value, maxValue, stateRead, stateWrite } = props;

  const clampedValue: number = Math.max(value, 0);

  const height: number = (clampedValue / maxValue) * 100;

  let bgColor: string = grey[200];
  if (stateRead) {
    bgColor = teal.A200;
  }
  if (stateWrite) {
    bgColor = orange.A200;
  }

  return (
    <Grid
      size={1}
      height={`${height}%`}
      bgcolor={alpha(bgColor, 0.6)}
    />
  );
};

const ITEM_SIZE: number = 40;
export const CountingSortView: FC = () => {
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(
      generateDataset(ITEM_SIZE),
      performCountingSort
    );

  const { playNote } = useMusicalScale({
    scalePattern: [0, 2, 4, 6, 7, 9, 11], // Lydian
    baseMidiNote: 60, // still C4
    gain: 0.3, // a bit louder
    duration: 0.6,
    fadeDuration: 0.2,
    waveform: "sine",
  });

  useEffect(() => {
    if (frame === null) {
      return;
    }
    const { readAt, writtenAt, items } = frame.mainMem;
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
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null) {
      return;
    }
    const { readAt, writtenAt, items } = frame.sortMem;
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
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null) {
      return;
    }
    const { readAt, writtenAt, items } = frame.auxiMem;
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
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }
  const {
    description,
    memReadCount,
    memWriteCount,
    auxiMem,
    mainMem,
    sortMem,
  } = frame;

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
          <Typography
            fontWeight={900}
            sx={{ userSelect: "none" }}
          >
            {`Counting sort (Writes: ${memWriteCount}, Reads: ${memReadCount})`}
          </Typography>
          <Tooltip
            title={<Typography>{description}</Typography>}
          >
            <Typography
              fontWeight={700}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {description}
            </Typography>
          </Tooltip>
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
        marginBottom={2}
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
          <Grid
            container
            columns={ITEM_SIZE}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {mainMem.items.map((value, index) => {
              return (
                <ItemElement
                  key={`sort-item-${index}`}
                  value={value}
                  size={ITEM_SIZE}
                  maxValue={ITEM_SIZE}
                  stateRead={mainMem.readAt === index}
                  stateWrite={mainMem.writtenAt === index}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Grid
            container
            columns={ITEM_SIZE + 1}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {auxiMem.items.map((value, index) => {
              return (
                <ItemElement
                  key={`sort-item-${index}`}
                  value={value}
                  size={ITEM_SIZE}
                  maxValue={ITEM_SIZE}
                  stateRead={auxiMem.readAt === index}
                  stateWrite={auxiMem.writtenAt === index}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Grid
            container
            columns={ITEM_SIZE}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {sortMem.items.map((value, index) => {
              return (
                <ItemElement
                  key={`sort-item-${index}`}
                  value={value}
                  size={ITEM_SIZE}
                  maxValue={ITEM_SIZE}
                  stateRead={sortMem.readAt === index}
                  stateWrite={sortMem.writtenAt === index}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
