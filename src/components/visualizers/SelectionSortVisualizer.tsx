import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { SelectionSortFrameState } from "@/types/sorting-animators/selection-sort";
import { ChangeHistoryRounded } from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  value: number;
  index: number;
  frame: SelectionSortFrameState;
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ frame, index, value }) => {
    const { palette } = useTheme();

    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor = palette.rangeBounded.light;
    if (frame.verifyAt === index) {
      backgroundColor = palette.opVerify.main;
    } else if (
      frame.leftBound !== undefined &&
      index < frame.leftBound
    ) {
      backgroundColor = palette.rangeBounded.dark;
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
    }
    const iconColor =
      palette.getContrastText(backgroundColor);

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "clip",
        }}
      >
        {frame.key === index && (
          <ChangeHistoryRounded
            sx={{
              color: iconColor,
            }}
          />
        )}
      </Grid>
    );
  }
);

type SelectionSortVisualizerProps = {
  frame: SelectionSortFrameState;
};
export const SelectionSortVisualizer: FC<SelectionSortVisualizerProps> =
  memo(({ frame }) => {
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
            value={value}
            index={index}
            frame={frame}
          />
        ))}
      </Grid>
    );
  });
