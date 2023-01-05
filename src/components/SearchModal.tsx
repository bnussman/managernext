import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  Kbd,
  HStack,
  Heading,
  Stack,
  Card,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useLinodesQuery } from "../queries/linodes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function SearchModal({ isOpen, onClose, onOpen }: Props) {
  const [query, setQuery] = useState<string>("");

  const enabled = query !== "";

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        onOpen();
      }
    });
  }, []);

  const { data, isLoading } = useLinodesQuery({}, { label: { '+contains': query }}, { enabled });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Heading size="md">Search</Heading>
            <Kbd>⌘ + k</Kbd>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2}>
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {data && data.results > 0 && enabled ? <Divider /> : null}
            {isLoading && enabled && (
              <Center><Spinner /></Center>
            )}
            {enabled && data?.data.map(l => (
              <Card p={2} variant="outline">
                {l.label}
              </Card>
            ))}
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}