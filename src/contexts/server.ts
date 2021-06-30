import { Request, Response } from "express";
import { createContext } from "react";

type ServerContextProps = {
  request: Request;
  response: Response;
} | null;

const ServerContext = createContext<ServerContextProps>(null);

export { ServerContextProps, ServerContext };
