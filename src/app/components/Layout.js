import * as React from "react";
import { Box, Toolbar } from "@mui/material";

import Header from "./Header";
import Footer from "./Footer";
import StickyFooterWrapper from "./StickyFooterWrapper";
import { AUTHOR_LINK, AUTHOR_NAME } from "../appconfig/info";

const Layout = React.memo(function Layout({ children }) {
  return (
    <Box>
      <Header />
      <StickyFooterWrapper>
        <Toolbar />
        <Box p={3}>{children}</Box>
        <Footer {...{ author: AUTHOR_NAME, link: AUTHOR_LINK }} />
      </StickyFooterWrapper>
    </Box>
  );
});

export default Layout;
