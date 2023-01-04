import { Center, Spinner } from "@chakra-ui/react";

export function Loading() {
  return (
    <Center my={4}>
      <Spinner size="xl" />
    </Center>
  );
}