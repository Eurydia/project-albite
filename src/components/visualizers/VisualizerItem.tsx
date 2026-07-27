import { darken, Grid } from "@mui/material";
import { type FC, memo, type PropsWithChildren } from "react";

export const VisualizerItem: FC<
  PropsWithChildren<{
    backgroundColor: string;
    height: number;
    onMouseEnter: () => void;
  }>
> = memo(({ backgroundColor, height, children, onMouseEnter }) => {
  return (
    <Grid
      component="div"
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      size={1}
      sx={{
        backgroundColor,
        height: `${height}%`,
        transition: (t) =>
          t.transitions.create("all", { easing: "ease-in-out" }),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "clip",
        ":hover": {
          backgroundColor: darken(backgroundColor, 0.5),
        },
      }}
    >
      {children}
    </Grid>
  );
});
