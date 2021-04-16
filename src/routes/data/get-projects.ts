import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import getProjects from "../../logic/get-projects";

const getProjectsRoute: RouteOptions = {
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const staff = await getProjects(request.redis);
    void response.send(staff);
  },
  url: "/data/projects"
};

export { getProjectsRoute };
