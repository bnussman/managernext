import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./Home";
import { Linodes } from "./Linodes";
import { authorizeUrl, clientId } from "./utils/constants";
import { setToken } from "@linode/api-v4";
import { Button, createTheme, CssBaseline, ThemeOptions, ThemeProvider } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AccountBoxOutlined, SdStorage, Storage, SupervisedUserCircleOutlined } from "@mui/icons-material";

const queryClient = new QueryClient();

function OAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    // When the OAuth route is mounted...

    // Prase query params and get relevent data such as access_token and expires_in
    const url = new URLSearchParams(window.location.href);
    const data = Array.from(url.entries());
    const token = data.find(entry => entry[0].includes("access_token"))?.[1];
    const expires_in = url.get("expires_in")

    if (!token || !expires_in) {
      return;
    }

    const expiresIn = Number(expires_in) * 1000;
    const expiresAt = Date.now() + expiresIn;

    // Make app reauth when token is set to expire
    setTimeout(() => {
      localStorage.removeItem('expires');
      localStorage.removeItem('token');
      window.location.href = encodeURI(`${authorizeUrl}?response_type=token&client_id=${clientId}&state=xyz&redirect_uri=http://localhost:5173/callback&scope=*`);
    }, expiresIn);

    // Store token and expire time in localstorage
    localStorage.setItem('token', token);
    localStorage.setItem('expires', String(expiresAt));

    // Set @linode/api-v4 token for use
    setToken(token);

    // Go home
    navigate("/");
  }, []);

  return <p>Logging In</p>;
}

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const hasToken = token !== null;
    const expiresAt = Number(localStorage.getItem('expires'));

    // If we initialize the app with the /callback url, we need to render routes but do no processing.
    if (location.pathname.includes('/callback')) {
      setIsLoading(false);
      return;
    }

    // When we initialize the app...
    if (hasToken && expiresAt > Date.now()) {
      // If we have an auth token that is not expired...
      // Make app redirect to auth when token expires
      setTimeout(() => {
        localStorage.removeItem('expires');
        localStorage.removeItem('token');
        window.location.href = encodeURI(`${authorizeUrl}?response_type=token&client_id=${clientId}&state=xyz&redirect_uri=http://localhost:5173/callback&scope=*`);
      }, expiresAt - Date.now());

      // Set the @linode/api-v4 token and render the app
      setToken(token);
      setIsLoading(false);
      return;
    }

    // if we have mde it here, we need to authenticate
    window.location.href = encodeURI(`${authorizeUrl}?response_type=token&client_id=${clientId}&state=xyz&redirect_uri=http://localhost:5173/callback&scope=*`);
  }, []);

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </BrowserRouter>
  )
};