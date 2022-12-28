import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Linodes } from "./linodes/Linodes";
import { ChakraProvider, Container } from '@chakra-ui/react'
import { OAuth, useOAuth } from "./utils/OAuth";
import { Navigation } from "./Navigation";
import { theme } from "./utils/theme";

const queryClient = new QueryClient();

function Main() {
  const { isLoading } = useOAuth();

  return (
    <>
      {!isLoading && <Navigation />}
      <Container maxW="container.xl">
        <Routes>
          <Route path="/callback" element={<OAuth />} />
          {!isLoading && (
            <>
              <Route path="/linodes" element={<Linodes />} />
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