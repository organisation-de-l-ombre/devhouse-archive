import React, { ReactElement } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiPencilRuler2Line } from "react-icons/ri";

import Button, { ButtonImage } from "components/ui/Button";
import ButtonGroup from "components/ui/ButtonGroup";
import { NavLink } from "react-router-dom";
import styled, { CSSObject, keyframes } from "styled-components";
import { Card, CardFlexContainer, CardHeader, CardPadding, CardSection } from "components/ui/Card";
import { TitleBox } from "components/ui/TitleBox";
import { useDispatch } from "react-redux";
import { pushNotification } from "state/modules/notifications";

const HeaderAnimation = keyframes`
    from {
        transform: translateX(-300%);
    }
    to {
        transform: none;
    }
`;

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
  animation: ${HeaderAnimation} 1s;
  text-align: center;
`;

export default function HomePage(): ReactElement {
    const dispatch = useDispatch();
    return (
        <>
            <HomeHeader>
                <HomeHeaderContent>
                    <HeaderContentTitle>Developer's House</HeaderContentTitle>
                    <HeaderContentTitle as="h2">
                        Some nice projects around the Discord ecosystem.
                    </HeaderContentTitle>
                    <ButtonGroup>
                        <Button
                            as="a"
                            target="_blank"
                            href={''}
                            rel="noopener noreferrer"
                        >
                            <ButtonImage>
                                <FaDiscord />
                            </ButtonImage>
                            Discord server
                        </Button>
                        <Button as={NavLink} to="/projects">
                            <ButtonImage>
                                <RiPencilRuler2Line />
                            </ButtonImage>
                            View projects
                        </Button>
                        <Button onClick={() => dispatch(pushNotification({
                            text: 'Notification de test',
                            time: 5000,
                            level: 'warning'
                        }))}>
                            Test!
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
                            Lorem ipsum dolor sit amet, congue amet mi tempus ut, praesent
                            ante duis pulvinar, nibh erat aliquam faucibus, neque enim, nunc
                            nulla accumsan. Augue curae nascetur sed proin ut, sed neque eu
                            potenti et justo. Pellentesque risus, malesuada nunc, exercitation
                            et. Donec nibh vestibulum justo eu aliquet mi, non libero velit,
                            volutpat aenean vulputate in, condimentum convallis scelerisque
                            vitae. Magna non, ac tortor integer vulputate risus, hendrerit
                            vivamus, in eget justo. Donec scelerisque amet, nec at. Pede risus
                            nec elementum, sed lectus dignissim eu. Est fringilla, dui cras
                            volutpat turpis felis, eros pulvinar suspendisse eget, tortor
                            nulla mollis. Nec vel dolor commodo amet, amet vulputate, conubia
                            id integer lorem id, lobortis mauris ligula metus.
                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>
                            Lorem ipsum dolor sit amet, congue amet mi tempus ut, praesent
                            ante duis pulvinar, nibh erat aliquam faucibus, neque enim, nunc
                            nulla accumsan. Augue curae nascetur sed proin ut, sed neque eu
                            potenti et justo. Pellentesque risus, malesuada nunc, exercitation
                            et. Donec nibh vestibulum justo eu aliquet mi, non libero velit,
                            volutpat aenean vulputate in, condimentum convallis scelerisque
                            vitae. Magna non, ac tortor integer vulputate risus, hendrerit
                            vivamus, in eget justo. Donec scelerisque amet, nec at. Pede risus
                            nec elementum, sed lectus dignissim eu. Est fringilla, dui cras
                            volutpat turpis felis, eros pulvinar suspendisse eget, tortor
                            nulla mollis. Nec vel dolor commodo amet, amet vulputate, conubia
                            id integer lorem id, lobortis mauris ligula metus.
                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>
                            Lorem ipsum dolor sit amet, congue amet mi tempus ut, praesent
                            ante duis pulvinar, nibh erat aliquam faucibus, neque enim, nunc
                            nulla accumsan. Augue curae nascetur sed proin ut, sed neque eu
                            potenti et justo. Pellentesque risus, malesuada nunc, exercitation
                            et. Donec nibh vestibulum justo eu aliquet mi, non libero velit,
                            volutpat aenean vulputate in, condimentum convallis scelerisque
                            vitae. Magna non, ac tortor integer vulputate risus, hendrerit
                            vivamus, in eget justo. Donec scelerisque amet, nec at. Pede risus
                            nec elementum, sed lectus dignissim eu. Est fringilla, dui cras
                            volutpat turpis felis, eros pulvinar suspendisse eget, tortor
                            nulla mollis. Nec vel dolor commodo amet, amet vulputate, conubia
                            id integer lorem id, lobortis mauris ligula metus.
                        </CardSection>
                    </CardPadding>
                </Card>
                <Card>
                    <CardPadding>
                        <CardHeader>
                            <h2>Secure systems</h2>
                        </CardHeader>

                        <CardSection>
                            Lorem ipsum dolor sit amet, congue amet mi tempus ut, praesent
                            ante duis pulvinar, nibh erat aliquam faucibus, neque enim, nunc
                            nulla accumsan. Augue curae nascetur sed proin ut, sed neque eu
                            potenti et justo. Pellentesque risus, malesuada nunc, exercitation
                            et. Donec nibh vestibulum justo eu aliquet mi, non libero velit,
                            volutpat aenean vulputate in, condimentum convallis scelerisque
                            vitae. Magna non, ac tortor integer vulputate risus, hendrerit
                            vivamus, in eget justo. Donec scelerisque amet, nec at. Pede risus
                            nec elementum, sed lectus dignissim eu. Est fringilla, dui cras
                            volutpat turpis felis, eros pulvinar suspendisse eget, tortor
                            nulla mollis. Nec vel dolor commodo amet, amet vulputate, conubia
                            id integer lorem id, lobortis mauris ligula metus.
                        </CardSection>
                    </CardPadding>
                </Card>
            </CardFlexContainer>
        </>
    );
}
