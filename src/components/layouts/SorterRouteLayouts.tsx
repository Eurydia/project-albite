import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Toolbar } from "@mui/material";
import { type FC, memo } from "react";
import { NavLink, Outlet } from "react-router";

export const SorterRouteLayout: FC = memo(() => {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Toolbar component="nav" variant="dense" disableGutters>
        <Button
          variant="text"
          component={NavLink}
          to="/"
          startIcon={<KeyboardArrowLeftRounded />}
          disableElevation
          disableRipple
        >
          Home
        </Button>
      </Toolbar>
      <Outlet />
    </Box>
  );
});
