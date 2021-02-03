import React from "react";
import { useNotificationsManager } from "../../hooks/Notifications";

const Home = (): React.ReactElement => {
  const { addNotifications } = useNotificationsManager();

  addNotifications([
    {
      id: "123456789",
      type: "info",
      time: 5000,
      body: "You are on the website home page!",
    },
  ]);

  return <></>;
};

export default Home;
