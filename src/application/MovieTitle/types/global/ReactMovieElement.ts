import { AllHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { S3DataResponse } from "./S3DataResponse";

export type ReactMovieElement = FC<
  DetailedHTMLProps<AllHTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    dataResponse: S3DataResponse;
  }
>;
