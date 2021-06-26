import { Request, Response } from "express";
import { createContext } from "react";

export type SSRContextType = {
  req: Request;
  res: Response;
} | null;
export const SSRContext = createContext<SSRContextType>(null);
