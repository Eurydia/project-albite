import { Grid, darken } from "@mui/material";
import { memo, type FC, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  backgroundColor: string;
  height: number;
  onMouseEnter: () => void;
};
export const VisualizerItem: FC<Props> = memo(
  ({ backgroundColor, height, children, onMouseEnter }) => {
    return (
      <Grid
        component="div"
        tabIndex={0}
        onMouseEnter={onMouseEnter}
        size={1}
        sx={{
          backgroundColor,
          "height": `${height}%`,
          "transition": "all 0.05s ease-in-out",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "center",
          "flexDirection": "column",
          "overflow": "clip",
          "&:hover": {
            backgroundColor: darken(backgroundColor, 0.5),
          },
        }}
      >
        {children}
      </Grid>
    );
  }
);
