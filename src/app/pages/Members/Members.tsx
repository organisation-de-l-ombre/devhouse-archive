import React, {PropsWithRef, PureComponent, ReactElement, Suspense} from "react";
import {TitleBox} from "../../../components/ui/TitleBox";
import { TypeWriter } from "@website/app";
import {User} from "@website/common/src/api/types/User";

const MembersDisplay = React.lazy(() => import("./MembersDisplay"));

export default class MembersPage extends PureComponent<{},
    { isLoading: boolean; users: User[] | null; error: Error | null, text: string }> {
    constructor (props: PropsWithRef<{}>) {
        super(props);

        this.state = {isLoading: true, users: null, error: null, text: `Thanks to all of our team to have helped to develop and to make
        possible this project! Without these persons below this project
        wouldn't exist.`};
    }

    render (): ReactElement {
        return (
            <div>
                <TitleBox>
                    <h1>Our members</h1>
                    <h2>
                        <TypeWriter characterDisplayInterval={100} ended={() => this.setState({text:'hey ceci est un test'})}>
                            { this.state.text }
                        </TypeWriter>
                    </h2>
                </TitleBox>

                {
                    // First, we check if something bad happened.
                    this.state.isLoading ? (
                        <TitleBox>Loading users.</TitleBox>
                    ) : this.state.error || this.state.users === null ? (
                        <TitleBox>
                            Failed to load users. {this.state.error?.message}
                        </TitleBox>
                    ) : (
                        <Suspense fallback={""}>
                            <MembersDisplay users={this.state.users}/>
                        </Suspense>
                    )
                }
            </div>
        );
    }

    async componentDidMount (): Promise<void> {
        this.setState({isLoading: true});

        try {
            const data = await fetch("/api/v1/members");

            if (!data.ok) {
                this.setState({
                    isLoading: false,
                    error: new Error("Failed to get in touch with the server.")
                });
                return;
            }
            const json: { data: User[] } = await data.json();
            this.setState({isLoading: false, users: json.data});
        } catch (error) {
            this.setState({isLoading: false, error});
        }
    }
}
