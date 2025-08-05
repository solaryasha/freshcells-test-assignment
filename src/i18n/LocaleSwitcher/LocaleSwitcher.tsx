import { useTranslation } from "react-i18next";
import LangIcon from "./LangIcon";
import { supportedLngs } from "../config";
import './LocalSwitcher.css';
import { MenuItem, Select } from '@mui/material';

export default function LocaleSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="locale-switcher">
      <div className="locale-select">
        <LangIcon />

        <Select
          value={i18n.resolvedLanguage}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          size='small'
        >
          {Object.entries(supportedLngs).map(([code, name]) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
}