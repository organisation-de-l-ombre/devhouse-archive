/*
 * This file represents all the calls to the api.
 */

import axios from 'axios';

type User = {
    publicAccount: boolean;
    username: string;
    id: string;
    profilePicture: string;
};

const fetchUser = async (): Promise<User> => {
    const {data} = await axios.get<User>('https://auth-server.developershouse.xyz/userinfo');
    return data;
};

export {
    fetchUser
};
