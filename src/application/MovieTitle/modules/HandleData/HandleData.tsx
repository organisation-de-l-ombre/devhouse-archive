import { ErrorComponent, SuspenseComponent } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import React from "react";
import { useTranslation } from "react-i18next";
import SectionEmpty from "../SectionEmpty/SectionEmpty";

const HandleData: FunctionComponent<
  HTMLDivElement,
  {
    isFetching: boolean;
    section: string | undefined;
    error: Response | null;
  }
> = ({ isFetching, section, error }) => {
  const { t } = useTranslation("pages\\movieTitle\\root");

  if (isFetching) {
    return <SuspenseComponent minHeight customText={t("fetchingData")} />;
  }

  if (!error) {
    return null;
  }

  if (error && !section) {
    return <SectionEmpty />;
  }

  if (error && error.status === 401) {
    return <ErrorComponent errorMessage={t("error.unauthorized")} />;
  }

  return (
    <ErrorComponent
      errorMessage={t("error.generic", { statusCode: error.status })}
    />
  );
};

export default HandleData;
