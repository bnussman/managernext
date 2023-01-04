import { InfoIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@chakra-ui/react";

export function NotFound() {
  return (
    <Alert
      status='info'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='300px'
      bg="none"
    >
      <InfoIcon boxSize='50px' />
      <AlertTitle mt={4} mb={4} fontSize='3xl'>
        Not Found
      </AlertTitle>
      <AlertDescription>
        This page is not found.
      </AlertDescription>
    </Alert>
  );
}