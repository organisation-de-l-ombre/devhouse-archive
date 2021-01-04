import React, {
  PropsWithRef,
  PureComponent,
  ReactElement,
  Suspense,
} from "react";
import { TitleBox } from "components/ui/TitleBox";
import { TypeWriter } from "components/TypeWriter";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/SuspenseLoader";

const MembersDisplay = React.lazy(() => import("./MembersDisplay"));

export interface CachedUser {
  username: string;
  nickname?: string;
  presence?: {
    emote?: string;
    status: "online" | "dnd" | "offline" | "idle" | "invisible";
    presenceText?: string;
  };
  hoistRole: {
    position: number;
    color: string;
    name: string;
  };
  connexions: {
    name: string;
    link: string;
  }[];
  avatar?: string;
  discriminator: string;
  id: string;
}

export default class MembersPage extends PureComponent<
  unknown,
  { isLoading: boolean; users: CachedUser[]; error: Error | null }
> {
  constructor(props: PropsWithRef<unknown>) {
    super(props);

    this.state = {
      isLoading: true,
      users: [],
      error: null,
    };
    this.load = this.load.bind(this);
  }

  async componentDidMount(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.setState({ isLoading: true });

    try {
      const data = await fetch(
        "https://developers-house-dev-website-group-abdera.matthieu-dev.xyz/staff/list"
      );

      if (!data.ok) {
        this.setState({
          isLoading: false,
          error: new Error("Failed to get in touch with the server."),
        });
        return;
      }
      const json: CachedUser[] = await data.json();
      this.setState({ isLoading: false, users: json });
    } catch (error) {
      this.setState({ isLoading: false, error });
    }
  }

  render(): ReactElement {
    const { error, users, isLoading } = this.state;

    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return (
        <TitleBox>
          <h1>Failed to load the member list.</h1>
          Try again later or try to check our status page.
        </TitleBox>
      );
    }

    return (
      <Suspense fallback="">
        <TitleBox>
          <h1>Our members</h1>
          <h2>
            <TypeWriter characterDisplayInterval={100}>
              Thanks to all of our team to have helped to develop and to make
              possible this project! Without these persons below this project
              wouldn&rsquo;t exist.
            </TypeWriter>
          </h2>
          <Button onClick={this.load}>Refresh</Button>
        </TitleBox>

        <MembersDisplay users={users} />
      </Suspense>
    );
  }
}
