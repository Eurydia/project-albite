import { useMusicalScale } from "@/hooks/useMusicalNotes";
import type { InsertionSortFrameState } from "@/types/sorting-animators/insertion-sort";
import { CircleOutlined } from "@mui/icons-material";
import { Grid, useTheme } from "@mui/material";
import { memo, useEffect, type FC } from "react";

type SortItemProps = {
  index: number;
  value: number;
  frame: InsertionSortFrameState;
};
const SortItem: FC<SortItemProps> = ({
  value,
  frame,
  index,
}) => {
  const { palette } = useTheme();
  const height = (value / Math.max(...frame.items)) * 100;
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

  return (
    <Grid
      size={1}
      sx={{
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: `${height}%`,
        overflow: "clip",
      }}
    >
      {frame.key === index && (
        <CircleOutlined
          sx={{
            width: "100%",
            color: palette.getContrastText(backgroundColor),
          }}
        />
      )}
    </Grid>
  );
};

type Props = {
  frame: InsertionSortFrameState;
  size: number;
};
export const InsertionSortVisualizer: FC<Props> = memo(
  ({ frame, size }) => {
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
          <SortItem
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
