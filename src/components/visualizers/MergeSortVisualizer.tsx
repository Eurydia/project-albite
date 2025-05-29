import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { MergeSortFrameData } from "@/types/sorting-animators/merge-sort";
import { Grid, useTheme } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type VisualizerProps = {
  playOnCompare?: boolean;
  playOnRead?: boolean;
  playOnWrite?: boolean;
  playOnVerify?: boolean;
  mem: MergeSortFrameData["mainMem"];
};
const Visualizer: FC<VisualizerProps> = memo(
  ({
    mem,
    playOnCompare,
    playOnRead,
    playOnVerify,
    playOnWrite,
  }) => {
    const { playNote } = useMusicalScale();
    const { palette } = useTheme();
    useEffect(() => {
      if (playOnCompare && mem.compared !== undefined) {
        const pos = Math.max(...mem.compared);
        const item = mem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (playOnVerify && mem.verifyAt !== undefined) {
        const pos = Math.max(mem.verifyAt);
        const item = mem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (playOnRead && mem.readAt !== undefined) {
        const item = mem.items.at(mem.readAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (playOnWrite && mem.writtenAt !== undefined) {
        const item = mem.items.at(mem.writtenAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
    }, [
      mem,
      playNote,
      playOnCompare,
      playOnVerify,
      playOnRead,
      playOnWrite,
    ]);

    const backgroundColorProvider = useCallback(
      (index: number) => {
        let backgroundColor = palette.rangeBounded.light;
        if (mem.verifyAt === index) {
          backgroundColor = palette.opVerify.main;
        } else if (mem.readAt === index) {
          backgroundColor = palette.opRead.main;
        } else if (mem.writtenAt === index) {
          backgroundColor = palette.opWrite.main;
        } else if (
          mem.compared !== undefined &&
          mem.compared.includes(index)
        ) {
          backgroundColor = palette.opCompare.main;
        } else if (mem.terminals !== undefined) {
          const tMin = Math.min(...mem.terminals);
          const tMax = Math.max(...mem.terminals);
          if (index < tMin || index > tMax) {
            backgroundColor = palette.rangeBounded.dark;
          }
        }
        return backgroundColor;
      },
      [
        mem.compared,
        mem.readAt,
        mem.terminals,
        mem.verifyAt,
        mem.writtenAt,
        palette.opCompare.main,
        palette.opRead.main,
        palette.opVerify.main,
        palette.opWrite.main,
        palette.rangeBounded.dark,
        palette.rangeBounded.light,
      ]
    );

    const mouseEnterHandleProvider = useCallback(
      (value: number) => () => {
        playNote(value);
      },
      [playNote]
    );

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
              onMouseEnter={mouseEnterHandleProvider(value)}
              backgroundColor={backgroundColorProvider(
                index
              )}
              height={(value / mem.items.length) * 100}
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
          <Visualizer
            mem={frame.mainMem}
            playOnCompare
            playOnRead
            playOnWrite
            playOnVerify
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer
            mem={frame.auxiMem}
            playOnRead
          />
        </Grid>
      </Grid>
    );
  }
);
