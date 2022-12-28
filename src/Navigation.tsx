import { HamburgerIcon } from '@chakra-ui/icons';
import { getGravatar, useProfile } from './queries/profile';
import { useNavigate } from 'react-router-dom';
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
  Heading
} from '@chakra-ui/react';

const entityLandingRoutes = [
  "Linodes",
  "Volumes",
  "Firewalls",
  "Images",
  "NodeBalancers",
  "Kubernetes",
  "Object Storage",
  "StackScripts",
  "Domains",
  "Databases",
];

export function Navigation() {
  const { profile } = useProfile();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <HStack p={4} justifyContent="space-between">
      <HStack spacing={4}>
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
        <Heading size="md">Linode Cloud Manager ☁️</Heading>
      </HStack>
      <HStack>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? "🌑" : "☀️"}</Button>
        <Menu>
          <MenuButton as={Button} rightIcon={<Avatar src={getGravatar(profile?.email)} size="xs" />}>
            {profile?.username}
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Billing</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
}