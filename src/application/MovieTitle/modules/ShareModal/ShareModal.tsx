/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, FlexContainer, Modal, Select } from "@components/ui";
import { ServerContext, ServerContextProps } from "@contexts/server";
import { css } from "@emotion/react";
import useLanguage from "@hooks/useLanguage";
import { useNotificationsManager } from "@hooks/useNotifications";
import generateNotificationID from "@lib/generateNotificationID";
import { formatURL } from "@lib/utils";
import { MovieTitleSections, MovieTitleSuccess } from "@store/movieTitle/types";
import { FunctionComponent } from "@typings/FunctionComponent";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { IoMdShareAlt } from "react-icons/io";

interface ShareModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dataResponse: MovieTitleSuccess;
}

type Focus = undefined | "trailer" | "watch";

interface ShareModalState {
  focus: Focus;
  section: keyof MovieTitleSections;
}

interface ItemOptions {
  label: string;
  value: string;
}

const options: ItemOptions[] = [];

const ShareModal: FunctionComponent<HTMLDivElement, ShareModalProps> = ({
  open,
  setOpen,
  dataResponse,
}) => {
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const [shareModalState, setShareModalState] = useState<ShareModalState>({
    focus: undefined,
    section: "movie",
  });
  const changeFocus = useCallback((focus: Focus): void => {
    setShareModalState((previousState: ShareModalState): ShareModalState => {
      return { ...previousState, focus };
    });
  }, []);
  const changeSection = useCallback(
    (section: keyof MovieTitleSections): void => {
      setShareModalState((previousState: ShareModalState): ShareModalState => {
        return { ...previousState, section };
      });
    },
    []
  );
  const serverContext: ServerContextProps = useContext(ServerContext);
  const { language } = useLanguage();
  const url: string = formatURL(
    serverContext,
    `/movies/title/${dataResponse.id}/${
      shareModalState.focus === undefined && shareModalState.section !== "movie"
        ? shareModalState.section
        : ""
    }?language=${language}${
      shareModalState.focus !== undefined
        ? `&focus=${shareModalState.focus}`
        : ""
    }`
  );
  const { addNotifications } = useNotificationsManager();
  const copyToClipboard = useCallback((): void => {
    navigator.clipboard.writeText(url);
    setOpen(false);
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("headers.shareModal.urlCopied"),
        time: 5000,
      },
    ]);
  }, [addNotifications, setOpen, t, url]);

  useEffect((): void => {
    for (const option of Object.keys(dataResponse.data).slice(1)) {
      options.push({ label: t(`tabBar.${option}.acronym`), value: option });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (
      shareModalState.focus !== undefined &&
      shareModalState.section !== "movie"
    ) {
      setShareModalState((previousState: ShareModalState): ShareModalState => {
        return { ...previousState, section: "movie" };
      });
    }
  }, [shareModalState.focus, shareModalState.section]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      windowTitle={t("headers.shareModal.title", {
        title: dataResponse.localizedInformation.title,
      })}
      windowsIcon={<IoMdShareAlt />}
      containerCSS={css`
        p {
          line-height: 1.5;
        }

        > form {
          margin-top: 1rem;
          display: flex;
          align-items: center;

          input {
            width: 16px;
            height: 16px;
          }

          label {
            margin-left: 1rem;
          }

          &:first-of-type {
            margin-top: 2rem;
          }
        }

        > div {
          margin-top: 2rem;

          h1 {
            margin-bottom: 0.5rem;
            font-size: 18px;
          }

          a {
            text-align: start;
            color: var(--link-font-color);

            &:hover {
              text-decoration: underline;
            }
          }
        }
      `}
    >
      <p>
        <Trans
          t={t}
          i18nKey="headers.shareModal.description"
          values={{ title: dataResponse.localizedInformation.title }}
        />
      </p>
      <form>
        <input
          type="checkbox"
          id="share-trailer-focus"
          name="share-trailer-focus"
          checked={shareModalState.focus === "trailer"}
          onChange={(): void =>
            changeFocus(
              shareModalState.focus !== "trailer" ? "trailer" : undefined
            )
          }
        />
        <label htmlFor="share-trailer-focus">
          <Trans t={t} i18nKey="headers.shareModal.focusOnTrailer" />
        </label>
      </form>
      <form>
        <input
          type="checkbox"
          id="share-watch-focus"
          name="share-watch-focus"
          checked={shareModalState.focus === "watch"}
          onChange={(): void =>
            changeFocus(shareModalState.focus !== "watch" ? "watch" : undefined)
          }
        />
        <label htmlFor="share-watch-focus">
          <Trans t={t} i18nKey="headers.shareModal.focusOnWatch" />
        </label>
      </form>
      <FlexContainer column>
        <h1
          css={css`
            ${shareModalState.focus !== undefined &&
            `
              opacity: 0.4;
              user-select: none;
            `}
            transition: opacity 300ms;
          `}
        >
          <Trans t={t} i18nKey="headers.shareModal.selectSection" />
        </h1>
        <Select
          options={options}
          defaultValue={{ label: t(`tabBar.movie.acronym`), value: "movie" }}
          value={{
            label: t(`tabBar.${shareModalState.section}.acronym`),
            value: shareModalState.section,
          }}
          isDisabled={shareModalState.focus !== undefined}
          onChange={(target): void =>
            changeSection(target?.value as keyof MovieTitleSections)
          }
        />
      </FlexContainer>
      <FlexContainer column>
        <h1>
          <Trans t={t} i18nKey="headers.shareModal.preview" />
        </h1>
        <a href={url} target="blank">
          {url}
        </a>
      </FlexContainer>
      <Button
        css={{
          marginTop: "2rem",
          alignSelf: "center",
          backgroundColor: "var(--primary-background-color-hover)",
        }}
        onClick={copyToClipboard}
      >
        <Trans t={t} i18nKey="headers.shareModal.copyToClipboard" />
      </Button>
    </Modal>
  );
};

export default ShareModal;
