import { FunctionComponent } from "@typings/FunctionComponent";
import React from "react";
import { useTranslation } from "react-i18next";
import loadable from "@loadable/component";

const SuspenseComponent = loadable(
  () => import("@components/modules/Suspense/Suspense")
);
const ErrorComponent = loadable(
  () => import("@components/modules/Error/ErrorComponent")
);
const SectionEmpty = loadable(() => import("../SectionEmpty/SectionEmpty"));

const HandleData: FunctionComponent<
  HTMLDivElement,
  {
    isFetching: boolean;
    section: string | undefined;
    error: TypeError | Response | null;
  }
> = ({ isFetching, section, error }) => {
  const { t } = useTranslation("root");

  if (isFetching) {
    return (
      <SuspenseComponent
        minHeight
        pageBodyWidth
        customText={t("utils.apiFetch")}
      />
    );
  }

  if (!error) {
    return null;
  }

  if (error && error instanceof TypeError) {
    return (
      <ErrorComponent
        errorMessage={t("error.messages.generic", { statusCode: 503 })}
      />
    );
  }

  if (!section) {
    return <SectionEmpty />;
  }

  if (error && error instanceof Response && error.status === 401) {
    return <ErrorComponent errorMessage={t("error.messages.unauthorized")} />;
  }

  return (
    <ErrorComponent
      errorMessage={t("error.messages.generic", { statusCode: error.status })}
    />
  );
};

export default HandleData;
