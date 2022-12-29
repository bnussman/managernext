import { InfoIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertTitle } from "@chakra-ui/react";

interface Props {
  title: string;
  message?: string;
}

export function Empty({ title, message }: Props) {
  return (
    <Alert
      status='info'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='200px'
      bg="none"
    >
      <InfoIcon boxSize='30px' mr={0} />
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