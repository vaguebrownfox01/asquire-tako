import { GitHub as GitHubIcon } from "@mui/icons-material";
import { AppBar, Box, Toolbar } from "@mui/material";
import * as React from "react";
import theme from "../appconfig/theme";
import { PROJECT_NAME } from "../appconfig/info";

const classes = {
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: "100%",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
};

const Header = React.memo(function Header() {
  return (
    <AppBar sx={classes.appBar} position="fixed" color="primary">
      <Toolbar>
        <Box fontSize="h6.fontSize" flexGrow={1}>
          {PROJECT_NAME}
        </Box>
        <Box>
          <GitHubIcon />
        </Box>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
