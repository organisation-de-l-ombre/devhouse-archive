import { WithConditionalCSSProp } from "@emotion/react/types/jsx-namespace";
import { useAppSelector } from "@state/hooks";
import React, { ComponentType, PropsWithChildren } from "react";
import { ReactElement } from "react-markdown";

export function Gate<
  P extends WithConditionalCSSProp<PropsWithChildren<unknown>> = Record<
    string,
    unknown
  >
>({
  props,
  gate,
  children: Children,
}: {
  gate: string;
  children: ComponentType<P>;
  props?: WithConditionalCSSProp<PropsWithChildren<P>>;
}): ReactElement {
  const state = useAppSelector((store) =>
    store.featureFlags.featureFlags.find(({ name }) => name === gate)
  )?.enabled;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return state ? <Children {...(props as never as P)} /> : <></>;
}

export function withGate<P>(
  WrappedComponent: React.ComponentType<P>,
  gate: string
): React.ComponentType<P> {
  return ((props) => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <Gate gate={gate} props={props}>
        {WrappedComponent}
      </Gate>
    );
  }) as React.FC<P>;
}
