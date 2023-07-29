import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, Box } from "theme-ui";

// import { shortenAddress } from "../utils/shortenAddress";
// import { useLocation } from "react-router-dom";
// import { ConfirmPage } from "../pages/ConfirmPage";
import { useConnectorContext } from "./Connector";

interface MaybeHasMetaMask {
  ethereum?: {
    isMetaMask?: boolean;
  };
}

type ConnectionState =
  | { type: "inactive" }
  | {
      type: "activating" | "active" | "rejectedByUser" | "alreadyPending" | "failed";
    };

type ConnectionAction =
  | { type: "startActivating" }
  | { type: "fail"; error: Error }
  | { type: "finishActivating" | "retry" | "cancel" | "deactivate" };

const connectionReducer: React.Reducer<ConnectionState, ConnectionAction> = (state, action) => {
  switch (action.type) {
    case "startActivating":
      return {
        type: "activating"
      };
    case "finishActivating":
      return {
        type: "active"
      };
    case "fail":
      if (state.type !== "inactive") {
        return {
          type: action.error.message.match(/user rejected/i)
            ? "rejectedByUser"
            : action.error.message.match(/already pending/i)
            ? "alreadyPending"
            : "failed"
        };
      }
      break;
    case "retry":
      if (state.type !== "inactive") {
        return {
          type: "activating"
        };
      }
      break;
    case "cancel":
      return {
        type: "inactive"
      };
    case "deactivate":
      return {
        type: "inactive"
      };
  }

  return state;
};

export const detectMetaMask = () => (window as MaybeHasMetaMask).ethereum?.isMetaMask ?? false;

type WalletConnectorProps = {
  loader?: React.ReactNode;
};

export const WalletConnector: React.FC<WalletConnectorProps> = ({ children, loader }) => {
  const {
    walletAddress,
    connectWallet,
    disconnectWallet,
    isWalletConnected
  } = useConnectorContext();
  const [connectionState, dispatch] = useReducer(connectionReducer, { type: "inactive" });
  // const location = useLocation();

  useEffect(() => {}, [isWalletConnected, walletAddress]);

  useEffect(() => {
    if (isWalletConnected) {
      dispatch({ type: "finishActivating" });
    } else {
      dispatch({ type: "deactivate" });
    }
  }, [isWalletConnected]);

  const onClickConnectWalletButton = useCallback(() => {
    if (isWalletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  }, [isWalletConnected, disconnectWallet, connectWallet]);

  if (connectionState.type === "active") {
    return <>{children}</>;
  }

  return (
    <>
      <Box p={4} color="background" bg="primary">
        FreeZero is currently in beta. Use at your own risk. Connect Wallet To Access Zero Protocol
      </Box>
      <Button
        onClick={onClickConnectWalletButton}
        sx={{
          width: "174px",
          height: "40px",
          p: 0
        }}
        data-action-id="zero-landing-connectWallet"
      >
        Connect Wallet
      </Button>
    </>
  );
};
