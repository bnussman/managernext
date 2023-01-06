import { Alert, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertIcon, Button, useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { useRecycleClusterMutation } from "../queries/kubernetes";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  clusterId: number;
}

export function RecycleKubernetesClusterDialog({ isOpen, onClose, clusterId }: Props) {
  const toast = useToast();
  const cancelRef = useRef(null);

  const { mutateAsync, isLoading, error } = useRecycleClusterMutation(clusterId);

  const onRecycle = async () => {
    await mutateAsync();
    toast({ title: "Successfully recycled all cluster nodes", status: "success" });
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
            Recycle Kubernetes Cluster?
          </AlertDialogHeader>
          <AlertDialogBody>
            {error && (
              <Alert status='error' mb={4}>
                <AlertIcon />
                {error?.[0].reason}
              </Alert>
            )}
            Are you sure you want to recycle <b>all nodes</b> in this cluster?
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