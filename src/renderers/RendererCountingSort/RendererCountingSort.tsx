import {
  AutorenewRounded,
  FastForwardRounded,
  FastRewindRounded,
} from "@mui/icons-material";
import {
  Stack,
  Toolbar,
  Tooltip,
  type Box,
  type Button,
  type Grid,
  type Typography,
} from "@mui/material";
import type { orange, teal } from "@mui/material/colors";
import type { FC, SyntheticEvent, useState } from "react";
import { FrameState, countingSort } from "./helper";

type RendererElemenetProps = {
  size: number;
  maxValue: number;
  value: number;
  stateRead: boolean;
  stateWrite: boolean;
};
const RendererElement: FC<RendererElemenetProps> = (
  props
) => {
  const { value, maxValue, stateRead, stateWrite } = props;

  const clampedValue: number = Math.max(value, 0);

  const height: number = (clampedValue / maxValue) * 100;

  let bgColor: string = `hsl(0, 0%, ${
    (value / maxValue) * 90
  }%)`;

  if (stateRead) {
    bgColor = teal.A100;
  }

  if (stateWrite) {
    bgColor = orange.A100;
  }

  return (
    <Grid
      item
      xs={1}
      className="renderer-element"
      height={`${height}%`}
      bgcolor={bgColor}
    />
  );
};

type RendererCountingSortProps = {
  dataset: number[];
  heightPx: number;
};
export const RendererCountingSort: FC<
  RendererCountingSortProps
> = (props) => {
  const { dataset, heightPx } = props;

  const size: number = dataset.length;
  const maxValue: number = Math.max(...dataset);

  const [frame, setFrame] = useState<number>(0);
  const [tabPanelIndex, setTabPabelIndex] =
    useState<number>(0);
  const [frameStates] = useState<FrameState[]>(() => {
    const frameStates: FrameState[] = [];
    const dd = [...dataset];
    countingSort(dd, size, frameStates);

    return frameStates;
  });

  const onFrameAdvance = () => {
    if (frame === frameStates.length - 1) {
      return;
    }

    setFrame((prevFrame) => {
      return prevFrame + 1;
    });
  };

  const onFrameRewind = () => {
    if (frame < 1) {
      return;
    }

    setFrame((prevFrame) => {
      return prevFrame - 1;
    });
  };
  const onTabPanelIndexChange = (
    _: SyntheticEvent,
    nextIndex: string
  ) => {
    setTabPabelIndex(Number.parseInt(nextIndex));
  };

  const currFrame: FrameState = frameStates[frame];

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
