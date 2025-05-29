import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { InsertionSortFrameState } from "@/types/sorting-animators/insertion-sort";
import { CircleOutlined } from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type Props = {
  frame: InsertionSortFrameState;
};
export const InsertionSortVisualizer: FC<Props> = memo(
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
        if (
          frame.leftBound !== undefined &&
          index > frame.leftBound
        ) {
          backgroundColor = palette.rangeBounded.dark;
        } else if (frame.verifyAt === index) {
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
        }
        return backgroundColor;
      },
      [
        frame.compared,
        frame.leftBound,
        frame.swapped,
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
        alignItems="flex-end"
        sx={{ flexBasis: 0, flexGrow: 1 }}
      >
        {frame.items.map((value, index) => {
          const backgroundColor =
            backgroundColorProvider(index);
          return (
            <VisualizerItem
              key={`sort-item-${index}`}
              backgroundColor={backgroundColor}
              height={(value / frame.items.length) * 100}
              onMouseEnter={mouseEnterHandleProvider(value)}
            >
              {frame.key === index && (
                <CircleOutlined
                  sx={{
                    width: "100%",
                    color:
                      palette.getContrastText(
                        backgroundColor
                      ),
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
