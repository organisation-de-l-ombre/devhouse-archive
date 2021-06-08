import React, {
  ComponentType,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReactElement } from "react-markdown";

const availableFeatureGates = [
  "feature_login",
  "feature_about",
  "feature_contact",
  "feature_projects",
  "feature_members",
  "feature_join",
] as const;

type GateName = typeof availableFeatureGates[number];
type FeatureGateState = GateName[];

const FeatureGateContext = React.createContext<FeatureGateState>([]);
const loaded = JSON.parse(localStorage.getItem("fg") || "[]");

export const FeatureGateProvider: FC = ({ children }) => {
  const [featureGates, setFeatureGates] = useState<FeatureGateState>(loaded);

  useEffect(() => {
    fetch(
      `https://abdera-api.developershouse.xyz/data/featureflags?flags=${encodeURIComponent(
        availableFeatureGates.join(",")
      )}`
    )
      .then((r) => r.json())
      .then(setFeatureGates)
      .catch(() => setFeatureGates([]));
  }, []);

  useEffect(() => {
    localStorage.setItem("fg", JSON.stringify(featureGates));
  }, [featureGates]);

  return (
    <FeatureGateContext.Provider value={featureGates}>
      {children}
    </FeatureGateContext.Provider>
  );
};

export function Gate<P = undefined>({
  props,
  gate,
  children: Children,
}: {
  gate: GateName;
  children: ComponentType<P>;
  props?: P;
}): ReactElement {
  const context = useContext(FeatureGateContext);
  return context.includes(gate) ? <Children {...(props as P)} /> : <></>;
}

export function withGate<P>(
  WrappedComponent: React.ComponentType<P>,
  gate: GateName
): React.ComponentType<P> {
  return ((props) => {
    return (
      <Gate gate={gate} props={props}>
        {WrappedComponent}
      </Gate>
    );
  }) as React.FC<P>;
}
