import { Request, Response } from "express";
import { createContext } from "react";

type ServerContextProps = {
  request: Request;
  response: Response;
  preload: Promise<unknown>[];
  preloadLoaded: boolean;
} | null;

const ServerContext = createContext<ServerContextProps>(null);

export { ServerContextProps, ServerContext };
