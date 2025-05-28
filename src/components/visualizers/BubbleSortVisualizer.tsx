import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  index: number;
  value: number;
  frame: BubbleSortFrameData;
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ index, value, frame }) => {
    const { palette } = useTheme();
    const height = (value / frame.items.length) * 100;

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
      index > frame.rightBound
    ) {
      backgroundColor = palette.rangeBounded.dark;
    }
    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${height}%`,
        }}
      />
    );
  }
);

type Props = {
  frame: BubbleSortFrameData;
};
export const BubbleSortVisualizer: FC<Props> = memo(
  ({ frame }) => {
    const { playNote } = useMusicalScale();

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
            index={index}
            value={value}
            frame={frame}
          />
        ))}
      </Grid>
    );
  }
);
