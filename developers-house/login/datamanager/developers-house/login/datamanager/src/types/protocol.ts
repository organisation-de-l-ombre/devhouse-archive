/*
 * This is all the type definitions for the protocol.
 * This include all the communications with the Cryir service.
 */

type Payload = {
  requestId: string;
  user: string;
  type: "TAKEOUT" | "DELETE";
};

type TakeoutPayload = Payload & {
  type: "TAKEOUT";
};

type DeletePayload = Payload & {
  type: "DELETE";
};

export type { DeletePayload, TakeoutPayload, Payload };
