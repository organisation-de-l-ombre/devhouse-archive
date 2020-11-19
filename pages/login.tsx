import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { AdminAPI, validateHydraResponse } from "../service/hydra";

const platforms = [
  "Discord",
  "Google",
  "Instagram",
  "GitHub",
];

export default function Home({
  client: { challenge, name },
}: {
  client: { challenge: string; name: string };
}): ReactElement {
  return (
    <div>
      <h2>Login page</h2>
      <p>
        Welcome to <b>Developer's House!</b> To continue, you need to login to
        your account or create one. Our system does not accepts password / email
        login for security reasons and we propose a variety of login providers
        available to you. You must login to continue to <b>{name}</b>
      </p>
      <ButtonContainer>
        {platforms.map((name) => {
          return (
            <a
              key={name}
              href={`/dialog/api/auth/initialize/${challenge}/${name.toLowerCase()}`}
            >
              <Button>{name}</Button>
            </a>
          );
        })}
      </ButtonContainer>
    </div>
  );
}

/*
 * The props rendered in the server.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch the request.
  if (context.query.login_challenge) {
    const {
      client: { client_name, client_id },
    } = await AdminAPI.getLoginRequest(
      context.query.login_challenge as string
    ).then(validateHydraResponse);

    return {
      props: {
        client: {
          name: client_name || client_id,
          challenge: context.query.login_challenge,
        },
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
