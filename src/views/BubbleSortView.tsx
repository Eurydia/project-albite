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
  Grid,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  blue,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { isEqual } from "lodash";
import { memo, useMemo, type FC } from "react";

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
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack
        spacing={1}
        component="div"
      >
        <Stack spacing={1}>
          <Typography
            fontWeight={900}
            sx={{ userSelect: "none" }}
          >
            {`Bubble sort (Swaps: ${swapCount}, Comparisons: ${comparisonCount})`}
          </Typography>
          <Tooltip
            title={<Typography>{description}</Typography>}
          >
            <Typography
              fontWeight={700}
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {description}
            </Typography>
          </Tooltip>
        </Stack>
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
      </Stack>
      <Grid
        container
        columns={ITEM_SIZE}
        spacing={0}
        alignItems="baseline"
        sx={{ flexBasis: 0, flexGrow: 1 }}
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
    </Box>
  );
};
