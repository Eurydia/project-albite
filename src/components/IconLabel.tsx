import { Typography } from "@mui/material";
import { type FC, type ReactNode } from "react";

type ColorLabelProps = {
  icon: ReactNode;
  label: ReactNode;
};
export const IconLabel: FC<ColorLabelProps> = (props) => {
  const { icon, label } = props;

  return (
    <Typography
      width="100%"
      display="flex"
      alignItems=""
      justifyContent="flex-start"
    >
      {icon} : {label}
    </Typography>
  );
};
