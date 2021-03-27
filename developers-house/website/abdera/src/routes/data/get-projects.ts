import { RouteOptions } from "fastify";
import getProjects from "../../logic/get-projects";

const route: RouteOptions = {
    method: "GET",
    async handler(
        req,
        res
    ) {
        const staff = await getProjects();
        res.send(staff);
    },
    url: "/data/projects",
};

export default route;
