import { Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Select, Spacer, Stack } from "@chakra-ui/react";
import { z } from 'zod';
import { createTsForm, useTsController } from '@ts-react/form';
import { ReactNode } from "react";

const mapping = [
  [z.string(), () => {
    const { field, error } = useTsController<string>();
    return (
      <FormControl isInvalid={!!error}>
        <FormLabel textTransform="capitalize">{field.name}</FormLabel>
        <Input ref={field.ref} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
        {Boolean(error) && (
          <FormErrorMessage>{error?.errorMessage}</FormErrorMessage>
        )}
      </FormControl>
    );
  }],
  [z.boolean(), Checkbox],
  [z.enum(["placeholder"]), Select],
] as const;

function FormComponent({ children, onSubmit }: { children: ReactNode, onSubmit: () => void }) {
  return (
    <form onSubmit={onSubmit}>
      <Stack>
        {children}
        <HStack>
          <Spacer />
          <Button type="submit">Submit</Button>
        </HStack>
      </Stack>
    </form>
  )
}

const Form = createTsForm(mapping, { FormComponent });

const CreateLinodeSchema = z.object({
  label: z.string().describe("Label"),
  password: z.string(),
});

export function Create() {

  const onSubmit = (data: z.infer<typeof CreateLinodeSchema>) => {
    console.log(data);
  };

  return (
    <Stack>
      <Heading>Create Linode</Heading>
      <Form
        schema={CreateLinodeSchema}
        onSubmit={onSubmit}
       />
    </Stack>
  );
}