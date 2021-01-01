import React, {ReactElement} from "react";
import {FaDiscord} from "react-icons/fa";
import {RiPencilRuler2Line} from "react-icons/ri";

import Button, {ButtonImage} from "components/ui/Button";
import ButtonGroup from "components/ui/ButtonGroup";
import styled, {CSSObject} from "styled-components";
import {Card, CardFlexContainer, CardHeader, CardPadding, CardSection} from "components/ui/Card";
import {TitleBox} from "components/ui/TitleBox";

const HomeHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${(props): CSSObject => require(`assets/${props.theme.name}/header-waves.svg`)});
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const HeaderContentTitle = styled.h2`
  margin-bottom: 1.5rem;
`;

const HomeHeaderContent = styled(TitleBox)`
  margin-top: 4rem;
  margin-bottom: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default function HomePage(): ReactElement {
    return (
        <>
            <HomeHeader>
                <HomeHeaderContent>
                    <HeaderContentTitle>Developer's House</HeaderContentTitle>
                    <HeaderContentTitle as="h2">
                        Some nice projects around the Discord ecosystem.
                    </HeaderContentTitle>
                    <ButtonGroup>
                        <Button>
                            <ButtonImage>
                                <FaDiscord/>
                            </ButtonImage>
                            Discord server
                        </Button>
                        <Button>
                            <ButtonImage>
                                <RiPencilRuler2Line/>
                            </ButtonImage>
                            View projects
                        </Button>
                    </ButtonGroup>

                </HomeHeaderContent>
            </HomeHeader>
            <CardFlexContainer>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>

                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>

                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>

                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>
                        </CardSection>
                    </CardPadding>
                </Card>
            </CardFlexContainer>
        </>
    );
}
