/* eslint-disable prettier/prettier */
import React, {ReactElement, useCallback} from "react";
import {FaDiscord} from "react-icons/fa";
import {RiPencilRuler2Line} from "react-icons/ri";
import Button, {ButtonImage} from "components/ui/Button/Button";
import ButtonGroup from "components/ui/Button/ButtonGroup";
import {NavLink} from "react-router-dom";
import {BsPeople} from "react-icons/all";
import styles from "./Home.module.scss";
import {Card, CardPadding} from "../../components/ui/Card/Card";
import Footer from "../../components/footer/Footer";

const shareAvailable = !!navigator.share;
const protocolAvailable = !!navigator.registerProtocolHandler;

export default function HomePage(): ReactElement {
    const share = useCallback(() => {
        navigator.share({
            title: "Developer's House",
            text: "Discover Developer's House today!",
            url: document.location.toString(),
        });
    }, []);

    const protocol = useCallback(() => {
        const url = `${document.location.toString()}?url=%s`;
        navigator.registerProtocolHandler("web+devhouse", url, "Developer's House");
    }, []);

    return (
        <div>
            <div
                className={`${styles.headerContent} ${styles.homeHeader}`}
            >
                <h1 className={styles.headerTitle}>Developer&rsquo;s House</h1>
                <p className={styles.headerSubtext}>
                    We are a small team of developers who seek to learn with a team of
                    people, our goal is to learn how to work as a team.
                </p>
                <ButtonGroup full className={styles.margin}>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://discord.gg/r8RC2TjnFd"
                    >
                        <Button large>
                            <ButtonImage>
                                <FaDiscord/>
                            </ButtonImage>
                            Discord server
                        </Button>
                    </a>
                    <NavLink to="/projects">
                        <Button large>
                            <ButtonImage>
                                <RiPencilRuler2Line/>
                            </ButtonImage>
                            View projects
                        </Button>
                    </NavLink>
                    <NavLink to="/members">
                        <Button large>
                            <ButtonImage>
                                <BsPeople/>
                            </ButtonImage>
                            View members
                        </Button>
                    </NavLink>
                </ButtonGroup>
            </div>
            <section className={styles.section}>
                <div className={styles.points}>
                    <div className={styles.point}>
                        <h2>Who we are</h2>
                        <p>
                            Developer&rsquo;s House is a team of students who loves tech and
                            software engineering and aims to build projects together! We work
                            together, prioritizing group development...
                        </p>
                        <NavLink to="/about">
                            <Button>More about us</Button>
                        </NavLink>
                    </div>
                    <div className={styles.point}>
                        <h2>Our projects</h2>
                        <p>
                            We works on different projects to diversifying our programming
                            skills and deploys cool stuff in production.
                        </p>
                        <NavLink to="/projects">
                            <Button>More projects.</Button>
                        </NavLink>
                    </div>

                    <div className={styles.point}>
                        <h2>What technologies do we use ?</h2>
                        <p>
                            At DevHouse, we mainly use JavaScript, Typescript, Golang, Docker
                            and Kubernetes. Our mainly goal is to teach to our developers by
                            creating projects, which means we are not limited to Typescript,
                            Golang... We are also planning to contribute to Open Source!
                        </p>
                    </div>

                    <div className={styles.point}>
                        <h2>Who is part of the project ?</h2>
                        <p>
                            Anyone can be part of Developer&rsquo;s House since you have the
                            basics of programming science and you want to learn!
                        </p>
                        <NavLink to="/members">
                            <Button>View the project&rsquo;s members</Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <span className={styles.background}>
                <div className={styles.content}>
                    <h2>Our projects</h2>
                    <p>
                        Developer&rsquo;s House is a group or people and projects - All the developer&rsquo;s house
                        projects are issued from members who want to build their project with the team. If they don&rsquo;
                        t want to later, they can always leave the team without loosing the ownership of the project,
                        because even if the idea is a Developer&rsquo;s House project, it is still the idea of the member
                        who created the project.
                    </p>
                </div>
            </span>
            <section className={styles.section}>
                <div className={styles.points}>
                    <Card className={styles.point}>
                        <CardPadding>

                            <h2>Framer</h2>
                            <p>
                                Framer is a discord focused image generation API, this one comes with customizable
                                images,
                                and smart pricing. Framer is based around SVG rendering and a flexible parameters
                                system.
                                Even through Framer is focused around Discord, it can scale to thousands of machines
                                hosted
                                with Developer&rsquo;s House.
                            </p>
                        </CardPadding>
                    </Card>

                    <Card className={styles.point}>
                        <CardPadding>
                            <h2>IMR</h2>
                            <p>
                                International Media Referencing is a large online cinematic database. You can find a
                                great deal of referenced content such as movies or series. You will be able to found
                                diverse information, as on the content as its technical specifications. We also make
                                available summaries provided by the production distributors, or the different trailers.
                                All available with a beautiful user interface! IMR also is a non-lucrative project, the
                                platform users can submit content to add or to update, to provide you permanently a
                                reliable source. If our project please you, don’t hesitate to contribute!
                            </p></CardPadding>
                    </Card>

                    <Card className={styles.point}>
                        <CardPadding>
                            <h2>Nova Framework</h2>
                            <p>
                                Nova Framework is a polyglot framework for creating discord bots at scale featuring a
                                microservices based architecture, Nova aims to bring a simple and polyglot way for
                                discord bots to scale easily using our framework. Nova is open source and available on
                                the
                                Developer&requo;s House GitHub.
                            </p>
                        </CardPadding>
                    </Card>

                    <Card className={styles.point}>
                        <CardPadding>
                            <h2>Kuizz</h2>
                            <p>
                                Kuizz is a competitive quiz answering app. You can play various quizzes alone or with
                                your friends or family! Kuizz is available online, on Android and IOS. You can even play
                                competitively using our real time party system.
                            </p>
                        </CardPadding>
                    </Card>
                </div>
            </section>
            <span className={styles.background}>
                <div className={styles.content}>
                    <h2>Want to stay in contact with Developer&rsquo;s House ?</h2>
                    <p>
                        Developer&rsquo;s House is very open-minded and accepts people even if they do not
                        have a IT background or profession. Our philosophy is based around learning and experiment.
                        We accept new members :shrug:
                    </p>
                        <NavLink to="/join">
                            <Button>
                                Fill the application form
                            </Button>
                        </NavLink>
                </div>
            </span>
            <section className={`${styles.points} ${styles.section}`}>
                <Card className={styles.point}>
                    <CardPadding>
                        <h2>Stay in contact with the project!</h2>
                        <p>
                            You can stay in the contact and chat with us by joining our public
                            discord server!
                        </p>
                        <ButtonGroup>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="https://discord.gg/r8RC2TjnFd"
                            >
                                <Button>Join our discord server</Button>
                            </a>
                            {shareAvailable && <Button onClick={share}>Share the project</Button>}
                            {protocolAvailable && (
                                <Button onClick={protocol}>Add the protocol</Button>
                            )}
                        </ButtonGroup>
                    </CardPadding>
                </Card>
                <Card className={styles.point}>
                    <CardPadding>
                        <h2>Contact information</h2>
                        <p>
                            If you need any information about this website or the organization
                            behind it, feel free to contact us, we will respond as soon as we can!
                        </p>
                        <ButtonGroup>
                            <a href="mailto:matthieu@developershouse.xyz">
                                <Button>By email</Button>
                            </a>
                            <NavLink to="/contact">
                                <Button>Contact us</Button>
                            </NavLink>
                        </ButtonGroup>
                    </CardPadding>
                </Card>
            </section>
            <Footer/>
        </div>
    );
}
