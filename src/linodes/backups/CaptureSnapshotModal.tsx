import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useCaptureSnapshotMutation } from "../../queries/linodes";

interface Props {
  linodeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CaptureSnapshotModal({ isOpen, onClose, linodeId }: Props) {
  const { mutateAsync, isLoading } = useCaptureSnapshotMutation(linodeId);
  const { register, handleSubmit, formState: { isDirty } } = useForm({ defaultValues: { label: "" } });
  const toast = useToast();

  const onSubmit = handleSubmit(({ label }) => {
    mutateAsync({ label }).then(() => {
      onClose();
      toast({ title: 'Sucessfully started snapshot capture.', status: "success" });
    });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Capture Snapshot</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Label</FormLabel>
            <Input {...register('label')} />
            <FormHelperText>Provide a name for your snapshot</FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='brand'
            onClick={onSubmit}
            isLoading={isLoading}
            isDisabled={!isDirty}
          >
            Capture
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}