interface ThemePickerItem {
  label: string;
  value: string;
  key: string;
}

interface GenerateThemeDataParams {
  availableThemes: string[];
  changeThemeLabel: string;
}

export const generateThemeData = ({
  availableThemes,
  changeThemeLabel,
}: GenerateThemeDataParams): ThemePickerItem[] => {
  const themeEntries = availableThemes.map((themeKey) => {
    const label = themeKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    return {
      label,
      value: themeKey,
      key: themeKey,
    };
  });

  return [
    { label: changeThemeLabel, value: "", key: "title" },
    ...themeEntries,
  ];
};
