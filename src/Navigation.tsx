import { HamburgerIcon } from '@chakra-ui/icons';
import { getGravatar, useProfile } from './queries/profile';
import { Link, useNavigate } from 'react-router-dom';
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
  MenuDivider
} from '@chakra-ui/react';

const entityLandingRoutes = [
  "Linodes",
  // "Volumes",
  // "Firewalls",
  // "Images",
  // "NodeBalancers",
  // "Kubernetes",
  // "Object Storage",
  // "StackScripts",
  // "Domains",
  // "Databases",
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
        <Heading
          as={Link}
          to="/"
          size="md"
          color="gray.800"
          _dark={{ color: 'white' }}
          display={{ base: 'none', md: "unset" }}
          letterSpacing="tighter"
          fontWeight="extrabold"
        >
          Cloud Manager
        </Heading>
        <Heading
          as={Link}
          to="/"
          size={{ base: 'xl', md: "lg" }}
        >
          ☁️
        </Heading>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='outline'
          />
          <MenuList>
            {entityLandingRoutes.map((entity) => (<MenuItem key={entity} onClick={() => navigate(`/${entity.toLowerCase()}`)}>{entity}</MenuItem>))}
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