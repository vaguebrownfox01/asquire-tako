import * as React from "react";
import { Box, Link } from "@mui/material";

const Footer = React.memo(function Footer({ author, link }) {
  return (
    <footer>
      <Box
        color="text.hint"
        fontSize="caption.fontSize"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={1}
        mt={3}
      >
        Made with&nbsp;
        <Box color="error.main">&hearts;&nbsp;</Box>
        by&nbsp;
        <Link
          href={`${link}`}
          color="inherit"
          target="_blank"
          rel="noopener noreferrer"
        >
          @{author}
        </Link>
      </Box>
    </footer>
  );
});

export default Footer;
