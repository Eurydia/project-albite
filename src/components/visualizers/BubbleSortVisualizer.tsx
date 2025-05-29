import {
  MusicalScales,
  useMusicalScale,
} from "@/hooks/useMusicalNotes";
import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import { Grid, useTheme } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type Props = {
  frame: BubbleSortFrameData;
};
export const BubbleSortVisualizer: FC<Props> = memo(
  ({ frame }) => {
    const { palette } = useTheme();
    const { playNote } = useMusicalScale({
      gain: 0.05,
      duration: 1,
      fadeDuration: 0.2,
      scalePattern: MusicalScales.Phrygian,
    });

    useEffect(() => {
      if (frame.compared !== undefined) {
        const pos = Math.max(...frame.compared);
        const item = frame.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (frame.swapped !== undefined) {
        const pos = Math.max(...frame.swapped);
        const item = frame.items.at(pos);
        if (item !== undefined) {
          playNote(item);
        }
      }
      if (frame.verifyAt !== undefined) {
        playNote(frame.verifyAt);
      }
    }, [frame, playNote]);

    const backgroundColorProvider = useCallback(
      (index: number) => {
        let backgroundColor = palette.rangeBounded.light;
        if (frame.verifyAt === index) {
          backgroundColor = palette.opVerify.main;
        } else if (
          frame.compared !== undefined &&
          frame.compared.includes(index)
        ) {
          backgroundColor = palette.opCompare.main;
        } else if (
          frame.swapped !== undefined &&
          frame.swapped.includes(index)
        ) {
          backgroundColor = palette.opSwap.main;
        } else if (
          frame.rightBound !== undefined &&
          index >= frame.rightBound
        ) {
          backgroundColor = palette.rangeBounded.dark;
        }
        return backgroundColor;
      },
      [frame, palette]
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
        columns={frame.items.length}
        spacing={0}
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {frame.items.map((value, index) => (
          <VisualizerItem
            key={`sort-item-${index}`}
            height={(value / frame.items.length) * 100}
            backgroundColor={backgroundColorProvider(index)}
            onMouseEnter={mouseEnterHandleProvider(value)}
          />
        ))}
      </Grid>
    );
  }
);
