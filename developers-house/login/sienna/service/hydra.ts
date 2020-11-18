import { AdminApi } from '@oryd/hydra-client';
import axios from 'axios';

const requester = axios.create({
    headers: {
        'X-Forwarded-Proto': 'https',
    }
});

export const AdminAPI = new AdminApi({}, process.env.HYDRA_ADMIN, requester as any);