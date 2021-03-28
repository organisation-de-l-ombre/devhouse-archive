import React from "react";
import { render } from "@testing-library/react";
import { RootComponent } from "./index";

// eslint-disable-next-line jest/expect-expect
test("renders tests", () => {
  render(<RootComponent />);
});
