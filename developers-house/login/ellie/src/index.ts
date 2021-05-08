import fastify from "fastify";
import {avatarLink} from "./generators/AvatarLink";

const server = fastify({
    logger: {
        level: "info"
    },
});
server.setNotFoundHandler((_, rep) => {
    rep.code(404);
    rep.send();
});
server.route(avatarLink);

server.listen(5000, "0.0.0.0");
