import { Outlet } from "react-router";
import LocaleSwitcher from './i18n/LocaleSwitcher/LocaleSwitcher';

export const Route = () => {
  return (
    <div>
      <LocaleSwitcher />
      <Outlet />
    </div>
  );
}