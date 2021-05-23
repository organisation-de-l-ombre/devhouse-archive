interface OauthClientResponse {
  id: string;
}

const getApplicationID = async (): Promise<string> => {
  if (process.env.NODE_ENV === "development") {
    return "5850f912-4654-42c4-9961-6ce577288bdb";
  }

  try {
    const { id }: OauthClientResponse = await fetch("/.oauth.json").then(
      (response: Response): Promise<OauthClientResponse> => response.json()
    );

    return id;
  } catch {
    return "Invalid client ID";
  }
};

export default getApplicationID;
