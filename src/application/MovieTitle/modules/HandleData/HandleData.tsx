import React from "react";
import { useTranslation } from "react-i18next";
import loadable from "@loadable/component";
import { FunctionComponent } from "@typings/FunctionComponent";
import { MovieTitleSection } from "@store/movieTitle/types";

const SuspenseComponent = loadable(
  () => import("@components/modules/Suspense/Suspense")
);
const ErrorComponent = loadable(
  () => import("@components/modules/Error/ErrorComponent")
);
const SectionEmpty = loadable(() => import("../SectionEmpty/SectionEmpty"));

const HandleData: FunctionComponent<
  HTMLDivElement,
  { dataResponse: MovieTitleSection }
> = ({ dataResponse }) => {
  const { t } = useTranslation("root");

  switch (dataResponse.sectionStatus) {
    case "loading": {
      return (
        <SuspenseComponent
          minHeight
          pageBodyWidth
          customText={t("utils.apiFetch")}
        />
      );
    }

    case "error": {
      switch (dataResponse.error) {
        case "cors": {
          return <ErrorComponent errorMessage={t("error.messages.cors")} />;
        }

        case "internal": {
          return <ErrorComponent errorMessage={t("error.messages.internal")} />;
        }

        case "not-found": {
          return <SectionEmpty />;
        }

        case "unauthorized": {
          return (
            <ErrorComponent errorMessage={t("error.messages.unauthorized")} />
          );
        }

        case "other": {
          return (
            <ErrorComponent
              errorMessage={t("error.messages.generic", {
                status: dataResponse.statusCode,
              })}
            />
          );
        }

        default:
          return null;
      }
    }

    default:
      return null;
  }
};

export default HandleData;
