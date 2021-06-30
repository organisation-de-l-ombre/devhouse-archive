import React, { FC, ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import loadable from "@loadable/component";
import { Route, RouteComponentProps, Switch } from "react-router";
import { MetadataBuilder } from "@components/modules";
import { FlexContainer } from "@components/ui";

const RootError = loadable(() => import("@components/modules/Error/RootError"));
const Navbar = loadable(() => import("@components/modules/Navbar/Navbar"));
const Home = loadable(() => import("@application/Home/Home"));
const Account = loadable(() => import("@application/Account/AccountRoot"));
const Callback = loadable(() => import("@application/Callback/Callback"));
const Login = loadable(() => import("@application/Login/Login"));
const MovieTitle = loadable(() => import("@application/MovieTitle/MovieRoot"));
const Search = loadable(() => import("@application/Search/Search"));
const InternalWiki = loadable(
  () => import("@application/Wiki/Internal/InternalRoot")
);
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);

const EmbedPreview: FC = () => {
  const tempData: Record<string, string> = {
    title: "Raiponce",
    year: "2010",
    description:
      "Lorsque Flynn Rider, le bandit le plus recherché du royaume, se réfugie dans une mystérieuse tour, il se retrouve pris en otage par Raiponce, une belle et téméraire jeune fille à l’impressionnante chevelure de 20 mètres de long, gardée prisonnière par Mère Gothel. L’étonnante geôlière de Flynn cherche un moyen de sortir de cette tour où elle est enfermée depuis des années. Elle passe alors un accord avec le séduisant brigand… C’est le début d’une aventure délirante bourrée d’action, d’humour et d’émotion, au cours de laquelle l’improbable duo va rencontrer un cheval super‐flic, un caméléon à l’instinct de protection surdéveloppé, et une drôle de bande de malfaiteurs.",
    poster:
      "https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/movies/title/tangled_994f87ryf.a4/fr/movie-poster.webp",
  };

  return (
    <FlexContainer expand padding fullCentered>
      <MetadataBuilder
        title={`${tempData.title} - IMR`}
        embedTitle={`${tempData.title} (${tempData.year})`}
        description={tempData.description}
        image={tempData.poster}
      />
      <FlexContainer maxWidth>
        <h1>This is an embed preview for movie titles.</h1>
      </FlexContainer>
    </FlexContainer>
  );
};

const Application: FC = () => {
  return (
    <ErrorBoundary FallbackComponent={RootError}>
      <MetadataBuilder />

      <Navbar />

      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/account" component={Account} />
        <Route path="/callback" exact component={Callback} />
        <Route path="/auth/login" exact component={Login} />
        <Route path="/movies" exact />
        <Route path="/series" exact />
        <Route
          path="/movies/title/:title"
          render={(props: RouteComponentProps): ReactElement => {
            return <MovieTitle {...props} />;
          }}
        />
        <Route path="/search" exact component={Search} />
        <Route
          path="/wiki/internal/:section"
          render={(props: RouteComponentProps): ReactElement => {
            return <InternalWiki {...props} />;
          }}
        />
        <Route path="/embed-preview" exact component={EmbedPreview} />
        <Route path="*" component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
};

export default Application;
