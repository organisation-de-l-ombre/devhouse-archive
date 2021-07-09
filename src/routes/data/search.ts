import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { MovieTitle } from "@entities/movie-title";

interface RequestParameters {
  title: string;
}

export default {
  method: "GET",
  url: "/data/search",
  schema: {
    querystring: {
      title: { type: "string" }
    }
  },
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    this.log()

    let { title } = request.query as RequestParameters;

    if (!title || (title && title.length < 3) || (title && title.length > 32)) {
      void reply.code(400).send({
        statusCode: 400,
        message: "Bad request: missing parameters."
      });

      return;
    }

    title = title.replace(/_/gi, " ");

    const repository = request.databaseConnection().getRepository(MovieTitle);
    const databaseRequest: MovieTitle[] = await repository
      .createQueryBuilder("movie_title")
      .where("UPPER(movie_title.name) like UPPER(:name)", {
        name: `%${title}%`
      })
      .limit(10)
      .cache(true)
      .getMany();

    void reply.code(200).send({
      statusCode: 200,
      data: databaseRequest
    });
  }
} as RouteOptions;
