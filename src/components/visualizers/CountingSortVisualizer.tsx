import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import type { CountingSortFrameState } from "@/types/sorting-animators/counting-sort";
import { Grid, useTheme } from "@mui/material";
import {
  type FC,
  memo,
  useCallback,
  useEffect,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type VisualizerProps = {
  playOnRead?: boolean;
  playOnWrite?: boolean;
  playOnVerify?: boolean;
  mem: CountingSortFrameState["mainMem"];
};
const Visualizer: FC<VisualizerProps> = memo(
  ({ mem, playOnRead, playOnWrite, playOnVerify }) => {
    const { playNote } = useMusicalScale({
      gain: 0.05,
      duration: 1,
      fadeDuration: 0.2,
      scalePattern: MusicalScales.Lydian,
    });
    const { palette } = useTheme();

    useEffect(() => {
      if (playOnRead && mem.readAt !== undefined) {
        const item = mem.items.at(mem.readAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (playOnWrite && mem.writtenAt !== undefined) {
        const item = mem.items.at(mem.writtenAt);
        if (item !== undefined && item > 0) {
          playNote(item);
        }
      }
      if (playOnVerify && mem.verifyAt !== undefined) {
        const item = mem.items.at(mem.verifyAt);
        if (item !== undefined) {
          playNote(item);
        }
      }
    }, [
      mem,
      playNote,
      playOnRead,
      playOnWrite,
      playOnVerify,
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
        }
        return backgroundColor;
      },
      [mem, palette]
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
              height={(value / mem.items.length) * 100}
              onMouseEnter={mouseEnterHandleProvider(value)}
              backgroundColor={backgroundColorProvider(
                index
              )}
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
            playOnVerify
            playOnRead
            playOnWrite
          />
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Visualizer
            mem={frame.auxiMem}
            playOnWrite
          />
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
