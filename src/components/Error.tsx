import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";

interface Props {
  title: string;
  message?: string;
}

export function Error({ title, message }: Props) {
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
        {title}
      </AlertTitle>
      {message && (
        <AlertDescription maxWidth='sm'>
          {message}
        </AlertDescription>
      )}
    </Alert>
  );
}