import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Button, ButtonContainer } from "../components/button";

export default function Register(): ReactElement {
  const username = useRef<HTMLInputElement>(null);
  const privateAccount = useRef<HTMLInputElement>(null);
  const terms = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const router = useRouter();
  const { query } = router;

  const submit = useCallback(async () => {
    const name = username.current.value;
    if (name.length < 3 || name.length > 32) {
      setMessage(
        "Your name must have at least 3 characters and least than 32 characters."
      );
      return;
    }
    if (!terms.current.checked) {
      setMessage("You must agree to the terms and conditions.");
      return;
    }
    setMessage("");

    const response = await fetch("/dialog/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        private: privateAccount.current.checked,
        term: terms.current.checked,
      }),
    });

    if (response.ok) {
      const json = await response.json();
      await router.push(json.redirect);
    }
  }, [router]);

  return (
    <div>
      <h2>Hello!</h2>
      <p>
        Hello, {query.username}! Welcome to <b>Developer&rsquo;s House</b>! As a
        new member, you need to accept our <a href="#a">terms of service</a> in
        order to continue.
      </p>

      <label htmlFor="_register_username">Username</label>
      {"  "}
      <input
        ref={username}
        type="text"
        id="_register_username"
        defaultValue={query.username}
        contentEditable
      />
      <br />
      <br />
      <input ref={privateAccount} type="checkbox" id="_register_checkbox" />
      <label htmlFor="_register_checkbox">Private account</label>
      <br />
      <br />
      <input ref={terms} type="checkbox" id="_register_chkbox" />
      <label htmlFor="_register_chkbox">
        I accept the terms of service of Developer&rsquo;s House
      </label>
      <br />
      <br />
      {message}
      <ButtonContainer horizontal>
        <Button name="validate" value="accept" onClick={submit}>
          Accept
        </Button>
      </ButtonContainer>
    </div>
  );
}
