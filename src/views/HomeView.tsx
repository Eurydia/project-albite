import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { getRegisteredSorterView } from "@/routes";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
} from "@mui/material";
import { memo, useCallback, type FC } from "react";
import { Link } from "react-router";

export const HomeView: FC = memo(() => {
  const { playNote } = useMusicalScale();
  const mouseEnterHandler = useCallback(
    (value: number) => () => playNote(value),
    [playNote]
  );
  return (
    <Box
      maxWidth="lg"
      marginX="auto"
      marginY={4}
    >
      <Grid
        container
        spacing={2}
      >
        {getRegisteredSorterView().map(
          ([path, { display }], index) => {
            const handler = mouseEnterHandler(index);
            return (
              <Grid
                size={{ xs: 12, md: 6 }}
                key={path}
              >
                <Card
                  variant="outlined"
                  component="div"
                  onClick={handler}
                >
                  <CardActionArea
                    component={Link}
                    to={`/sorters/${path}`}
                    disableRipple
                    sx={{ padding: 2 }}
                  >
                    <CardHeader title={display.name} />
                  </CardActionArea>
                </Card>
              </Grid>
            );
          }
        )}
      </Grid>
    </Box>
  );
});
