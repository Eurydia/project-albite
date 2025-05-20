import { useBubbleSort } from "@/hooks/useBubbleSort";
import { generateDataset } from "@/services/generate-dataset";
import {
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { type FC } from "react";

export const BubbleSortView: FC = () => {
  const { getFrame, nextFrame, prevFrame, shuffleDataset } =
    useBubbleSort(generateDataset(20));

  console.debug(getFrame());
  return (
    <Box>
      <Grid
        container
        spacing={2}
      >
        <Grid size={12}>
          <Typography variant="h3">Bubble sort</Typography>
        </Grid>
        <Grid
          size={12}
          container
          columns={20}
          height={200}
        >
          {getFrame().map((state, index) => {
            return (
              <Grid
                size={1}
                key={`key-${index}`}
                height={(state / 20) * 200}
              >
                <Typography>{state}</Typography>
              </Grid>
            );
          })}
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={prevFrame}
          >
            Previous Frame
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={shuffleDataset}
          >
            Shuffle
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={nextFrame}
          >
            Next Frame
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
