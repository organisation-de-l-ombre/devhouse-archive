import React from "react";
import globalStyles from "@themes/Global.module.scss";
import { Button, FlexContainer, GenericLoader } from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@hooks/Language";
import { CSSTransition } from "react-transition-group";
import styles from "./Search.module.scss";
import { RequestResult } from "./Types";
import "./Animations.scss";

const Search = (): React.ReactElement => {
  const { t } = useTranslation("pages\\search\\search");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [data, setData] = React.useState<RequestResult[] | undefined>(
    undefined
  );
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const { language } = useLanguage();
  const [firstTime, setFirstTime] = React.useState<boolean>(true);
  const [
    advancedSearchEnabled,
    setAdvancedSearchEnabled,
  ] = React.useState<boolean>(false);
  const manageAdvancedSearch = React.useCallback((): void => {
    setAdvancedSearchEnabled(!advancedSearchEnabled);
  }, [advancedSearchEnabled]);
  const validateRequest = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const { current: inputForm } = inputRef;

      if (!inputForm) {
        return;
      }
      if (
        !inputForm.value.length ||
        inputForm.value.length < 3 ||
        inputForm.value.length > 32
      ) {
        alert(t("headers.form.validation.invalidValue"));

        return;
      }

      setData(undefined);
      setIsFetching(true);
      setFirstTime(false);

      try {
        const baseRequest = await fetch(
          `https://amelia-api.developershouse.xyz/data/search?title=${inputForm.value.replace(
            / /gi,
            "_"
          )}`
        );

        if (baseRequest.status !== 200) {
          setIsFetching(false);
          return;
        }

        const response = await baseRequest.json();

        if (response instanceof Array && response.length) {
          setData(response);
        }

        setIsFetching(false);
      } catch {
        setIsFetching(false);
      }
    },
    [t]
  );

  return (
    <FlexContainer
      className={`${globalStyles.column} ${globalStyles["navbar-margin"]}`}
    >
      <div className={styles.background}>
        <FlexContainer
          className={`${styles.headers} ${globalStyles["page-body-width"]}`}
        >
          <h1>
            <Trans t={t} i18nKey="headers.title" />
          </h1>
          <h3>
            <Trans t={t} i18nKey="headers.description" />
          </h3>
          <form
            className={styles["form-root"]}
            onSubmit={(
              event: React.FormEvent<HTMLFormElement>
            ): Promise<void> => validateRequest(event)}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={t("headers.form.input")}
              minLength={3}
              maxLength={32}
            />
            <Button className={styles["submit-button"]} type="submit">
              <Trans t={t} i18nKey="headers.form.button" />
            </Button>
          </form>
          <div className={styles["search-selector"]}>
            <input
              type="checkbox"
              id="advanced-search"
              name="advanced-search"
              onChange={manageAdvancedSearch}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="advanced-search">
              <Trans t={t} i18nKey="headers.advancedSearch.label" />
            </label>
          </div>
          <CSSTransition
            in={advancedSearchEnabled}
            timeout={300}
            unmountOnExit
            classNames="advanced-search-transitions"
          >
            <FlexContainer className={styles["advanced-search"]}>
              <div className={styles["search-selector"]}>
                <input type="checkbox" id="type-movie" name="type-movie" />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="type-movie">
                  <Trans
                    t={t}
                    i18nKey="headers.advancedSearch.selectors.movie"
                  />
                </label>
              </div>
              <div className={styles["search-selector"]}>
                <input type="checkbox" id="type-series" name="type-series" />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="type-series">
                  <Trans
                    t={t}
                    i18nKey="headers.advancedSearch.selectors.series"
                  />
                </label>
              </div>
            </FlexContainer>
          </CSSTransition>
        </FlexContainer>
      </div>
      {isFetching ? (
        <FlexContainer
          className={`${styles["temp-root"]} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]}`}
        >
          <GenericLoader className={styles.temp}>
            <Trans t={t} i18nKey="body.fetchingData" />
          </GenericLoader>
        </FlexContainer>
      ) : (
        <></>
      )}
      {data && typeof data === "object" && !isFetching ? (
        <FlexContainer
          className={`${styles["page-body"]} ${globalStyles["page-body-width"]}`}
        >
          <h1>
            <Trans
              t={t}
              i18nKey="body.success.title"
              values={{
                search: inputRef.current?.value,
                resultsLength: data.length,
              }}
            />
          </h1>
          <FlexContainer className={styles["container-root"]}>
            {data.map(
              (movie: RequestResult): React.ReactElement => {
                return (
                  <NavLink
                    to={`/movies/title/${movie.id}`}
                    className={styles["movie-container"]}
                  >
                    <div
                      className={`${globalStyles["overflow-hidden"]} ${globalStyles["border-radius"]} ${globalStyles["image-rendering"]}`}
                    >
                      <img
                        src={movie.poster}
                        alt={`Movie poster of ${movie.name}`}
                        draggable={false}
                      />
                    </div>
                    <h4>{movie.name}</h4>
                    <h4>
                      {new Intl.DateTimeFormat(language).format(
                        new Date(movie.releaseDate)
                      )}
                    </h4>
                  </NavLink>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
      ) : (
        <></>
      )}
      {data === undefined && !isFetching ? (
        <FlexContainer
          className={`${styles["temp-root"]} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]}`}
        >
          <div className={styles["not-found"]}>
            <AiOutlineFileSearch />
            <p>
              {firstTime ? (
                <Trans t={t} i18nKey="body.noSearch" />
              ) : (
                <Trans t={t} i18nKey="body.notFound" />
              )}
            </p>
          </div>
        </FlexContainer>
      ) : (
        <></>
      )}
    </FlexContainer>
  );
};

export default Search;
