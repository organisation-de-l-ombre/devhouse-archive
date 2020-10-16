/*
 * This file represents all the calls to the api.
 */

import axios from 'axios';
import {ProjectMember} from "./types";
import {ServerResponse} from "./types";
import {returnOrThrow} from "./utils";

const fetchMembers = async (): Promise<ServerResponse<ProjectMember[]>> => {
    const {data} = await axios.get<ServerResponse<ProjectMember[]>>('/api/v2/members');
    return returnOrThrow(data);
};

export default {
    fetchMembers
};
