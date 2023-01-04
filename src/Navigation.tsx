import { HamburgerIcon } from '@chakra-ui/icons';
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
  MenuGroup
} from '@chakra-ui/react';

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
        backdropFilter: 'blur(2px)',
      }}
    >
      <HStack spacing={4} alignItems='center'>
        <svg width={30} height={30} enableBackground="new 0 0 191.6 229.8" viewBox="0 0 191.6 229.8" xmlns="http://www.w3.org/2000/svg"><path d="m191.6 101.7-31.8-17.6-26.9 16.4-.3 16.8-13.1-8.6-17.8 10.8-.8-18.3-18.2-12.3 17.5-9c-.1 0 0 1.7-2.6-60l-41.3-19.9-56.3 17.5 12.6 60.5 18.9 14.6-14.4 6.8 9.4 45.6 13.2 12.4-9.4 5.7 7.3 35.3 29.6 31.3c.1-.2 3.1-2.5 38.1-30.3l-1-24 15 12.7c.2-.2 3.2-2.4 30.7-24.3l1.1-17.7 11.3 7.9c.2-.2 2.8-2.2 24.9-19.8z" fill="#231f20" /><path d="m165.2 120.6 26.4-18.9-31.8-17.6-26.9 16.4z" /><path d="m162.3 154.1 2.9-33.5-32.3-20.1-.7 32.8z" fill="#004b16" /><path d="m119.2 188.2v-34.7l-32.6-24.8 2.6 34.2z" fill="#004b16" /><path d="m119.2 153.5 32.7-23.5-32.4-21.3-32.9 20z" /><path d="m67.1 229.7-5.2-35.5-31.7-31.1 7.3 35.3z" fill="#004b16" /><path d="m61.9 194.2 41.8-29.8-32.4-26.4-41.1 25.1z" /><path d="m59.2 175.8-6.9-47-35.3-29.4 9.5 45.6z" fill="#004b16" /><path d="m52.3 128.8 48.7-27.6-36.3-24.4-47.7 22.6z" /><path d="m49 106.4-9.4-64.3-39.6-24.6 12.6 60.5z" fill="#004b16" /><path d="m39.6 42.1 57.9-22.2-41.2-19.9-56.3 17.5z" /><g fill="#1cb35c"><path d="m187.2 134.3c-24.5 19.4-25 19.8-24.9 19.8 3-35.1 2.8-33.5 2.9-33.5 28-20 26.2-18.9 26.4-18.9z" /><path d="m149.9 164c-30.3 24.1-30.8 24.3-30.7 24.3-.3-36.4-.1-34.8 0-34.8 34.9-25 32.6-23.5 32.7-23.5z" /><path d="m105.2 199.5c-37.8 30.1-38.2 30.3-38.1 30.3-5.4-36.6-5.2-35.5-5.2-35.5 44.5-31.7 41.7-29.8 41.8-29.8z" /><path d="m97.5 19.9c2.7 61.8 2.4 60 2.6 60-50.1 26-51.2 26.5-51.1 26.5-9.6-65.7-9.6-64.3-9.4-64.3z" /><path d="m101 101.2c2 46.8 1.7 45.2 1.9 45.2-43.3 29.1-43.8 29.4-43.7 29.4-7-48.2-7-47-6.9-47z" /></g></svg>
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
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
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
      </HStack>
      <HStack spacing={2}>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? "🌙" : "☀️"}</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<Avatar src={getGravatar(profile?.email)} size="xs" />}>
            {profile?.username}
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
            <MenuDivider />
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}