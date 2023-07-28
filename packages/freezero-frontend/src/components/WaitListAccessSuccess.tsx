import React from "react";
import { Box, Button, Image, Paragraph } from "theme-ui";

interface Props {
  refresh: () => void;
}
export const WaitListAccessSuccess: React.FC<Props> = ({ refresh }) => (
  <>
    <Image src={process.env.PUBLIC_URL + "/success-mark.png"} />
    <Box
      sx={{
        textAlign: "center",
        maxWidth: 535,
        mb: 30,
        wordBreak: "keep-all"
      }}
    >
      <Paragraph sx={{ mb: 20, mt: 0, fontSize: 6 }}>Success!</Paragraph>
      <Paragraph sx={{ fontSize: 3, px: 2, fontWeight: "light" }}>
        Your address has been added to the Zero early access list.
      </Paragraph>
      <br />
      <Box
        sx={{
          maxWidth: 340,
          margin: "auto"
        }}
      >
        <Paragraph sx={{ fontSize: 3, fontWeight: "light" }}>
          Click below to go to the landing page, then connect your wallet to access Zero:
        </Paragraph>
      </Box>
    </Box>

    <Button
      sx={{
        fontSize: 3,
        my: 16,
        display: "flex",
        alignItems: "center",
        mx: "auto",
        height: 32,
        fontWeight: 600
      }}
      variant="secondary"
      onClick={refresh}
    >
      Go to landing page
    </Button>
  </>
);
