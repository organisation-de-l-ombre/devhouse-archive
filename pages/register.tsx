import { GetServerSidePropsContext } from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { applySession } from "next-session";
import {options} from "../lib/service/session";
import {provide} from "../lib/service/csrf";

export default function Consent({ name, csrf }): ReactElement {
    return (
        <div>
            <h2>Hello!</h2>
            <p>
                Hello, { name }! Welcome to <b>Developer's House</b>! As a new member, you need to accept our <a href="">terms of service</a> in order to continue.
            </p>

            <form method="POST" action="/dialog/api/register/validate">
                <ButtonContainer horizontal>
                    <Button name="validate" value="accept">
                        Accept
                    </Button>
                    <Button name="validate" value="reject">
                        Reject
                    </Button>
                    <input type="hidden" value={csrf} name="_csrf" />
                </ButtonContainer>
            </form>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Load the session.
    await applySession(context.req as any, context.res, options);

    return {
        props: {
            csrf: await provide(context.req as any),
            name: (context.req as any).session.register.user.username,
        }
    };
}
