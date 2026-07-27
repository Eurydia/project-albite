import ChangeHistoryRounded from "@mui/icons-material/ChangeHistoryRounded";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { type FC, memo, useCallback, useEffect } from "react";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { HeapSortFrameState } from "@/types/sorting-animators/heap-sort";
import { VisualizerItem } from "./VisualizerItem";

type Props = {
  size: number;
  frame: HeapSortFrameState;
};
export const HeapSortVisualizer: FC<Props> = memo(({ size, frame }) => {
  const { playNote } = useMusicalScale();
  const { palette } = useTheme();
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

  const backgroundColorProvider = useCallback(
    (index: number) => {
      let backgroundColor = palette.rangeBounded.light;
      if (frame.verifyAt === index) {
        backgroundColor = palette.opVerify.main;
      } else if (frame.rightBound !== undefined && index > frame.rightBound) {
        backgroundColor = palette.rangeBounded.dark;
      } else if (frame.compared?.includes(index)) {
        backgroundColor = palette.opCompare.main;
      } else if (frame.swapped?.includes(index)) {
        backgroundColor = palette.opSwap.main;
      }
      return backgroundColor;
    },
    [palette, frame],
  );

  const mouseEnterHandleProvider = useCallback(
    (value: number) => () => playNote(value),
    [playNote],
  );

  return (
    <Grid
      container
      columns={size}
      spacing={0}
      sx={{ flexBasis: 0, flexGrow: 1, alignItems: "flex-end" }}
    >
      {frame.items.map((value, index) => {
        const backgroundColor = backgroundColorProvider(index);
        const labelColor = palette.getContrastText(backgroundColor);
        return (
          <VisualizerItem
            key={`sort-item-${index}`}
            backgroundColor={backgroundColor}
            height={(value / frame.items.length) * 100}
            onMouseEnter={mouseEnterHandleProvider(value)}
          >
            {frame.parent === index && (
              <CircleOutlined
                sx={{
                  color: labelColor,
                  width: "100%",
                }}
              />
            )}
            {frame.children?.includes(index) && (
              <ChangeHistoryRounded
                sx={{
                  color: labelColor,
                  width: "100%",
                }}
              />
            )}
          </VisualizerItem>
        );
      })}
    </Grid>
  );
});
