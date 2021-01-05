/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TitleBox } from "../../../components/ui/TitleBox";
import { Button } from "../../../components/ui/Button";
import { logoutUser } from "../../../state/modules/user/actions";

const Account = (): ReactElement => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.user);
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);
  return (
    <TitleBox>
      <br />
      You are currently logged in as <b>{user?.username}</b> <br /> <br />
      <Button onClick={logout}>Logout</Button>
    </TitleBox>
  );
};

export default Account;
