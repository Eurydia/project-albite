import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { MergeSortFrameData } from "@/types/sorting-animators/merge-sort";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  index: number;
  value: number;
  frame: MergeSortFrameData["mainMem"];
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ index, value, frame }) => {
    const { palette } = useTheme();
    const height = (value / frame.items.length) * 100;

    let backgroundColor = palette.rangeBounded.light;
    if (frame.verifyAt === index) {
      backgroundColor = palette.opVerify.main;
    } else if (frame.readAt === index) {
      backgroundColor = palette.opRead.main;
    } else if (frame.writtenAt === index) {
      backgroundColor = palette.opWrite.main;
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = palette.opCompare.main;
    } else if (frame.terminals !== undefined) {
      const tMin = Math.min(...frame.terminals);
      const tMax = Math.max(...frame.terminals);
      if (index < tMin || index > tMax) {
        backgroundColor = palette.rangeBounded.dark;
      }
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

type MemVisualizerProps = {
  playAudio?: boolean;
  mem: MergeSortFrameData["mainMem"];
};
const MemVisualizer: FC<MemVisualizerProps> = memo(
  ({ mem, playAudio }) => {
    const { playNote } = useMusicalScale();

    useEffect(() => {
      if (!playAudio) {
        return;
      }

      if (mem.compared !== undefined) {
        const pos = Math.max(...mem.compared);
        const item = mem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (mem.verifyAt !== undefined) {
        const pos = Math.max(mem.verifyAt);
        const item = mem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
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
              index={index}
              value={value}
              frame={mem}
            />
          );
        })}
      </Grid>
    );
  }
);

type Props = {
  frame: MergeSortFrameData;
};
export const MergeSortVisualizer: FC<Props> = memo(
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
          <MemVisualizer
            mem={frame.mainMem}
            playAudio
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <MemVisualizer mem={frame.auxiMem} />
        </Grid>
      </Grid>
    );
  }
);
