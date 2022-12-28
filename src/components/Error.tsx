import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

export function Error() {
  return (
    <Alert
      status='error'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='200px'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        Unable to load Linodes
      </AlertTitle>
      <AlertDescription maxWidth='sm'>
        We were unable to load your linodes, please try again later.
      </AlertDescription>
    </Alert>
  );
}