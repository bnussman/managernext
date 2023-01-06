import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export function RecycleKubernetesClusterDialog({ isOpen, onClose }: Props) {
  const cancelRef = useRef(null);

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
            Are you sure you want to recycle <b>all nodes</b> in this cluster?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='brand' onClick={onClose} ml={3}>
              Recycle
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}