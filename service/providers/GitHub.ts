import FormData from 'form-data';
import fetch from 'node-fetch';
import {ConstructorType, GeneralUser, Provider} from "./index";

export default class GitHubProvider implements Provider {

    constructor(private readonly props: { client_id: string, client_secret: string, redirect_uri: string }) {
    }

    async exchangeCode(code: string, host: string): Promise<string> {
        const formData = new FormData();

        formData.append('client_id', this.props.client_id);
        formData.append('client_secret', this.props.client_secret);
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('redirect_uri', `https://${host}${this.props.redirect_uri}`);
        formData.append('scope', 'identify');

        const resp = await fetch(`https://github.com/login/oauth/access_token`, {
            body: formData,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!resp.ok) {
            throw ('Unable to exchange the token from github.');
        }
        return (await resp.json()).access_token;
    }

    getRedirectUri(state: string, host: string): string {
        return `https://github.com/login/oauth/authorize?client_id=${this.props.client_id}&scope=read_user&redirect_uri=${encodeURIComponent(`https://${host}${this.props.redirect_uri}`)}&state=${encodeURIComponent(state)}&response_type=code&prompt=none`;
    }

    async getUserData(token: string): Promise<GeneralUser> {
        const resp = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`,
            },
        });
        const user = await resp.json();
        if (!resp.ok || !user.id || !user.login) {
            throw ('Unable to get the user from github.');
        }
        return {
            id: user.id,
            username: user.login.toString(),
            provider: 'github'
        };
    }

    name(): string {
        return 'Github';
    }
}
