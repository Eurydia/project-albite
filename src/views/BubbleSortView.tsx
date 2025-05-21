import { useBubbleSort } from "@/hooks/useBubbleSort";
import { generateDataset } from "@/services/generate-dataset";
import {
  AutorenewRounded,
  FastForwardRounded,
  FastRewindRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  blue,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { isEqual } from "lodash";
import { memo, useMemo, useState, type FC } from "react";

const ITEM_SIZE = 15;
type ItemProps = {
  value: number;
  compared: boolean;
  swapping: boolean;
  swapped: boolean;
};
const Item: FC<ItemProps> = memo(
  ({ value, compared, swapped, swapping }) => {
    let backgroundColor: string = grey["300"];
    if (compared) {
      backgroundColor = blue["300"];
    } else if (swapping) {
      backgroundColor = orange["200"];
    } else if (swapped) {
      backgroundColor = green["400"];
    }

    return (
      <Grid
        size={1}
        sx={{
          backgroundColor,
          height: `${(value / ITEM_SIZE) * 100}%`,
        }}
      ></Grid>
    );
  },
  isEqual
);

export const BubbleSortView: FC = () => {
  const { getFrame, nextFrame, prevFrame, shuffleDataset } =
    useBubbleSort(generateDataset(ITEM_SIZE));
  const [descOpen, setDescOpen] = useState(true);
  const {
    compared,
    swapped,
    comparisonCount,
    swapCount,
    items,
    swapping,
    description,
  } = useMemo(() => {
    return getFrame()!;
  }, [getFrame]);

  return (
    <Box sx={{ backgroundColor: "black" }}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          size={12}
          position="absolute"
        >
          <Stack spacing={1}>
            <Typography
              fontWeight={900}
              onClick={() => setDescOpen((prev) => !prev)}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              {`Bubble sort (Swaps: ${swapCount}, Comparisons: ${comparisonCount})`}
            </Typography>
            <Collapse in={descOpen}>
              <Typography
                fontWeight={700}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {description}
              </Typography>
            </Collapse>
          </Stack>
        </Grid>
        <Grid size={12}>
          <Grid
            container
            spacing={0}
            alignItems="baseline"
            columns={ITEM_SIZE}
            height={ITEM_SIZE * 20}
          >
            {items.map((value, index) => {
              return (
                <Item
                  key={`sort-item-${index}`}
                  value={value}
                  compared={
                    compared !== null &&
                    (index === compared.left ||
                      index === compared.right)
                  }
                  swapping={
                    swapping !== null &&
                    (index === swapping.left ||
                      index === swapping.right)
                  }
                  swapped={
                    swapped !== null &&
                    (index === swapped.left ||
                      index === swapped.right)
                  }
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid size={12}>
          <Toolbar
            variant="dense"
            disableGutters
            sx={{ gap: { xs: 1, md: 2 }, flexWrap: "wrap" }}
          >
            <Button
              startIcon={<FastRewindRounded />}
              variant="contained"
              onClick={prevFrame}
            >
              Previous Frame
            </Button>
            <Button
              startIcon={<AutorenewRounded />}
              variant="contained"
              onClick={shuffleDataset}
            >
              Shuffle
            </Button>
            <Button
              variant="contained"
              endIcon={<FastForwardRounded />}
              onClick={nextFrame}
            >
              Next Frame
            </Button>
          </Toolbar>
        </Grid>
      </Grid>
    </Box>
  );
};
