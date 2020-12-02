import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { applySession } from "next-session";
import { options } from "../lib/service/session";
import { provide } from "../lib/service/csrf";
import { GeneralUser } from "../lib/service/providers";

type Props = {
    user: GeneralUser;
    csrf: string;
};

export default function Register({ user, csrf }: Props): ReactElement {
    return (
        <div>
            <h2>Hello!</h2>
            <p>
                Hello, { user }! Welcome to <b>Developer's House</b>! As a new member, you need to accept our <a href="">terms of service</a> in order to continue.
            </p>

            <form method="POST" action={"/dialog/api/register/validate"}>
                <ButtonContainer horizontal>
                    <Button name="validate" value="accept">
                        Accept
                    </Button>
                    <input type="hidden" value={csrf} name="_csrf" />
                </ButtonContainer>
            </form>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
    // Unpack the object.
    const {
        req: {
            session,
        },
        req,
        res,
    } = context;
    // Starts the session in order to be able to access the state of the register request (register to create an account).
    await applySession(req as any, res, options);
    // Check if a registering session exists.
    if (session.register) {
        return {
            props: {
                csrf: await provide(context.req),
                user: context.req.session.register.user,
            },
        };
    }
    // We return a not found if something go wrong.
    return  {
        notFound: true,
    };
}
