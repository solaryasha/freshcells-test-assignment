import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import { LoginForm } from './LoginForm.tsx';
import { AccountPage } from './AccountPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route index element={<LoginForm />}/>
      <Route path=":userId" element={<AccountPage />} />
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
