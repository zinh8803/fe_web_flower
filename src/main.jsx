import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./themes/theme";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   //<React.StrictMode>
//   <Provider store={store}>
//     <BrowserRouter>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <App />
//       </ThemeProvider>
//     </BrowserRouter>
//   </Provider>
//   //</React.StrictMode>
// );
const container = document.getElementById("root");

if (container) {
  ReactDOM.createRoot(container).render(
    //<React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
    //</React.StrictMode>
  );
}
