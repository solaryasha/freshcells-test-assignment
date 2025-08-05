import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginForm } from './components/LoginForm/LoginForm.tsx';
import { AccountPage } from './components/AccountPage/AccountPage.tsx';
import './i18n/config.ts';
import './index.css';
import { ErrorFallback } from './ErrorFallback.tsx';
import { Route } from './Root.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    Component: Route,
    children: [
      {
        index: true,
        Component: LoginForm,
        errorElement: <ErrorFallback />
      },
      {
        path: ":userId",
        Component: AccountPage,
        errorElement: <ErrorFallback />
      }]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

