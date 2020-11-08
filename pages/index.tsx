import { Button } from '../components/button';
import { ButtonContainer } from '../components/button/ButtonContainer';

export default function Home() {
  return (
    <div>
      <h2>
        Debug menu
      </h2>
      <ButtonContainer>
        <Button>
            Return the the main website.
        </Button>
      </ButtonContainer>
    </div>
  );
};
