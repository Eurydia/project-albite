import { SorterAnimationToolbar } from "@/components/SorterAnimationToolbar";
import { useSortAnimatorGenerator } from "@/hooks/useSortAnimatorGenerator";
import { generateDataset } from "@/services/generate-dataset";
import { mergeSortAnimator } from "@/services/sorting-animators/merge-sort";
import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { MergeSortFrameData } from "@/types/sorters/merge-sort";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  blue,
  deepPurple,
  green,
  grey,
  orange,
} from "@mui/material/colors";
import { type FC, memo } from "react";
import { useLoaderData } from "react-router";

type MainMemItemProps = {
  value: number;
  index: number;
  frame: MergeSortFrameData["mainMem"];
};
const MainMemItem: FC<MainMemItemProps> = memo(
  ({ value, index, frame }) => {
    const height = (value / frame.items.length) * 100;

    let backgroundColor: string = grey["A200"];
    if (frame.verifyAt === index) {
      backgroundColor = orange["A400"];
    } else if (frame.readAt === index) {
      backgroundColor = deepPurple["A400"];
    } else if (frame.writtenAt === index) {
      backgroundColor = green["A200"];
    } else if (
      frame.compared !== undefined &&
      frame.compared.includes(index)
    ) {
      backgroundColor = blue["A200"];
    } else if (frame.terminals !== undefined) {
      const tMin = Math.min(...frame.terminals);
      const tMax = Math.max(...frame.terminals);
      if (index < tMin || index > tMax) {
        backgroundColor = grey["A700"];
      }
    }

    backgroundColor = alpha(backgroundColor, 0.7);

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
        }}
      />
    );
  }
);

type AuxiMemItemProps = {
  value: number;
  index: number;
  frame: MergeSortFrameData["auxiMem"];
};
const AuxiMemItem: FC<AuxiMemItemProps> = memo(
  ({ value, index, frame }) => {
    const height =
      Math.min(value / frame.items.length, 1) * 100;

    let backgroundColor: string = grey["A200"];
    if (frame.readAt === index) {
      backgroundColor = deepPurple["A400"];
    } else if (frame.writtenAt === index) {
      backgroundColor = green["A200"];
    }

    backgroundColor = alpha(backgroundColor, 0.7);

    return (
      <Grid
        size={1}
        sx={{
          height: `${height}%`,
          backgroundColor,
        }}
      />
    );
  }
);

const MergeSortView_: FC = () => {
  const { size } = useLoaderData<SorterRouterLoaderData>();

  const { frame, nextFrame, prevFrame, reset } =
    useSortAnimatorGenerator(() =>
      mergeSortAnimator(generateDataset(size))
    );

  if (frame === null) {
    return <Typography>Loading...</Typography>;
  }

  const {
    auxiMem,
    mainMem,
    compareCount,
    readCount,
    writeCount,
  } = frame;

  return (
    <Box
      sx={{
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
      }}
      height="100vh"
    >
      <Stack spacing={1}>
        <Typography fontWeight={900}>
          {`Merge sort`}
        </Typography>
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          spacing={1}
          useFlexGap
        >
          <Typography
            sx={{
              color: blue["A200"],
            }}
          >
            {`Writes: ${writeCount}`}
          </Typography>
          <Typography
            sx={{
              color: deepPurple["A100"],
            }}
          >
            {`Reads: ${readCount}`}
          </Typography>
          <Typography
            sx={{
              color: deepPurple["A100"],
            }}
          >
            {`Compares: ${compareCount}`}
          </Typography>
        </Stack>
        <SorterAnimationToolbar
          onNextFrame={nextFrame}
          onPrevFrame={prevFrame}
          onShuffle={reset}
        />
      </Stack>
      <Grid
        container
        spacing={2}
        columns={1}
        sx={{
          flexGrow: 1,
          flexBasis: 0,
        }}
      >
        <Grid
          size={1}
          sx={{
            flexGrow: 1,
          }}
        >
          <Grid
            container
            columns={mainMem.items.length}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {mainMem.items.map((value, index) => {
              return (
                <MainMemItem
                  key={`sort-item-${index}`}
                  index={index}
                  value={value}
                  frame={mainMem}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid
          size={1}
          sx={{ flexGrow: 1 }}
        >
          <Grid
            container
            columns={mainMem.items.length}
            spacing={0}
            sx={{
              height: "100%",
              alignItems: "flex-end",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {auxiMem.items.map((value, index) => {
              return (
                <AuxiMemItem
                  key={`sort-item-${index}`}
                  index={index}
                  value={value}
                  frame={auxiMem}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export const MergeSortView = memo(MergeSortView_);
