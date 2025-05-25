import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { performBubbleSort } from "@/services/bubblesort";
import { generateDataset } from "@/services/generate-dataset";
import {
  AutorenewRounded,
  FastForwardRounded,
  FastRewindRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  blue,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { isEqual } from "lodash";
import { memo, useEffect, type FC } from "react";

const ITEM_SIZE = 40;

type ItemProps = {
  value: number;
  compared: boolean;
  swapping: boolean;
  swapped: boolean;
};
const ItemElement: FC<ItemProps> = memo(
  ({ value, compared, swapped, swapping }) => {
    let backgroundColor: string = grey["300"];
    if (compared) {
      backgroundColor = blue["300"];
    } else if (swapping) {
      backgroundColor = orange["200"];
    } else if (swapped) {
      backgroundColor = green["400"];
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${(value / ITEM_SIZE) * 100}%`,
        }}
      ></Grid>
    );
  },
  isEqual
);

export const BubbleSortView: FC = () => {
  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(
      generateDataset(ITEM_SIZE),
      performBubbleSort
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
    if (
      frame === null ||
      frame.swapped.at(0) === undefined
    ) {
      return;
    }
    playNote(frame.swapped.at(0)! + 1);
  }, [frame, playNote]);

  useEffect(() => {
    if (
      frame === null ||
      frame.compared.at(0) === undefined
    ) {
      return;
    }
    playNote(frame.compared.at(0)! + 1);
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }
  const {
    items,
    compared,
    swapping,
    swapped,
    description,
    swapCount,
    comparisonCount,
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
            {`Bubble sort (Swaps: ${swapCount}, Comparisons: ${comparisonCount})`}
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
        columns={ITEM_SIZE}
        spacing={0}
        alignItems="baseline"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {items.map((value, index) => {
          return (
            <ItemElement
              key={`sort-item-${index}`}
              value={value}
              compared={compared.includes(index)}
              swapping={swapping.includes(index)}
              swapped={swapped.includes(index)}
            />
          );
        })}
      </Grid>
    </Box>
  );
};
