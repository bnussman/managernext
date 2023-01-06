import { Alert, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, Button, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useDeleteNodePoolMutation } from "../queries/kubernetes";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  clusterId: number;
  nodePoolId: number | undefined;
}

export function DeleteNodePoolDialog({ isOpen, onClose, clusterId, nodePoolId }: Props) {
  const toast = useToast();
  const cancelRef = useRef(null);

  const { mutateAsync, isLoading, error } = useDeleteNodePoolMutation(clusterId, nodePoolId ?? -1);

  const onDelete = async () => {
    await mutateAsync();
    toast({ title: `Successfully deleted node pool ${nodePoolId}`, status: "success" });
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
            Delete Node Pool?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                {error?.[0].reason}
              </Alert>
            )}
            Are you sure you want to delete this node pool?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={onDelete} ml={3} isLoading={isLoading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}