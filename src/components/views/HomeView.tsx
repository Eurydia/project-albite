import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
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
    <Box component="main" sx={{ marginX: "auto", marginY: 4, maxWidth: "lg" }}>
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
