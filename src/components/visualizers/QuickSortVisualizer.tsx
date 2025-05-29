import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { QuicksortFrameState } from "@/types/sorting-animators/quick-sort";
import {
  ChangeHistoryRounded,
  CircleOutlined,
} from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type Props = {
  frame: QuicksortFrameState;
};
export const QuickSortVisualizer: FC<Props> = memo(
  ({ frame }) => {
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
        return backgroundColor;
      },
      [
        frame.compared,
        frame.swapped,
        frame.terminals,
        frame.verifyAt,
        palette.opCompare.main,
        palette.opSwap.main,
        palette.opVerify.main,
        palette.rangeBounded.dark,
        palette.rangeBounded.light,
      ]
    );

    const mouseEnterHandleProvider = useCallback(
      (value: number) => () => playNote(value),
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
        {frame.items.map((value, index) => {
          const backgroundColor =
            backgroundColorProvider(index);
          const iconColor =
            palette.getContrastText(backgroundColor);

          return (
            <VisualizerItem
              key={`sort-item-${index}`}
              backgroundColor={backgroundColor}
              height={(value / frame.items.length) * 100}
              onMouseEnter={mouseEnterHandleProvider(value)}
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
            </VisualizerItem>
          );
        })}
      </Grid>
    );
  }
);
