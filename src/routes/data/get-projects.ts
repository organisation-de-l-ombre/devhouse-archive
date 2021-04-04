import { RouteOptions } from "fastify";
import getProjects from "../../logic/get-projects";

const getProjectsRoute: RouteOptions = {
    method: "GET",
    async handler(
        req,
        res
    ) {
        const staff = await getProjects(req.redis);
        res.send(staff);
    },
    url: "/data/projects",
};

export {
    getProjectsRoute
};
