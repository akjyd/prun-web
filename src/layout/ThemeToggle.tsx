import useTheme from "../hooks/useTheme";
import Sun from "../ui/icons/Sun";
import Moon from "../ui/icons/Moon";
import IconButton from "../ui/button/IconButton";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme}>
      {theme === "light" ? <Sun /> : <Moon />}
    </IconButton>
  );
}
