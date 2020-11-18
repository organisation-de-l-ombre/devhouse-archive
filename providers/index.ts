/*
 * The list of oauth proviers.
 */

export const Providers = new Map<string, Provider>();

import DiscordProvider from './Discord';

export type ConstructorType = { client_id: string, client_secret: string, redirect_uri: string };
interface Constructeable {
    new (options: ConstructorType): Provider;
}

const addProvider = (name: string, provider: Constructeable) => {
    if (process.env[`${name.toUpperCase()}_SECRET`] && process.env[`${name.toUpperCase()}_CLIENT_ID`]) {
        Providers.set(name, new provider({
            client_id: process.env[`${name.toUpperCase()}_CLIENT_ID`] as string,
            redirect_uri: '/dialog/api/auth/callback',
            client_secret: process.env[`${name.toUpperCase()}_SECRET`] as string,
        }));
    }
};

addProvider('discord', DiscordProvider);

export type GeneralUser = {
    id: string;
    username: string;
    provider: string;
};

export interface Provider {
    getUserData(token: string): Promise<GeneralUser>;
    exchangeCode(code: string, host: string): Promise<string>;
    getRedirectUri(state: string, host: string): string;
    name(): string;
};