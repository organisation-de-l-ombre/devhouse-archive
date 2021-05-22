import {
  AllHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
} from "react";

type FunctionComponent<Element, Props = unknown> = FC<
  DetailedHTMLProps<AllHTMLAttributes<Element>, Element> & Props
>;

type ButtonComponent<Props = unknown> = FC<
  ButtonHTMLAttributes<HTMLButtonElement> & Props
>;

export { FunctionComponent, ButtonComponent };
