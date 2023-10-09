import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorUI } from './Error';

test('Render ErrorUI', () => {
    render(<ErrorUI error='test error' time={10000 } />);
    const linkElement = screen.getByText(/test error/i);
    expect(linkElement).toBeInTheDocument();
});