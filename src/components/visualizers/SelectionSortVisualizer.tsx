import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { SelectionSortFrameState } from "@/types/sorting-animators/selection-sort";
import { ChangeHistoryRounded } from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import {
  memo,
  useCallback,
  useEffect,
  type FC,
} from "react";
import { VisualizerItem } from "./VisualizerItem";

type SelectionSortVisualizerProps = {
  frame: SelectionSortFrameState;
};
export const SelectionSortVisualizer: FC<SelectionSortVisualizerProps> =
  memo(({ frame }) => {
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
        playNote(frame.verifyAt);
      }
    }, [frame, playNote]);

    const backgroundColorProvider = useCallback(
      (index: number) => {
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

    const onMouseEnterProvider = useCallback(
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

          return (
            <VisualizerItem
              key={`sort-item-${index}`}
              backgroundColor={backgroundColor}
              height={(value / frame.items.length) * 100}
              onMouseEnter={onMouseEnterProvider(value)}
            >
              {frame.key === index && (
                <ChangeHistoryRounded
                  sx={{
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
  });
