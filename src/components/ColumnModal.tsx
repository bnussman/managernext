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
  Spacer,
  Heading,
  Stack,
  Box,
} from "@chakra-ui/react";

interface Props {
  isOpen: boolean;
  compact: boolean;
  cardView: boolean;
  onClose: () => void;
  columns: Column<any>[];
  handleToggleColumnHidden: (key: string) => void;
  handleToggleCompact: () => void;
  handleToggleCardView: () => void;
}

export function ColumnModal({ isOpen, onClose, columns, handleToggleColumnHidden, handleToggleCompact, compact, cardView, handleToggleCardView }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Table Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Box>
              <Heading letterSpacing="sm" size="md">Table</Heading>
              <HStack>
                <Text>Compact</Text>
                <Spacer />
                <Switch onChange={handleToggleCompact} isChecked={compact} />
              </HStack>
              <HStack>
                <Text>Card View</Text>
                <Spacer />
                <Switch onChange={handleToggleCardView} isChecked={cardView} />
              </HStack>
            </Box>
            <Box>
              <Heading letterSpacing="sm" size="md">Columns</Heading>
              {columns.map((column) => (
                <HStack key={column.label}>
                  <Text>{column.label}</Text>
                  <Spacer />
                  <Switch onChange={() => handleToggleColumnHidden(column.key as string)} isChecked={!column.hidden} />
                </HStack>
              ))}
            </Box>
          </Stack>
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