import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { Header } from "@components/Header";
import { Metadata } from "@components/Meta/Metadata";
import React, { ReactElement } from "react";

export default withGate(function AboutPage(): ReactElement {
  return (
    <Header>
      <Metadata
        title="Developer's House | About"
        description="Developer's House is a team of young developers, you can find out more about the team on the about page"
      />
      <h1>About us</h1>

      <p>We are a small team of developers #TODO</p>
    </Header>
  );
}, "feature_about");
