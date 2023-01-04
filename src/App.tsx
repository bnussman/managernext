import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, Container } from '@chakra-ui/react'
import { OAuth, useOAuth } from "./utils/OAuth";
import { Navigation } from "./Navigation";
import { theme } from "./utils/theme";
import { LinodeRouter } from "./linodes";
import { useEventsPollingQuery } from "./queries/events";
import { baseRequest } from "@linode/api-v4";
import { AxiosError } from "axios";
import { APIError } from "@linode/api-v4/lib/types";
import { NotFound } from "./components/NotFound";
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/700.css"

const normalizeErrors = (error: AxiosError<{ errors: APIError[] }>) => {
  const errors: APIError[] = error.response?.data?.errors ?? [
    { reason: "Unknown Error" },
  ];
  return Promise.reject(errors);
};

baseRequest.interceptors.response.use(undefined, normalizeErrors);

export const queryClient = new QueryClient();

function Main() {
  const { isLoading } = useOAuth();
  
  useEventsPollingQuery();

  return (
    <>
      {!isLoading && <Navigation />}
      <Container maxW="container.xl" pt={20}>
        <Routes>
          <Route path="/callback" element={<OAuth />} />
          {!isLoading && (
            <>
              <Route path="/linodes/*" element={<LinodeRouter />} />
              <Route path="/" element={<Navigate to="/linodes" />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
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