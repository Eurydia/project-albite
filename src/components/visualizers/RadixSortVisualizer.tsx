import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import type { RadixSortFrameState } from "@/types/sorting-animators/radix-sort";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  index: number;
  value: number;
  mem: RadixSortFrameState["mainMem"];
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ index, value, mem }) => {
    const { palette } = useTheme();
    const height = (value / mem.items.length) * 100;

    let backgroundColor = palette.rangeBounded.light;
    if (mem.readAt === index) {
      backgroundColor = palette.opRead.main;
    } else if (mem.writtenAt === index) {
      backgroundColor = palette.opWrite.main;
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

type Visualizer = {
  mem: RadixSortFrameState["mainMem"];
  pattern: readonly number[];
};
const MemoryDisplay: FC<Visualizer> = memo(
  ({ mem, pattern }) => {
    const { playNote } = useMusicalScale({
      scalePattern: pattern,
    });

    useEffect(() => {
      if (mem.readAt !== undefined) {
        const item = mem.items.at(mem.readAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (mem.writtenAt !== undefined) {
        const item = mem.items.at(mem.writtenAt);
        if (item !== undefined) {
          playNote(item);
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
            <VisualizerItem
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

type Props = {
  frame: RadixSortFrameState;
};
export const RadixSortVisualizer: FC<Props> = memo(
  ({ frame }) => {
    return (
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
    );
  }
);
