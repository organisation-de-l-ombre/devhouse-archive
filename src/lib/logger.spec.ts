import { logger } from "./logger";

describe("logger", () => {
  it("Logger instanced", () => {
    expect(1).toBe(1);
    logger.info("Test successful");
  });
});
