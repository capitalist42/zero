import React from "react";
import { Flex, Container } from "theme-ui";
import { Route } from "react-router-dom";
import { Wallet } from "@ethersproject/wallet";

import { Decimal, Difference, Trove } from "@sovryn-zero/lib-base";
import { LiquityStoreProvider } from "@sovryn-zero/lib-react";

import { useLiquity } from "./hooks/LiquityContext";
import { TransactionMonitor } from "./components/Transaction";
import { Header } from "./components/Header";

import { RiskyTrovesPage } from "./pages/RiskyTrovesPage";

import { TroveViewProvider } from "./components/Trove/context/TroveViewProvider";
import { StabilityViewProvider } from "./components/Stability/context/StabilityViewProvider";
import { Nav } from "./components/Nav";
import { Dashboard } from "./pages/Dashboard";
import { RedemptionPage } from "./pages/RedemptionPage";

type LiquityFrontendProps = {
  loader?: React.ReactNode;
};
export const LiquityFrontend: React.FC<LiquityFrontendProps> = ({ loader }) => {
  const { account, provider, liquity } = useLiquity();

  // For console tinkering ;-)
  Object.assign(window, {
    account,
    provider,
    liquity,
    Trove,
    Decimal,
    Difference,
    Wallet
  });

  return (
    <LiquityStoreProvider {...{ loader }} store={liquity.store}>
      <TroveViewProvider>
        <StabilityViewProvider>
          <Flex sx={{ flexDirection: "column", minHeight: "100%" }}>
            <Header />
            <Nav />
            <Container
              variant="main"
              sx={{
                display: "flex",
                flexGrow: 1,
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <Route path="/" exact>
                <Dashboard />
              </Route>
              <Route path="/liquidation">
                <RiskyTrovesPage />
              </Route>
              <Route path="/redemption">
                  <RedemptionPage />
                </Route>
            </Container>
          </Flex>
        </StabilityViewProvider>
      </TroveViewProvider>
      <TransactionMonitor />
    </LiquityStoreProvider>
  );
};
