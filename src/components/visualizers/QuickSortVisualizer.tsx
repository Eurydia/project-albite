import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { QuicksortFrameState } from "@/types/sorting-animators/quick-sort";
import {
  ChangeHistoryRounded,
  CircleOutlined,
} from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type VisualizerItemProps = {
  value: number;
  index: number;
  frame: QuicksortFrameState;
};
const VisualizerItem: FC<VisualizerItemProps> = memo(
  ({ frame, index, value }) => {
    const { palette } = useTheme();
    const height = (value / Math.max(...frame.items)) * 100;

    let backgroundColor = palette.rangeBounded.light;
    if (frame.terminals !== undefined) {
      const tMin = Math.min(...frame.terminals);
      const tMax = Math.max(...frame.terminals);
      if (index < tMin || index > tMax) {
        backgroundColor = palette.rangeBounded.dark;
      }
    }
    if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = palette.opCompare.main;
    } else if (
      frame.swapped !== undefined &&
      frame.swapped.includes(index)
    ) {
      backgroundColor = palette.opSwap.main;
    } else if (frame.verifyAt === index) {
      backgroundColor = palette.opVerify.main;
    }

    const iconColor =
      palette.getContrastText(backgroundColor);
    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${height}%`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          overflow: "clip",
        }}
      >
        {frame.partition === index && (
          <ChangeHistoryRounded
            sx={{
              color: iconColor,
              width: "100%",
            }}
          />
        )}
        {frame.key === index && (
          <CircleOutlined
            sx={{
              color: iconColor,
              width: "100%",
            }}
          />
        )}
      </Grid>
    );
  }
);

type Props = {
  frame: QuicksortFrameState;
};
export const QuickSortVisualizer: FC<Props> = memo(
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
        const item = frame.items.at(frame.verifyAt);
        if (item !== undefined) {
          playNote(item);
        }
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
            frame={frame}
            index={index}
            value={value}
          />
        ))}
      </Grid>
    );
  }
);
