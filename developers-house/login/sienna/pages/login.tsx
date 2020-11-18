import { randomBytes } from 'crypto';
import { ReactElement } from 'react';
import { Button, ButtonContainer } from '../components/button';

const platforms = ['Discord', 'GitHub', 'GitLab', 'Instagram', 'Google', 'Microsoft']

export default function Home(): ReactElement {
    return (
        <div>
            <h2>Login page</h2>
            <p>
                Welcome to <b>Developer's House!</b> To continue, you need to login to your account or create one.
                Our system does not accepts password / email login for security reasons and we propose
                a variety of login providers available to you. You must login to continue to <b>{ }</b>
            </p>
            <ButtonContainer>
                {
                    platforms.map((name) => {
                        return (
                            <a key={name} href={`/dialog/api/auth/initialize/${randomBytes(256).toString('hex')}/${name.toLowerCase()}`}>
                                <Button>
                                    {name}
                                </Button>
                            </a>
                        )
                    })
                }
            </ButtonContainer>
        </div>
    );
};
