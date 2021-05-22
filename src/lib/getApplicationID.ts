const getApplicationID = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "5850f912-4654-42c4-9961-6ce577288bdb";
  }

  let id = "";

  fetch("./oauth.json")
    .then((response: Response): Promise<{ id: string }> => response.json())
    .then((response): void => {
      id = response.id;
    });

  return id;
};

export default getApplicationID;
