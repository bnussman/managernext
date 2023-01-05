import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, Container } from '@chakra-ui/react'
import { OAuth, useOAuth } from "./utils/OAuth";
import { Navigation } from "./Navigation";
import { theme } from "./utils/theme";
import { LinodeRouter } from "./linodes";
import { useEventsPollingQuery } from "./queries/events";
import { baseRequest } from "@linode/api-v4";
import { NotFound } from "./components/NotFound";
import { normalizeErrors } from "./utils/errors";
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"

baseRequest.interceptors.response.use(undefined, normalizeErrors);

export const queryClient = new QueryClient();

function Main() {
  const { isLoading } = useOAuth();
  
  useEventsPollingQuery();

  if (isLoading) {
    return (
      <Routes>
        <Route path="/callback" element={<OAuth />} />
      </Routes>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxW="container.xl" pt={20}>
        <Routes>
          <Route path="/linodes/*" element={<LinodeRouter />} />
          <Route path="/" element={<Navigate to="/linodes" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Main />
        </QueryClientProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}