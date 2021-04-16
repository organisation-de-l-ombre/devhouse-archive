import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import getStaff from "../../logic/get-staff";

const getStaffRoute: RouteOptions = {
  method: "GET",
  async handler(request: FastifyRequest, response: FastifyReply) {
    const staff = await getStaff(request.redis);
    void response.send(staff);
  },
  url: "/data/staff"
};

export { getStaffRoute };
