import React from "react";
import { useTranslation, Trans } from "react-i18next";
import styles from "./Summary.module.scss";

const Summary: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >
> = ({ className, children }) => {
  const { t } = useTranslation("components\\summary");
  const [summaryOpen, setSummaryOpen] = React.useState<boolean>(true);

  return (
    <div className={`${styles.summary}${className ? ` ${className}` : ""}`}>
      <h2>
        <Trans t={t} i18nKey="title" />
      </h2>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <span onClick={() => setSummaryOpen(!summaryOpen)}>
        {summaryOpen ? (
          <Trans t={t} i18nKey="hide" />
        ) : (
          <Trans t={t} i18nKey="show" />
        )}
      </span>
      <ul
        className={`${styles["summary-items"]}${
          summaryOpen ? "" : ` ${styles.close}`
        }`}
      >
        {children}
      </ul>
    </div>
  );
};
const SubSummary: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > & { to: string; name: string }
> = ({ className, to, name, children }) => {
  return (
    <li
      className={`${styles["sub-summary"]}${className ? ` ${className}` : ""}`}
    >
      <a href={to}>{name}</a>
      <ul>{children}</ul>
    </li>
  );
};
const Item: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > & { to: string; name: string }
> = ({ className, to, name }) => {
  return (
    <li className={className}>
      <a href={to}>{name}</a>
    </li>
  );
};

export { Summary, SubSummary, Item };
