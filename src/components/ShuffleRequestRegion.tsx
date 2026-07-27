import PanToolAltRounded from "@mui/icons-material/PanToolAltRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type FC, memo } from "react";

type Props = {
  onClick: () => void;
};
export const ShuffleRequestRegion: FC<Props> = memo(({ onClick }) => {
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
});
