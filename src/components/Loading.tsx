import { Center, Spinner } from "@chakra-ui/react";

export function Loading() {
  return (
    <Center mt={4}>
      <Spinner size="xl" />
    </Center>
  );
}