import { Fragment, useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../utils/useSearch";
import { Waypoint } from "react-waypoint";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Kbd,
  HStack,
  Heading,
  Stack,
  Card,
  Spinner,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";

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

  const { pages, isLoading, canLoadMore, loadMore } = useSearch(query);

  const showSpinner = isLoading && enabled;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Heading size="md">Search</Heading>
            <Kbd>⌘ + k</Kbd>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={8}>
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
            {showSpinner && (
              <Center>
                <Spinner mt={2} />
              </Center>
            )}
            {pages.map(({ linodes, kubernetes }, idx) => (
              <Fragment key={`page-${idx}`}>
                {linodes.map((linode, idx) => (
                  <Card
                    key={`linode-${linode.id}`}
                    tabIndex={idx}
                    aria-label={`linode ${linode.label}`}
                    p={2}
                    variant="outline"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/linodes/${linode.id}`)
                        onClose();
                      }
                    }}
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
                ))}
                {kubernetes.map((cluster, idx) => (
                  <Card
                    key={`cluster-${cluster.id}`}
                    tabIndex={idx}
                    p={2}
                    variant="outline"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        navigate(`/kubernetes/${cluster.id}`)
                        onClose();
                      }
                    }}
                    onClick={() => {
                      navigate(`/kubernetes/${cluster.id}`)
                      onClose();
                    }}
                    cursor="pointer"
                    _hover={{ bgColor: 'gray.50' }}
                    _dark={{ _hover: { bgColor: "rgb(20, 24, 28)" } }}
                  >
                    {cluster.label}
                  </Card>
                ))}
              </Fragment>
            ))}
          </Stack>
          {canLoadMore && <Waypoint onEnter={loadMore} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}