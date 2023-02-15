import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';
import { getGravatar, useProfile } from './queries/profile';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Button,
  useColorMode,
  Heading,
  Flex,
  useColorModeValue,
  MenuDivider,
  MenuGroup,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchModal } from './components/SearchModal';

const items = [
  { title: "Compute", routes: ["Linodes", "Kubernetes"] },
  { title: "Network", routes: ["Firewalls", "Nodebalancers"] },
  { title: "Storage", routes: ["Databases", "Object Storage", "Volumes"] },
  { title: "Other", routes: ["Images", "StackScripts", "Domains"] },
];

export function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onLogout = () => {
    localStorage.clear();
    document.location.href = "https://login.linode.com/logout";
  };

  return (
    <Flex
      h={16}
      alignItems='center'
      justifyContent='space-between'
      px={4}
      mb={4}
      bg={useColorModeValue("rgba(255, 255, 255, 0.8)", "rgb(20, 24, 28, 0.9)")}
      borderBottom="1px"
      borderBottomColor={useColorModeValue("gray.100", "#32373e")}
      position="fixed"
      w="full"
      zIndex={999}
      css={{
        backdropFilter: 'blur(4px)',
      }}
    >
      <HStack spacing={2} alignItems='center'>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            mr={4}
          />
          <MenuList>
            {items.map(({ title, routes }, idx) => (
              <Fragment key={title}>
                <MenuGroup title={title}>
                  {routes.map(entity => (
                    <MenuItem key={entity} onClick={() => navigate(`/${entity.toLowerCase()}`)}>{entity}</MenuItem>
                  ))}
                </MenuGroup>
                {idx !== items.length - 1 && <MenuDivider />}
              </Fragment>
            ))}
          </MenuList>
        </Menu>
        <svg width={30} height={30} viewBox="0 0 108 108">
          <g>
            <path fill="#009CDE" d="M55.1,105.5c2.5,0.8,2.4,2.4-0.4,2.4c-29.8,0-54.1-24-54.1-53.6c0-29.6,24.2-53.6,54.1-53.6
		c2.8,0,3.4,1.5,1.1,2.2C33.4,9.3,17,29.9,17,54.3C17,78.4,33,98.8,55.1,105.5 M27.2,66.8c-0.1-1.4-0.2-2.9-0.2-4.4
		c0-23.5,19.1-42.6,42.6-42.6c22.2,0,28.9,9.9,29.7,9.3c0.9-0.7-8.1-20.4-34.2-20.4c-23.5,0-42.6,19.1-42.6,42.6
		c0,5.4,1,10.6,2.9,15.4C26.2,68.7,27.4,68.8,27.2,66.8 M45.1,36.1c11.1-4.8,25-5,38.6-0.2c9.2,3.2,14.5,7.8,14.9,7.6
		c0.7-0.3-5.3-9.9-16.3-14.1c-13.3-5-27.5-2.4-37.9,5.8C43.3,36.1,43.7,36.7,45.1,36.1"/>
          </g>
        </svg>
        <Heading
          as={Link}
          to="/"
          size="md"
          color="gray.800"
          _dark={{ color: 'white' }}
          display={{ base: 'none', md: "unset" }}
          letterSpacing="tight"
          fontWeight="extrabold"
        >
          Cloud Manager
        </Heading>
      </HStack>
      <HStack spacing={2}>
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          onClick={onOpen}
        />
        <Menu>
          <MenuButton as={Button} rightIcon={<Avatar src={getGravatar(profile?.email)} size="xs" />}>
            {profile?.username}
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuDivider />
            <MenuItem onClick={toggleColorMode} closeOnSelect={false}>
              {colorMode === 'light' ? "Dark Mode" : "Light Mode"}
            </MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <SearchModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </Flex>
  );
}