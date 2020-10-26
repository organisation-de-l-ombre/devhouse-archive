import React, {PropsWithRef, PureComponent, ReactElement, Suspense} from "react";
import {TitleBox} from "components/ui/TitleBox";
import {TypeWriter} from "components/TypeWriter";
import {ProjectMember} from "utilities";

const MembersDisplay = React.lazy(() => import("./MembersDisplay"));

export default class MembersPage extends PureComponent<{},
    { isLoading: boolean; users: ProjectMember[] | null; error: Error | null }> {
    constructor(props: PropsWithRef<{}>) {
        super(props);

        this.state = {
            isLoading: true, users: null, error: null
        };
    }

    render(): ReactElement {
        return (
            <div>
                {
                    // First, we check if something bad happened.
                    this.state.isLoading ? (
                        <TitleBox>Loading users.</TitleBox>
                    ) : this.state.error || this.state.users === null ? (
                        <TitleBox>
                            <h1>Failed to load the member list.</h1>
                            Try again later or try to check our status page.
                        </TitleBox>
                    ) : (
                        <Suspense fallback={""}>
                            <TitleBox>
                                <h1>Our members</h1>
                                <h2>
                                    <TypeWriter characterDisplayInterval={100}>
                                        Thanks to all of our team to have helped to develop and to make
                                        possible this project! Without these persons below this project
                                        wouldn't exist.
                                    </TypeWriter>
                                </h2>
                            </TitleBox>
                            <MembersDisplay users={this.state.users}/>
                        </Suspense>
                    )
                }
            </div>
        );
    }

    async componentDidMount(): Promise<void> {
        this.setState({isLoading: true});

        const dummyData: ProjectMember[] = [
            {
                description: 'Je suis un des fondateurs de devhouse',
                discord: '314354049023737857',
                role: 'Developer',
                socialNetworks: [],
                userState: {
                    avatar: '5ada775984d4d1469a49babe03bd788d',
                    discriminator: '2050',
                    nickname: 'Matthieu',
                    statusText: 'Working',
                    username: 'Exact',
                    status: 'online',
                },
                username: 'Matthieu'
            }
        ];

        try {
            const data = await fetch("/api/v1/members");

            if (!data.ok) {
                this.setState({
                    isLoading: false,
                    error: new Error("Failed to get in touch with the server.")
                });
                return;
            }
            const json: { data: ProjectMember[] } = await data.json();
            this.setState({isLoading: false, users: json.data});
        } catch (error) {
            this.setState({isLoading: false, users: [...dummyData, ...dummyData]});
        }
    }
}
