import {
  AllHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  FunctionComponent as ReactFunctionComponent,
  SVGProps,
} from "react";

type FunctionComponent<Element, Props = unknown> = FC<
  DetailedHTMLProps<AllHTMLAttributes<Element>, Element> & Props
>;

type ButtonComponent<Props = unknown> = FC<
  ButtonHTMLAttributes<HTMLButtonElement> & Props
>;

type SVGComponent<Props = unknown> = ReactFunctionComponent<
  SVGProps<SVGSVGElement> & Props
>;

export { FunctionComponent, ButtonComponent, SVGComponent };
