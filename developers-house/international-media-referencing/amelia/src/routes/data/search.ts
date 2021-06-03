import { FastifyReply, FastifyRequest, RouteOptions } from "fastify";
import { MovieTitle } from "@entities/movie-title";
import { Language } from "@entities/localized-movie";
import { Like, Repository } from "typeorm";

interface RequestParameters {
  title: string;
  language: string;
}

const search: RouteOptions = {
  method: "GET",
  url: "/data/search",
  schema: {
    querystring: {
      title: { type: "string" },
      language: { type: "string" }
    }
  },
  async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { title, language } = request.query as RequestParameters;

    if (
      !title ||
      (title && title.length < 3) ||
      (title && title.length > 32) ||
      !language
    ) {
      void reply.code(400).send({
        statusCode: 400,
        message: "Bad request: missing parameters."
      });

      return;
    }

    const formattedTitle: string = title.replace(/_/gi, " ");
    const repository: Repository<MovieTitle> = request
      .databaseConnection()
      .getRepository(MovieTitle);
    /* const databaseRequest: MovieTitle[] = await repository
      .createQueryBuilder("movie_title")
      .where("UPPER(movie_title.name) like UPPER(:name)", {
        name: `%${formattedTitle}%`
      })
      .limit(10)
      .cache(true)
      .getMany(); */
    const databaseRequest: MovieTitle[] = await repository.find({
      where: {
        name: Like(`%${formattedTitle}%`)
      },
      relations: ["availableLanguages"],
      take: 10,
      cache: true
    });

    void reply.send({
      statusCode: 200,
      results: databaseRequest.filter((movie: MovieTitle): boolean =>
        movie.availableLanguages.some(
          (lang: Language): boolean => lang.language === language
        )
      )
    });
  }
};

export default search;
