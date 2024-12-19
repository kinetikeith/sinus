import { render, screen } from '@testing-library/react';
import App from './App';

describe('Render the app correctly', () => {
  test('should render the title', async () => {
    render(<App />);

    const header = await screen.findByText(/sinus/);

    expect(header).toBeInTheDocument();
  });
});
