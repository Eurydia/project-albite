import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { performSelectionSort } from "@/services/sorters/selection-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import { KeyRounded } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  blue,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortItemProps = {
  height: number;
  compared: boolean;
  swapped: boolean;
  locked: boolean;
  keyElement: boolean;
  verify: boolean;
};
const SortItem: FC<SortItemProps> = memo(
  ({
    compared,
    height,
    swapped,
    locked,
    keyElement,
    verify,
  }) => {
    let backgroundColor: string = grey[200];
    if (verify) {
      backgroundColor = orange["A200"];
    } else if (locked) {
      backgroundColor = grey["A400"];
    } else if (compared) {
      backgroundColor = blue["A200"];
    } else if (swapped) {
      backgroundColor = green["A200"];
    }

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {keyElement && (
          <KeyRounded sx={{ color: "black" }} />
        )}
      </Grid>
    );
  }
);

const SelectionSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();

  const { frame, nextFrame, prevFrame, shuffleDataset } =
    useSortAnimator(
      generateDataset(size),
      performSelectionSort
    );

  const { playNote } = useMusicalScale({
    scalePattern: MusicalScales.MajorPentatonic,
  });

  useEffect(() => {
    if (frame === null || frame.compared === undefined) {
      return;
    }
    playNote(frame.items.at(frame.compared.at(0)!)!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.swapped === undefined) {
      return;
    }
    playNote(frame.items.at(frame.swapped.at(0)!)!);
  }, [frame, playNote]);

  useEffect(() => {
    if (frame === null || frame.verify === undefined) {
      return;
    }
    playNote(frame.items.at(frame.verify)!);
  }, [frame, playNote]);

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const {
    compareCount,
    swapCount,
    items,
    compared,
    swapped,
    verify,
    key,
    leftBound,
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
      <Stack spacing={1}>
        <Typography
          fontWeight={900}
          sx={{ userSelect: "none" }}
        >
          {`Selection sort`}
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
              userSelect: "none",
              color: green["A200"],
            }}
          >
            {`Swaps: ${swapCount}`}
          </Typography>
          <Typography
            sx={{
              userSelect: "none",
              color: blue["A200"],
            }}
          >
            {`Comparisons: ${compareCount}`}
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
        columns={size}
        spacing={0}
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {items.map((value, index) => (
          <SortItem
            key={`sort-item-${index}`}
            height={(value / items.length) * 100}
            compared={
              compared !== undefined &&
              compared.includes(index)
            }
            swapped={
              swapped !== undefined &&
              swapped.includes(index)
            }
            verify={verify === index}
            locked={
              leftBound !== undefined && index < leftBound
            }
            keyElement={key === index}
          />
        ))}
      </Grid>
    </Box>
  );
};

export const SelectionSortView: FC = memo(
  SelectionSortView_
);
