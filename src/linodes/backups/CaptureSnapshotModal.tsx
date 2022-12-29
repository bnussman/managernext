import { Button, FormControl, FormHelperText, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useCaptureSnapshotMutation } from "../../queries/linodes";

interface Props {
  linodeId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function CaptureSnapshotModal({ isOpen, onClose, linodeId }: Props) {
  const { mutateAsync, isLoading } = useCaptureSnapshotMutation(linodeId);
  const [label, setLabel] = useState<string>("");
  const toast = useToast();

  const onSubmit = () => {
    mutateAsync({ label }).then(() => {
      onClose();
      toast({ title: 'Sucessfully started snapshot capture.'});
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Capture Snapshot</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Label</FormLabel>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <FormHelperText>Provide a name for your snapshot</FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            onClick={onSubmit}
            isLoading={isLoading}
            isDisabled={!label}
          >
            Capture
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}