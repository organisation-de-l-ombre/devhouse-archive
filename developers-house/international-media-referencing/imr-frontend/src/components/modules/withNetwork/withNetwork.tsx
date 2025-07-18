import { Card, FlexContainer } from "@components/ui";
import { css } from "@emotion/react";
import React, { ComponentType, useCallback, useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { RiWifiOffLine } from "react-icons/ri";
import { ReactElement } from "react-markdown";

function withNetwork<Props>(Component: ComponentType<Props>) {
  return (props: Props): ReactElement => {
    const { t } = useTranslation("root");
    const [online, setOnline] = useState<boolean>(
      typeof window !== "undefined" ? window.navigator.onLine : true
    );
    const setOnlineStatus = useCallback((): void => {
      setOnline(true);
    }, []);
    const setOfflineStatus = useCallback((): void => {
      setOnline(false);
    }, []);

    useEffect((): (() => void) => {
      window.addEventListener("online", setOnlineStatus);
      window.addEventListener("offline", setOfflineStatus);

      return (): void => {
        window.removeEventListener("online", setOnlineStatus);
        window.removeEventListener("offline", setOfflineStatus);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!online) {
      return (
        <FlexContainer minHeight padding expand fullCentered>
          <Card
            maxWidth
            transparent
            css={css`
              align-items: center;

              svg {
                width: 64px;
                height: 64px;
                animation: 2s svg-color infinite;
              }

              p {
                margin-top: 1rem;
                text-align: center;
              }

              @keyframes svg-color {
                50% {
                  fill: var(--font-color-hover);
                }

                100% {
                  fill: var(--font-color);
                }
              }
            `}
          >
            <RiWifiOffLine />
            <p>
              <Trans t={t} i18nKey="withNetwork.noNetwork" />
            </p>
          </Card>
        </FlexContainer>
      );
    }

    return <Component {...props} />;
  };
}

export default withNetwork;
