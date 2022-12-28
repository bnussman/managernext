import { Column } from "../utils/useColumns";
import {
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Switch,
  HStack,
  Spacer
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  columns: Column<any>[];
  handleToggleColumnHidden: (key: string) => void;
}

export function ColumnModal({ isOpen, onClose, columns, handleToggleColumnHidden }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Table Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {columns.map((column) => (
            <HStack key={column.key as string}>
              <Text>{column.label}</Text>
              <Spacer />
              <Switch onChange={() => handleToggleColumnHidden(column.key as string)} isChecked={!column.hidden} />
            </HStack>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}