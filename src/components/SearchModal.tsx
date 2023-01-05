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
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useInfinateLinodesSearchQuery } from "../queries/linodes";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export function SearchModal({ isOpen, onClose, onOpen }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");

  const enabled = query !== "";

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        onOpen();
      }
    });
  }, []);

  const { data, isLoading } = useInfinateLinodesSearchQuery(query);

  const showSpinner = isLoading && enabled;
  const showDivider = (data && data.pages?.[0].results > 0 && enabled) || showSpinner;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
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
          <InputGroup>
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputRightElement>
                <IconButton
                  size='xs'
                  variant="ghost"
                  aria-label="Clear search query"
                  icon={<CloseIcon />}
                  onClick={() => setQuery("")}
                />
              </InputRightElement>
            </InputGroup>
            {showDivider && <Divider />}
            {showSpinner && (
              <Center>
                <Spinner />
              </Center>
            )}
            {data?.pages.map((page) => page.data.map(linode => (
              <Card
                p={2}
                variant="outline"
                onClick={() => {
                  navigate(`/linodes/${linode.id}`)
                  onClose();
                }}
                cursor="pointer"
                _hover={{ bgColor: 'gray.50' }}
                _dark={{ _hover: { bgColor: "rgb(20, 24, 28)" } }}
              >
                {linode.label}
              </Card>
            )))}
          </Stack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}