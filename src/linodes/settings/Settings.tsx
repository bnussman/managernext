import { Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { useLinodeMutation } from "../../queries/linodes";
import { Linode } from "@linode/api-v4";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

interface Props {
  linode: Linode;
}

export function Settings({ linode }: Props) {
  const defaultValues = useMemo(() => {
    return { label: linode.label };
  }, [linode])

  const { register, reset, handleSubmit, formState: { isDirty } } = useForm({ defaultValues });
  const { mutateAsync, isLoading } = useLinodeMutation(linode.id);

  const toast = useToast();

  useEffect(() => {
    reset(defaultValues)
 }, [linode, reset])

  const onSubmit = handleSubmit((data) => {
    mutateAsync(data)
      .then(() => {
        toast({ title: "Successfully updated Linode", status: "success" })
      })
      .catch(() => {
        toast({ title: "Unable to update Linode", status: "error" })
      });
  });

  return (
    <Stack spacing={4}>
      <Card variant="outline">
        <form onSubmit={(onSubmit)}>
          <CardHeader>
            <Heading size="md">Linode Label </Heading>
          </CardHeader>
          <CardBody>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input {...register("label")} />
            </FormControl>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              isLoading={isLoading}
              isDisabled={!isDirty}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Stack>
  );
}