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
  Select,
  FormControl,
  FormLabel,
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
  order: 'asc' | 'desc' | undefined;
  orderBy: string | undefined;
  handleChangeOrder: (order: 'asc' | 'desc') => void;
  handleOrderBy: (key: string) => void;
  pageSize: number;
  handlePageSizeChange: (size: number) => void;
}

export function ColumnModal({ isOpen, onClose, columns, handleToggleColumnHidden, handleToggleCompact, compact, cardView, handleToggleCardView, order, orderBy, handleChangeOrder, handleOrderBy, pageSize, handlePageSizeChange }: Props) {
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
              <HStack>
                <FormControl>
                  <FormLabel>Order By</FormLabel>
                  <Select value={orderBy} onChange={(e) => handleOrderBy(e.target.value)}>
                    {columns.filter(c => c.filterable && Boolean(c.key)).map(c => <option value={c.key as string}>{c.label}</option>)}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Order</FormLabel>
                  <Select value={order} onChange={(e) => handleChangeOrder(e.target.value as 'asc' | 'desc')}>
                    <option value="asc">asc</option>
                    <option value="desc">desc</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Page Size</FormLabel>
                  <Select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={500}>500</option>
                  </Select>
                </FormControl>
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