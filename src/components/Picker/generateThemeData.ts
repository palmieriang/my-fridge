interface ThemePickerItem {
  label: string;
  value: string;
  key: string;
}

interface GenerateThemeDataParams {
  availableThemes: string[];
  translate: (scope: string) => string;
}

export const generateThemeData = ({
  availableThemes,
  translate,
}: GenerateThemeDataParams): ThemePickerItem[] => {
  const themeEntries = availableThemes.map((themeKey) => ({
    label: translate(themeKey),
    value: themeKey,
    key: themeKey,
  }));

  return themeEntries;
};
