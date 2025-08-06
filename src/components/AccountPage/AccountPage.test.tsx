const userParamsMock = jest.fn();
const mockUseNavigate = jest.fn();
/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AccountPage } from './AccountPage';
import '@testing-library/jest-dom';

jest.mock('react-router', () => ({
  useParams: userParamsMock,
  useNavigate: mockUseNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));


describe('AccountPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
    userParamsMock.mockReturnValue({ userId: '123' })
    mockUseNavigate.mockReturnValue(jest.fn());
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render user data after successful fetch', async () => {
    localStorage.setItem('token', 'test-token');

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: {
          user: {
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      }),
    });

    render(<AccountPage />);

    const firstNameInput = await screen.findByDisplayValue('John');
    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toBeDisabled();

    const lastNameInput = await screen.findByDisplayValue('Doe');
    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeDisabled();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'https://cms.trial-task.k8s.ext.fcse.io/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer test-token",
        },
        body: JSON.stringify({
          query: `{
                user(id: 123) {
                  firstName
                  lastName
                }}`
        }),
      })
    );

    expect(screen.getByRole('button', { name: 'logout-button-text' })).toBeInTheDocument();
  });

  test('should redirect to home page if no token is found', async () => {
    render(<AccountPage />);

    await waitFor(() => {
      expect(mockUseNavigate()).toHaveBeenCalledWith('/');
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  test('should log out and redirect on logout button click', async () => {
    localStorage.setItem('token', 'test-token');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: {
          user: {
            firstName: 'Jane',
            lastName: 'Doe',
          },
        },
      }),
    });

    render(<AccountPage />);

    await screen.findByDisplayValue('Jane');

    const logoutButton = screen.getByRole('button', { name: 'logout-button-text' });
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(mockUseNavigate()).toHaveBeenCalledWith('/');
  });

  test('should throw an error if fetch fails', async () => {
    localStorage.setItem('token', 'test-token');

    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    let caughtError: Error | null = null;
    try {
      render(<AccountPage />);
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    } catch (e) {
      caughtError = e as Error;
      expect(caughtError as Error).toBe(mockError);
    }
  });
});
