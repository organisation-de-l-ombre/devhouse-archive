import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { MovieRequest } from "@typings/movies";
import { MoviesProvider } from "@providers/movies-provider";

const getMovies: RouteOptions = {
  method: "POST",
  url: "/data/movies",
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as MovieRequest;

    if (!body) {
      void reply.status(400).send({
        statuCode: 400,
        message: "Bad request: missing parameters."
      });

      return;
    }

    const moviesProvider = new MoviesProvider(request, reply);

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (body.request) {
      case "movie-data":
        await moviesProvider.getMovieData(body.id, body.language);
        break;

      default:
        void reply.code(400).send({
          statusCode: 400,
          message: "Bad request: missing parameters."
        });
    }
  }
};

export default getMovies;
