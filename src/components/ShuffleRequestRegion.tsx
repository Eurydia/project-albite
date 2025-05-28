import { PanToolAltRounded } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { memo, type FC } from "react";

type Props = {
  onClick: () => void;
};
export const ShuffleRequestRegion: FC<Props> = memo(
  ({ onClick }) => {
    return (
      <Box
        onClick={onClick}
        sx={{
          flexBasis: 0,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <PanToolAltRounded />
        <Typography>Shuffle once to start</Typography>
      </Box>
    );
  }
);
