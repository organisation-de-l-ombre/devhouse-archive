import FormData from 'form-data';
import fetch from 'node-fetch';
import {ConstructorType, GeneralUser, Provider} from "./index";

export default class GoogleProvider implements Provider {

    constructor(private readonly props: { client_id: string, client_secret: string, redirect_uri: string }) {
    }

    async exchangeCode(code: string, host: string): Promise<string> {
        const formData = new FormData();
        formData.append('client_id', this.props.client_id);
        formData.append('client_secret', this.props.client_secret);
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('redirect_uri', `https://${host}${this.props.redirect_uri}`);

        const resp = await fetch(`https://oauth2.googleapis.com/token`, {
            body: formData,
            method: 'POST',
            headers: formData.getHeaders(),
        });

        if (!resp.ok) {
            throw ('Unable to exchange the token from google.');
        }
        return (await resp.json()).access_token;
    }

    getRedirectUri(state: string, host: string): string {
        const scope = 'https://www.googleapis.com/auth/userinfo.profile';

        return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&redirect_uri=${`https://${host}${this.props.redirect_uri}`}&client_id=${this.props.client_id}`;
    }

    async getUserData(token: string): Promise<GeneralUser> {
        const resp = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?oauth_token=${token}`);

        const user = await resp.json();
        if (!resp.ok || !user.id || !user.name) {
            throw ('Unable to get the user from discord.' + JSON.stringify(user, null, '\t'));
        }
        return {
            id: user.id,
            username: user.name,
            provider: 'google',
            avatarURL: user.picture,
        };
    }

    name(): string {
        return 'Google';
    }
}
