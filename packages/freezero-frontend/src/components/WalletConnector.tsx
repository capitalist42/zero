import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Button, Text } from "theme-ui";

import { shortenAddress } from "../utils/shortenAddress";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
  
  }, [isWalletConnected, walletAddress]);

  useEffect(() => {
    if (isWalletConnected) {
      dispatch({ type: "finishActivating" });
    } else {
      dispatch({ type: "deactivate" });
    }
  }, [isWalletConnected]);

  const onClick = useCallback(() => {
    if (isWalletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  }, [isWalletConnected, disconnectWallet, connectWallet]);

  // if (loading) {
  //   return <>{loader}</>;
  // }


  if (connectionState.type === "active") {
    return <>{children}</>;
  }

  return (
    <>
      <Button
        onClick={onClick}
        sx={{
          width: "174px",
          height: "40px",
          p: 0
        }}
        data-action-id="zero-landing-connectWallet"
      >
        {!walletAddress ? (
          "Connect Wallet"
        ) : (
          <Text as="span" sx={{ fontSize: 2, fontWeight: 600 }}>
            {shortenAddress(walletAddress!, 4)}
          </Text>
        )}
      </Button>

      <Text
        as="p"
        sx={{
          fontSize: 2,
          fontWeight: 600,
          color: "danger",
          mt: 12,
          visibility: "visible"
          // visibility: !loading ? "visible" : "hidden"
        }}
      >
        {/* {!walletAddress && hasClicked && (
          <>
            Install or unlock an{" "}
            <Link
              sx={{
                fontSize: 2,
                fontWeight: 600,
                textDecoration: "underline",
                color: "danger"
              }}
              target="_blank"
              href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
            >
              RSK-compatible Web3 wallet.
            </Link>
          </>
        )} */}
      </Text>
    </>
  );
};
