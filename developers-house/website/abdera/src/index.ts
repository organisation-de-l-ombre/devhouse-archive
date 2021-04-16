import Server from "./server";

new Server(Number.parseInt(process.env.PORT || "5000"));
