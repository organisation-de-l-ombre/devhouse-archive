/*
 * Tests for the button component
 */

import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button behavior', () => {
    it('Renders', () => {
        render(
            <Button>
                Test
            </Button>
        );
    });

    it('Renders the text specified', () => {
        expect(screen.getByText('Test')).toBeInTheDocument();
    })
});