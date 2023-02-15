import { Button, Card, CardBody, FormControl, FormErrorMessage, FormLabel, Heading, HStack, Input, Select, Spacer, Stack, useToast } from "@chakra-ui/react";
import { CreateLinodeRequest } from "@linode/api-v4";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useImagesQuery } from "../queries/images";
import { useCreateLinodeMutation, useLinodeTypesQuery } from "../queries/linodes";
import { useRegionsQuery } from "../queries/regions";
import { getErrorFor, hasErrorFor } from "../utils/errors";

export function Create() {
  const { mutateAsync, error, isLoading } = useCreateLinodeMutation();
  const { handleSubmit, register } = useForm<CreateLinodeRequest>();
  const { data: images } = useImagesQuery();
  const { data: regions } = useRegionsQuery();
  const { data: types } = useLinodeTypesQuery();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = (data: CreateLinodeRequest) => {
    mutateAsync(data).then((linode) => {
      toast({ title: `Successfully created linode`, status: "success" });
      navigate(`/linodes/${linode.id}`);
    })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="lg" letterSpacing="tight" mb={4}>Create Linode</Heading>
      <Card variant="outline">
        <CardBody>
          <Stack spacing={4}>
            <FormControl isInvalid={hasErrorFor('label', error)}>
              <FormLabel>Label</FormLabel>
              <Input {...register('label')} />
              <FormErrorMessage>
                {getErrorFor('label', error)}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={hasErrorFor('image', error)}>
              <FormLabel>Image</FormLabel>
              <Select placeholder='Select Image' {...register("image")}>
                {images?.data.map((image) => (
                  <option key={image.id} value={image.id}>{image.label}</option>
                ))}
              </Select>
              <FormErrorMessage>
                {getErrorFor('image', error)}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={hasErrorFor('region', error)}>
              <FormLabel>Region</FormLabel>
              <Select placeholder='Select Region' {...register("region")}>
                {regions?.data.map((region) => (
                  <option key={region.id} value={region.id}>{region.id}</option>
                ))}
              </Select>
              <FormErrorMessage>
                {getErrorFor('region', error)}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={hasErrorFor('type', error)}>
              <FormLabel>Plan</FormLabel>
              <Select placeholder='Select Plan' {...register("type")}>
                {types?.data.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </Select>
              <FormErrorMessage>
                {getErrorFor('type', error)}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={hasErrorFor('root_pass', error)}>
              <FormLabel>Password</FormLabel>
              <Input type="password" {...register('root_pass')} />
              <FormErrorMessage>
                {getErrorFor('root_pass', error)}
              </FormErrorMessage>
            </FormControl>
            <HStack>
              <Spacer />
              <Button type="submit" isLoading={isLoading} colorScheme="blue">Create</Button>
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </form>
  );
}