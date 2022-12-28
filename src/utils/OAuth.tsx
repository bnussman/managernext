import { setToken } from "@linode/api-v4";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizeUrl, clientId } from "./constants";

export function OAuth() {
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

export function useOAuth() {
  const [isLoading, setIsLoading] = useState(true);

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

  return { isLoading };
}