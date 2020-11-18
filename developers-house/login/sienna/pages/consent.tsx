import React, { ReactElement } from 'react';
import { Button, ButtonContainer } from '../components/button';

export default function Consent (): ReactElement {


    return (
        <div>
            <h2>Consent page</h2>
            <p>
                The application {} needs some kind of access to your account and needs your consent, if you do not trust this application, feel free to reject the consent request.
                This application requires the following permissions.
            </p>

            <ul>
                <li>View your account</li>
                <li>Edit your Kuizz account.</li>
            </ul>

            <ButtonContainer horizontal>
                <Button>
                    Accept
                </Button>
                <Button>
                    Reject
                </Button>
            </ButtonContainer>
        </div>
    );
};
