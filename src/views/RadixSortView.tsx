import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import { useSortAnimator } from "@/hooks/useSortAnimator";
import { generateDataset } from "@/services/generate-dataset";
import { performRadixSort } from "@/services/sorting-animators/radix-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { RadixSortFrameState } from "@/types/sorters/radix-sort";
import {
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  blue,
  deepPurple,
  grey,
} from "@mui/material/colors";
import { memo, useEffect, type FC } from "react";
import { useLoaderData } from "react-router";

type SortItemProps = {
  index: number;
  value: number;
  mem: RadixSortFrameState["mainMem"];
};
const SortItem: FC<SortItemProps> = memo(
  ({ index, value, mem }) => {
    const height = (value / mem.items.length) * 100;

    let backgroundColor: string = grey["200"];
    if (mem.read === index) {
      backgroundColor = blue["A200"];
    } else if (mem.written === index) {
      backgroundColor = deepPurple["A400"];
    }

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
        }}
      />
    );
  }
);

type MemoryDisplayProps = {
  mem:
    | RadixSortFrameState["mainMem"]
    | RadixSortFrameState["auxiMem"]
    | RadixSortFrameState["sortMem"];
  pattern: readonly number[];
};
const MemoryDisplay: FC<MemoryDisplayProps> = memo(
  ({ mem, pattern }) => {
    const { playNote } = useMusicalScale({
      scalePattern: pattern,
    });

    useEffect(() => {
      if (mem.read !== undefined) {
        const item = mem.items.at(mem.read);
        if (item !== undefined && item >= 0) {
          playNote(item + 1);
        }
      }
      if (mem.written !== undefined) {
        const item = mem.items.at(mem.written);
        if (item !== undefined && item >= 0) {
          playNote(item + 1);
        }
      }
    }, [mem, playNote]);

    return (
      <Grid
        container
        columns={mem.items.length}
        spacing={0}
        sx={{
          height: "100%",
          alignItems: "flex-end",
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        {mem.items.map((value, index) => {
          return (
            <SortItem
              key={`sort-item-${index}`}
              index={index}
              value={value}
              mem={mem}
            />
          );
        })}
      </Grid>
    );
  }
);

const RadixSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();
  const {
    frame,
    nextFrame,
    prevFrame,
    reset: shuffleDataset,
  } = useSortAnimator(
    generateDataset(size),
    performRadixSort
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
              userSelect: "none",
              color: blue["A200"],
            }}
          >
            {`Writes: ${memWriteCount}`}
          </Typography>
          <Typography
            sx={{
              userSelect: "none",
              color: deepPurple["A100"],
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
          sx={{
            flexGrow: 1,
          }}
        >
          <MemoryDisplay
            mem={frame.mainMem}
            pattern={MusicalScales.Phrygian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            mem={frame.auxiMem}
            pattern={MusicalScales.NaturalMinor}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemoryDisplay
            mem={frame.sortMem}
            pattern={MusicalScales.Major}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export const RadixSortView = memo(RadixSortView_);
