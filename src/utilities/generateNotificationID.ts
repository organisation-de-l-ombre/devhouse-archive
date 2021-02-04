import { randomBytes } from "crypto";

const generateNotificationID = (): string => randomBytes(22).toString("hex");

export default generateNotificationID;
