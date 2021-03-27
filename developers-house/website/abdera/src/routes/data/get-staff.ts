import { RouteOptions } from "fastify";
import getStaff from "../../logic/get-staff";

const route: RouteOptions = {
    method: "GET",
    async handler(
        req,
        res
    ) {
        const staff = await getStaff(req.redis);
        res.send(staff);
    },
    url: "/data/staff",
};

export default route;
