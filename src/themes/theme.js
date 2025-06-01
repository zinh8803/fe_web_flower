import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#1d4ed8" },
        secondary: { main: "#64748b" },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
    },
});

export default theme;
