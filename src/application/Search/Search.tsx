import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  FormEvent,
  ReactElement,
} from "react";
import globalStyles from "@styles/Global.module.scss";
import { Button, FlexContainer } from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineFileSearch } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import useLanguage from "@hooks/useLanguage";
import { CSSTransition } from "react-transition-group";
import { SearchAPI } from "@lib/api";
import { InlineResponse200, SearchResponse } from "@developers-house/amelia";
import { Helmet } from "react-helmet";
import useQueryState from "@hooks/useQueryState";
import { FunctionComponent } from "@typings/FunctionComponent";
import { SuspenseComponent } from "@components/modules";
import classnames from "classnames";
import styles from "./Search.module.scss";
import "./Animations.scss";

const Search: FunctionComponent<HTMLDivElement> = () => {
  const [titleState, setTitleState] = useQueryState<string>("title");
  const { t } = useTranslation("pages\\search\\search");
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<SearchResponse[] | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { language } = useLanguage();
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const [
    advancedSearchEnabled,
    setAdvancedSearchEnabled,
  ] = useQueryState<boolean>("advanced-search", false);
  const manageSearch = useCallback((): void => {
    setTitleState(inputRef.current?.value);
  }, [setTitleState]);
  const manageAdvancedSearch = useCallback((): void => {
    setAdvancedSearchEnabled(!advancedSearchEnabled);
  }, [advancedSearchEnabled, setAdvancedSearchEnabled]);
  const validateRequest = useCallback(
    (event?: FormEvent<HTMLFormElement>): void => {
      if (event) {
        event.preventDefault();
      }

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

      SearchAPI.getSearchResults({
        title: inputForm.value,
      })
        .then((response: InlineResponse200): void => {
          if (response.data.length) {
            setData(response.data);
          }

          setIsFetching(false);
        })
        .catch((): void => {
          setIsFetching(false);
        });

      const container = document.querySelector("#search-page-navigation");

      if (container) {
        container.scrollIntoView();
      }
    },
    [t]
  );

  useEffect((): void => {
    if (titleState?.length) {
      validateRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexContainer column>
      <Helmet>
        <title>{t("pageTitle")}</title>
      </Helmet>
      <FlexContainer
        horizontallyCentered
        css={{ backgroundColor: "var(--primary-background-color)" }}
      >
        <FlexContainer padding column pageBodyWidth className={styles.headers}>
          <h1>
            <Trans t={t} i18nKey="headers.title" />
          </h1>
          <h2>
            <Trans t={t} i18nKey="headers.description" />
          </h2>
          <form className={styles.search} onSubmit={validateRequest}>
            <input
              ref={inputRef}
              type="text"
              placeholder={t("headers.form.input")}
              minLength={3}
              maxLength={32}
              defaultValue={titleState}
              onChange={manageSearch}
            />
            <Button type="submit">
              <Trans t={t} i18nKey="headers.form.button" />
            </Button>
          </form>
          <form className={styles["search-selector"]}>
            <input
              type="checkbox"
              id="advanced-search"
              name="advanced-search"
              checked={advancedSearchEnabled}
              onChange={manageAdvancedSearch}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="advanced-search">
              <Trans t={t} i18nKey="headers.advancedSearch.label" />
            </label>
          </form>
          <CSSTransition
            in={advancedSearchEnabled}
            timeout={300}
            unmountOnExit
            classNames="advanced-search-transitions"
          >
            <FlexContainer genericMarginTop spaceBetween>
              <form className={styles["search-selector"]}>
                <input type="checkbox" id="type-movie" name="type-movie" />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="type-movie">
                  <Trans
                    t={t}
                    i18nKey="headers.advancedSearch.selectors.movie"
                  />
                </label>
              </form>
              <form className={styles["search-selector"]}>
                <input type="checkbox" id="type-series" name="type-series" />
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="type-series">
                  <Trans
                    t={t}
                    i18nKey="headers.advancedSearch.selectors.series"
                  />
                </label>
              </form>
            </FlexContainer>
          </CSSTransition>
        </FlexContainer>
      </FlexContainer>
      {!data && isFetching && (
        <SuspenseComponent
          minHeight
          pageBodyWidth
          customText={t("body.fetchingData")}
        />
      )}
      {!data && !isFetching && (
        <FlexContainer
          minHeight
          padding
          pageBodyWidth
          fullCentered
          id="search-page-navigation"
        >
          <FlexContainer column horizontallyCentered>
            <AiOutlineFileSearch
              css={{
                width: "64px",
                height: "64px",
              }}
            />
            <p css={{ marginTop: "1rem" }}>
              {firstTime ? (
                <Trans t={t} i18nKey="body.noSearch" />
              ) : (
                <Trans t={t} i18nKey="body.notFound" />
              )}
            </p>
          </FlexContainer>
        </FlexContainer>
      )}
      {data && (
        <FlexContainer
          minHeight
          padding
          column
          pageBodyWidth
          className={styles.results}
          id="search-page-navigation"
        >
          <h1>
            <Trans t={t} i18nKey="body.success.title" />
          </h1>
          <p>
            <Trans
              t={t}
              i18nKey="body.success.description"
              values={{
                resultsLength: data.length,
              }}
            />
          </p>
          <FlexContainer genericMarginTop allowWrap>
            {data.map(
              (movie: SearchResponse): ReactElement => {
                return (
                  <NavLink
                    key={movie.id}
                    to={`/movies/title/${movie.id}`}
                    className={styles.media}
                    title={`${movie.name} (${new Date(
                      movie.releaseDate
                    ).getFullYear()})`}
                  >
                    <div
                      className={classnames(
                        globalStyles["overflow-hidden"],
                        globalStyles["border-radius"],
                        globalStyles["box-shadow"]
                      )}
                    >
                      <img
                        src={movie.poster}
                        alt={`Movie poster of ${movie.name}`}
                        draggable={false}
                      />
                    </div>
                    <h1>{movie.name}</h1>
                    <h1>
                      {new Intl.DateTimeFormat(language).format(
                        new Date(movie.releaseDate)
                      )}
                    </h1>
                  </NavLink>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default Search;
