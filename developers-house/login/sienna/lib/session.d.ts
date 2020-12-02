import {SessionData} from "next-session";
import {GeneralUser} from "./service/providers";

interface LoginSession {
    state: string;
    provider: string;
    loginChallenge: string;
}

interface RegisterSession {
    user: GeneralUser;
    loginChallenge: string;
}

interface ConsentSession {
    scopes: string[];
}

export default interface Session extends SessionData {
    csrfKey: string;
    login?: LoginSession;
    register?: RegisterSession;
    consent?: ConsentSession;
}

declare module 'http' {
    export interface IncomingMessage {
        session: Session;
    }
}
