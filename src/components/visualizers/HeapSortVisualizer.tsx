import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { HeapSortFrameState } from "@/types/sorting-animators/heap-sort";
import {
  ChangeHistoryRounded,
  CircleOutlined,
} from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  value: number;
  index: number;
  frame: HeapSortFrameState;
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ value, index, frame }) => {
    const { palette } = useTheme();

    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor = palette.rangeBounded.light;
    if (frame.verifyAt === index) {
      backgroundColor = palette.opVerify.main;
    } else if (
      frame.rightBound !== undefined &&
      index > frame.rightBound
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

    const labelColor =
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
        {frame.parent === index && (
          <CircleOutlined
            sx={{
              color: labelColor,
              width: "100%",
            }}
          />
        )}
        {frame.children !== undefined &&
          frame.children.includes(index) && (
            <ChangeHistoryRounded
              sx={{
                color: labelColor,
                width: "100%",
              }}
            />
          )}
      </Grid>
    );
  }
);

type Props = {
  size: number;
  frame: HeapSortFrameState;
};
export const HeapSortVisualizer: FC<Props> = memo(
  ({ size, frame }) => {
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
        const item = frame.items.at(frame.verifyAt);
        if (item !== undefined) {
          playNote(item);
        }
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
          <VisualizerItem
            key={`sort-item-${index}`}
            value={value}
            index={index}
            frame={frame}
          />
        ))}
      </Grid>
    );
  }
);
