import React from "react";
import { render, RenderResult } from "@testing-library/react";
import { Button } from ".";
import { randomBytes } from "crypto";

const key = randomBytes(255).toString("hex");

describe("Button behavior", () => {
  let renderResult: RenderResult;

  it("Renders", () => {
    renderResult = render(<Button>{key}</Button>);
  });
});
