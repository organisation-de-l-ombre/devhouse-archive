import { ReactElement } from "react";
import { Button } from "../components/button";
import { ButtonContainer } from "../components/button/ButtonContainer";

export default function Home(): ReactElement {
  return (
    <div>
      <h2>Debug menu</h2>
      <ButtonContainer>
        <Button
          onClick={() => window.open("https://developershouse.xyz", "blank")}
        >
          Return the the main website.
        </Button>
      </ButtonContainer>
    </div>
  );
}
