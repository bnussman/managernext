import { Alert, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, Button, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useRecycleNodePoolMutation } from "../queries/kubernetes";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  clusterId: number;
  nodePoolId: number | undefined;
}

export function RecycleNodePoolDialog({ isOpen, onClose, clusterId, nodePoolId }: Props) {
  const toast = useToast();
  const cancelRef = useRef(null);

  const { mutateAsync, isLoading, error } = useRecycleNodePoolMutation(clusterId, nodePoolId ?? -1);

  const onRecycle = async () => {
    await mutateAsync();
    toast({ title: `Successfully recycled all nodes in pool ${nodePoolId}`, status: "success" });
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
            Recycle Node Pool?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                {error?.[0].reason}
              </Alert>
            )}
            Are you sure you want to recycle <b>all nodes</b> in this pool?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={onRecycle} ml={3} isLoading={isLoading}>
              Recycle
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}