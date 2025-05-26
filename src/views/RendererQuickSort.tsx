import type { QuicksortFrameState } from "@/types/sorters/quick-sort";
import type { FC } from "react";

type SortItemProps = {
  value: number;
  index: number;
  frame: QuicksortFrameState;
};
const SortItemProps: FC<SortItemProps> = ({
  frame,
  index,
  value,
}) => {
  const height = (value / Math.max) * 100;

  let bgColor: string = `hsl(0, 0%, ${
    (value / maxValue) * 90
  }%)`;

  if (terminalElement) {
    bgColor = pink["A100"];
  }

  if (compared) {
    bgColor = blue["A100"];
  }

  if (swapped) {
    bgColor = deepOrange["A100"];
  }

  let label: string = "";
  if (keyElement) {
    label = "😁";
  }
  if (partitionKeyElement) {
    label = "👍";
  }

  return (
    <Grid
      item
      xs={1}
      bgcolor={bgColor}
      height={`${height}%`}
      className="renderer-element"
    >
      {label}
    </Grid>
  );
};

type RendererQuickSortProps = {
  dataset: number[];
  heightPx: number;
};
export const RendererQuickSort: FC<
  RendererQuickSortProps
> = (props) => {
  const { dataset, heightPx } = props;

  const size: number = dataset.length;
  const maxValue: number = Math.max(...dataset);

  const [frame, setFrame] = useState<number>(0);
  const [frameStates] = useState<FrameState[]>(() => {
    const frameStates: FrameState[] = [];
    quickSort([...dataset], size, frameStates);
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

  const currFrame: FrameState = frameStates[frame];

  return (
    <Box>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography variant="h3">Quicksort</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <Typography variant="body1">
            {`Frame ${frame + 1}/${frameStates.length}`}
          </Typography>
          <Typography variant="body1">
            {`Comparison: ${currFrame.comparisonCount}`}
          </Typography>
          <Typography variant="body1">
            {`Swap: ${currFrame.swapCount}`}
          </Typography>
          <Typography variant="body1">
            {currFrame.frameDescription}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <IconLabel
            label="Terminal element of working region"
            icon={
              <SquareRounded htmlColor={pink["A100"]} />
            }
          />
          <IconLabel
            label="Compared"
            icon={
              <SquareRounded htmlColor={blue["A100"]} />
            }
          />
          <IconLabel
            label="Swapped places"
            icon={
              <SquareRounded
                htmlColor={deepOrange["A100"]}
              />
            }
          />
          <IconLabel
            label="Key element"
            icon="😁"
          />
          <IconLabel
            label="Partition key element"
            icon="👍"
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Grid
            container
            columns={size}
            className="renderer-container"
            height={`${heightPx}px`}
          >
            {currFrame.elementStates.map((value, index) => {
              return (
                <RendererElement
                  key={`key-${index}`}
                  maxValue={maxValue}
                  value={value}
                  compared={currFrame.compared.includes(
                    index
                  )}
                  swapped={currFrame.swapped.includes(
                    index
                  )}
                  terminalElement={currFrame.terminalElements.includes(
                    index
                  )}
                  keyElement={
                    index === currFrame.keyElement
                  }
                  partitionKeyElement={
                    index === currFrame.partitionKeyElement
                  }
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onFrameRewind}
            disabled={frame === 0}
          >
            Previous Frame
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onFrameAdvance}
            disabled={frame === frameStates.length - 1}
          >
            Next Frame
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
