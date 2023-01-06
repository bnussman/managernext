import { Alert, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, Button, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useRecycleNodeMutation } from "../queries/kubernetes";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  clusterId: number;
  nodeId: string | undefined;
}

export function RecycleNodeDialog({ isOpen, onClose, clusterId, nodeId }: Props) {
  const toast = useToast();
  const cancelRef = useRef(null);

  const { mutateAsync, isLoading, error } = useRecycleNodeMutation(clusterId, nodeId ?? "");

  const onRecycle = async () => {
    await mutateAsync();
    toast({ title: `Successfully recycled node ${nodeId}`, status: "success" });
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Recycle this node?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                {error?.[0].reason}
              </Alert>
            )}
            Are you sure you want to recycle this node?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='brand' onClick={onRecycle} ml={3} isLoading={isLoading}>
              Recycle
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}