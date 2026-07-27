import { Box, Card, CardActionArea, CardHeader, Grid } from "@mui/material";
import { type FC, memo, useCallback } from "react";
import { Link } from "react-router";
import { useMusicalScale } from "@/hooks/useMusicalNotes";
import { getRegisteredSorterView } from "@/routes";

export const HomeView: FC = memo(() => {
  const { playNote } = useMusicalScale();
  const mouseEnterHandler = useCallback(
    (value: number) => () => playNote(value),
    [playNote],
  );
  return (
    <Box component="main" maxWidth="lg" marginX="auto" marginY={4}>
      <Grid
        component="ul"
        container
        spacing={2}
        sx={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {getRegisteredSorterView().map(([path, { display }], index) => {
          const handler = mouseEnterHandler(index);
          return (
            <Grid component="li" size={{ xs: 12, md: 6 }} key={path}>
              <Card variant="outlined" component="article" onClick={handler}>
                <CardActionArea
                  component={Link}
                  to={`/sorters/${path}`}
                  disableRipple
                  sx={{ padding: 2 }}
                >
                  <CardHeader
                    title={display.name}
                    slotProps={{
                      title: {
                        component: "h2",
                        variant: "h6",
                      },
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
});
