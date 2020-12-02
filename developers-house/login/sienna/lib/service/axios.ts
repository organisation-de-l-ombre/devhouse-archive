import axios, {AxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';

export default function buildAxios(options: AxiosRequestConfig) {
    const client = axios.create(options);
    axiosRetry(client, { retries: 3 });
    return client;
}
