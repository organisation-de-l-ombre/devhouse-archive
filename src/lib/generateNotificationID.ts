import { v4 as uuid } from "uuid";

const generateNotificationID = (): string => uuid();

export default generateNotificationID;
