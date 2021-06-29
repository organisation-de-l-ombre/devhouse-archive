const getClientID = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "5850f912-4654-42c4-9961-6ce577288bdb";
  }

  return process.env.client_id || "";
};

export default getClientID;
