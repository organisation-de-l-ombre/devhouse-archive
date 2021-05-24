import React from "react";
import { render, RenderResult } from "@testing-library/react";
import { randomBytes } from "crypto";
import { Button } from ".";

const key = randomBytes(255).toString("hex");

describe("Button behavior", () => {
  let renderResult: RenderResult;

  it("Renders", () => {
    renderResult = render(<Button>{key}</Button>);
  });
});
