import React from "react";
import UserContext from "../../account/UserContext";

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState(
    JSON.parse(window.localStorage.getItem("user") ?? "null")
  );
  const createUser = React.useCallback((response) => {
    setUser(response);
  }, []);
  const deleteUser = React.useCallback(() => {
    setUser({});
  }, []);

  React.useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, loggedIn: user !== null, createUser, deleteUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
