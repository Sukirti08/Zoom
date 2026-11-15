import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios', () => ({
  create: jest.fn(() => ({})),
}));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

test('renders the video call landing page', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Video Meetings' })).toBeInTheDocument();
  expect(screen.getByText('Join as Guest')).toBeInTheDocument();
});

test('Get Started opens the authentication page', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: 'Get Started' }));

  expect(window.location.pathname).toBe('/auth');
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
});
