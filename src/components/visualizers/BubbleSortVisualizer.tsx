import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { BubbleSortFrameData } from "@/types/sorting-animators/bubble-sort";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type SortVisualizationProps = {
  index: number;
  value: number;
  frame: BubbleSortFrameData;
};
const SortVisualizationItem: FC<SortVisualizationProps> =
  memo(({ index, value, frame }) => {
    const { palette } = useTheme();
    const height = (value / frame.items.length) * 100;

    let backgroundColor: string =
      palette.rangeBounded.light;
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
      backgroundColor = palette.rangeBounded.main;
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
  });

type Props = {
  size: number;
  frame: BubbleSortFrameData;
};
export const BubbleSortVisualizer: FC<Props> = memo(
  ({ frame, size }) => {
    const { playNote } = useMusicalScale();

    useEffect(() => {
      if (frame.compared !== undefined) {
        const pos = Math.max(...frame.compared);
        playNote(frame.items.at(pos)!);
      }
      if (frame.swapped !== undefined) {
        const pos = Math.max(...frame.swapped);
        playNote(frame.items.at(pos)!);
      }
      if (frame.verifyAt !== undefined) {
        playNote(frame.verifyAt);
      }
    }, [frame, playNote]);

    return (
      <Grid
        container
        columns={size}
        spacing={0}
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {frame.items.map((value, index) => (
          <SortVisualizationItem
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
