import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { Header } from "@components/Header";
import React, { ReactElement } from "react";

export default withGate(function AboutPage(): ReactElement {
  return (
    <Header>
      <h1>About us</h1>

      <p>We are a small team of developers #TODO</p>
    </Header>
  );
}, "feature_about");
