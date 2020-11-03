import { Button } from '../components/Button';
import { ButtonContainer } from '../components/ButtonContainer';
import { Warning } from '../components/Warning';

export default function Home() {
  return (
    <div>
      <h2>
        Debug menu
      </h2>
      <p>
        This page is currently in active developement.
      </p>
      <ButtonContainer>

      <Button>
        Return the the main website.
      </Button>
      </ButtonContainer>
    </div>
  );
};
