/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';


const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      switch (key) {
        case 'email-label': return 'Email';
        case 'password-label': return 'Password';
        case 'login-button-text': return 'Login';
        case 'empty-email-error-text': return 'Email cannot be empty.';
        case 'email-not-matching-error-text': return 'Please enter a valid email address.';
        case 'empty-password-error-text': return 'Password cannot be empty.';
        case 'invalid-email-password': return 'Invalid email or password.';
        case 'something-went-wrong': return 'Something went wrong. Please try again.';
        default: return key;
      }
    },
  }),
}));

beforeAll(() => {
  jest.spyOn(global, 'fetch');
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('LoginForm', () => {
  test('renders the login form with email, password, and login button', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles successful login and navigates to user ID page', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          login: {
            jwt: 'mock-jwt-token',
            user: { id: 'mock-user-id' },
          },
        },
        errors: null,
      }),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://cms.trial-task.k8s.ext.fcse.io/graphql',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringMatching(/identifier: \\\"test@example.com\\\"\\n/)
        })
      );
    });

    expect(localStorage.getItem('token')).toBe('mock-jwt-token');
    expect(mockNavigate).toHaveBeenCalledWith('mock-user-id');

    await waitFor(() => {
      expect(loginButton).not.toHaveAttribute('loading');
    });
  });

  test('handles failed login with "Bad Request" error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        data: null,
        errors: [{ message: 'Bad Request', extensions: { code: 'BAD_USER_INPUT' } }],
      }),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(loginButton).not.toHaveAttribute('loading');
    });
  });

  test('handles generic failed login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        data: null,
        errors: [{ message: 'Network Error', extensions: { code: 'INTERNAL_SERVER_ERROR' } }],
      }),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/something went wrong. please try again/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(loginButton).not.toHaveAttribute('loading');
    });
  });
});
