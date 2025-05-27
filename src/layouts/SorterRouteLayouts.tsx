import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button, Toolbar } from "@mui/material";
import { Fragment, memo, type FC } from "react";
import { NavLink, Outlet } from "react-router";

export const SorterRouteLayout: FC = memo(() => {
  return (
    <Fragment>
      <Toolbar
        variant="dense"
        disableGutters
        sx={{ backgroundColor: "black" }}
      >
        <Button
          variant="text"
          component={NavLink}
          to="/"
          startIcon={<KeyboardArrowLeftRounded />}
        >
          Home
        </Button>
      </Toolbar>
      <Outlet />
    </Fragment>
  );
});
