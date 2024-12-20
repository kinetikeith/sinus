import { render, screen } from '@testing-library/react';
import App from './App';

describe('Render the app correctly', () => {
  test('should render theme toggle', async () => {
    render(<App />);

    const header = await screen.findByTestId('theme-toggle-btn');

    expect(header).toBeInTheDocument();
  });
});
