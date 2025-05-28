import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
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
        backgroundColor = palette.rangeBounded.main;
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

type Props = {
  frame: MergeSortFrameData;
};
export const MergeSortVisualizer: FC<Props> = memo(
  ({ frame }) => {
    const { playNote } = useMusicalScale({
      scalePattern: MusicalScales.BluesMinor,
    });
    const { playNote: playNoteAuxi } = useMusicalScale({
      scalePattern: MusicalScales.Major,
    });

    useEffect(() => {
      if (frame.mainMem.compared !== undefined) {
        const pos = Math.max(...frame.mainMem.compared);
        const item = frame.mainMem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (frame.mainMem.verifyAt !== undefined) {
        const pos = Math.max(frame.mainMem.verifyAt);
        const item = frame.mainMem.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (frame.mainMem.readAt !== undefined) {
        const item = frame.mainMem.items.at(
          frame.mainMem.readAt
        );
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (frame.mainMem.writtenAt !== undefined) {
        const item = frame.mainMem.items.at(
          frame.mainMem.writtenAt
        );
        if (item !== undefined) {
          playNote(item);
        }
      }
    }, [frame.mainMem, playNote]);

    useEffect(() => {
      if (frame.auxiMem.readAt !== undefined) {
        const item = frame.auxiMem.items.at(
          frame.auxiMem.readAt
        );
        if (item !== undefined) {
          playNoteAuxi(item);
        }
      }
      if (frame.auxiMem.writtenAt !== undefined) {
        const item = frame.auxiMem.items.at(
          frame.auxiMem.writtenAt
        );
        if (item !== undefined) {
          playNoteAuxi(item);
        }
      }
    }, [frame.auxiMem, playNoteAuxi]);

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
          <Grid
            container
            columns={frame.mainMem.items.length}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {frame.mainMem.items.map((value, index) => {
              return (
                <VisualizerItem
                  key={`sort-item-${index}`}
                  index={index}
                  value={value}
                  frame={frame.mainMem}
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
            columns={frame.auxiMem.items.length}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {frame.auxiMem.items.map((value, index) => {
              return (
                <VisualizerItem
                  key={`sort-item-${index}`}
                  index={index}
                  value={value}
                  frame={frame.auxiMem}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
);
