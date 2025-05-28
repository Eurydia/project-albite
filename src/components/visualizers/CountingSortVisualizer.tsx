import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { CountingSortFrameState } from "@/types/sorting-animators/counting-sort";
import { Grid, useTheme } from "@mui/material";
import { type FC, memo, useEffect } from "react";

type VisualizerItemProps = {
  height: number;
  isRead?: boolean;
  isWritten?: boolean;
  isVerify?: boolean;
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
  playAudio?: boolean;
  mem: CountingSortFrameState["mainMem"];
};
const Visualizer: FC<VisualizerProps> = memo(
  ({ mem, playAudio }) => {
    const { playNote } = useMusicalScale();

    useEffect(() => {
      if (!playAudio) {
        return;
      }
      if (mem.readAt !== undefined) {
        const item = mem.items.at(mem.readAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (mem.writtenAt !== undefined) {
        const item = mem.items.at(mem.writtenAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (mem.verifyAt !== undefined) {
        const item = mem.items.at(mem.verifyAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
    }, [mem, playNote, playAudio]);

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
              height={(value / mem.items.length) * 100}
              isRead={mem.readAt === index}
              isWritten={mem.writtenAt === index}
              isVerify={mem.verifyAt === index}
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
            mem={frame.mainMem}
            playAudio
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer mem={frame.auxiMem} />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer mem={frame.sortMem} />
        </Grid>
      </Grid>
    );
  }
);
