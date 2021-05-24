import React from "react";
import { useTranslation, Trans } from "react-i18next";
import classnames from "classnames";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./Summary.module.scss";
import FlexContainer from "../FlexContainer/FlexContainer";

const Summary: FunctionComponent<HTMLDivElement> = ({
  className,
  children,
}) => {
  const { t } = useTranslation("components\\ui\\summary\\summary");
  const [summaryOpen, setSummaryOpen] = React.useState<boolean>(true);

  return (
    <FlexContainer column className={classnames(styles.summary, className)}>
      <FlexContainer verticallyCentered>
        <h2>
          <Trans t={t} i18nKey="title" />
        </h2>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span onClick={() => setSummaryOpen(!summaryOpen)}>
          [
          {summaryOpen ? (
            <Trans t={t} i18nKey="hide" />
          ) : (
            <Trans t={t} i18nKey="show" />
          )}
          ]
        </span>
      </FlexContainer>
      <ul
        className={classnames(styles.items, { [styles.close]: !summaryOpen })}
      >
        {children}
      </ul>
    </FlexContainer>
  );
};

const SubSummary: FunctionComponent<
  HTMLLIElement,
  {
    to: string;
    name: string;
  }
> = ({ className, to, name, children }) => {
  return (
    <li className={classnames(styles["sub-summary"], className)}>
      <a href={to}>{name}</a>
      <ul>{children}</ul>
    </li>
  );
};

const SummaryItem: FunctionComponent<
  HTMLLIElement,
  { to: string; name: string }
> = ({ className, to, name }) => {
  return (
    <li className={className}>
      <a href={to}>{name}</a>
    </li>
  );
};

export { Summary, SubSummary, SummaryItem };
