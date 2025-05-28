import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import type { CountingSortFrameState } from "@/types/sorting-animators/counting-sort";
import { Grid, useTheme } from "@mui/material";
import { type FC, memo, useEffect } from "react";

type VisualizerItemProps = {
  height: number;
  isVerify?: boolean;
  isWritten?: boolean;
  isRead?: boolean;
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ height, isRead, isWritten, isVerify }) => {
    const { palette } = useTheme();

    let backgroundColor = palette.rangeBounded.light;
    if (isVerify) {
      backgroundColor = palette.opVerify.main;
    } else if (isRead) {
      backgroundColor = palette.opRead.main;
    } else if (isWritten) {
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

type VisualizerProps = {
  items: number[];
  readAt?: number;
  writtenAt?: number;
  verifyAt?: number;
  pattern: readonly number[];
};
const Visualizer: FC<VisualizerProps> = memo(
  ({ items, verifyAt, readAt, writtenAt, pattern }) => {
    const { playNote } = useMusicalScale({
      scalePattern: pattern,
    });

    useEffect(() => {
      if (readAt !== undefined) {
        const item = items.at(readAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (writtenAt !== undefined) {
        const item = items.at(writtenAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (verifyAt !== undefined) {
        const item = items.at(verifyAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
    }, [items, playNote, readAt, verifyAt, writtenAt]);

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
            <VisualizerItem
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

type Props = {
  frame: CountingSortFrameState;
};
export const CountingSortVisualizer: FC<Props> = memo(
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
          sx={{ flexGrow: 1 }}
        >
          <Visualizer
            {...frame.mainMem}
            pattern={MusicalScales.Phrygian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer
            {...frame.auxiMem}
            pattern={MusicalScales.Dorian}
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer
            {...frame.sortMem}
            pattern={MusicalScales.Major}
          />
        </Grid>
      </Grid>
    );
  }
);
