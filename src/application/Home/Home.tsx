import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { FlexContainer, ButtonsGroup, ButtonLink } from "@components/ui";
import globalStyles from "@styles/Global.module.scss";
import { BackToTop } from "@components/modules";
import { useSpring, animated } from "react-spring";
import { Helmet } from "react-helmet";
import { FunctionComponent } from "@typings/FunctionComponent";
import fetchImage from "@lib/fetchImage";
import styles from "./Home.module.scss";

const HeadersContainer = animated(FlexContainer);

const Home: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\home\\home");
  const headersStyles = useSpring({
    from: { transform: "scale(0)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
    config: { duration: 500 },
  });

  return (
    <FlexContainer column>
      <Helmet>
        <title>{t("pageTitle")}</title>
      </Helmet>
      <FlexContainer
        horizontallyCentered
        className={globalStyles["position-relative"]}
      >
        <div
          css={{
            backgroundImage: `url("${fetchImage({
              type: "background",
              image:
                "https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/website-data/pictures/pages/home/home-headers-background.jpg",
            })}")`,
          }}
          className={styles["headers-background"]}
        />
        <HeadersContainer
          padding
          pageBodyWidth
          column
          verticallyCentered
          className={styles.headers}
          style={headersStyles}
        >
          <h1>
            <Trans t={t} i18nKey="headers.title" />
          </h1>
          <h2>
            <Trans t={t} i18nKey="headers.presentation.0" />
          </h2>
          <h2>
            <Trans t={t} i18nKey="headers.presentation.1" />
          </h2>
          <ButtonsGroup genericMarginTop expand>
            <ButtonLink to="/about">
              <MdWork />
              <span>
                <Trans t={t} i18nKey="headers.buttons.about" />
              </span>
            </ButtonLink>
            <ButtonLink to="/contact">
              <RiMessage2Fill />
              <span>
                <Trans t={t} i18nKey="headers.buttons.contact" />
              </span>
            </ButtonLink>
            <ButtonLink to="/support">
              <BsFillQuestionCircleFill />
              <span>
                <Trans t={t} i18nKey="headers.buttons.support" />
              </span>
            </ButtonLink>
          </ButtonsGroup>
        </HeadersContainer>
      </FlexContainer>
      <BackToTop />
      <FlexContainer
        minHeight
        padding
        expand
        pageBodyWidth
        column
        verticallyCentered
        className={styles.body}
      >
        <FlexContainer column>
          <h2 style={{ color: "var(--font-color-hover)" }}>
            <Trans t={t} i18nKey="prototypeAccess.title" />
          </h2>
          <ButtonsGroup genericMarginTop expand>
            <ButtonLink to="/movies/title/tangled_994f87ryf.a4">
              <Trans t={t} i18nKey="prototypeAccess.tangled" />
            </ButtonLink>
            <ButtonLink to="/movies/title/spirit_untamed_yrsctho8x.l">
              <Trans t={t} i18nKey="prototypeAccess.spirit" />
            </ButtonLink>
          </ButtonsGroup>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Home;
