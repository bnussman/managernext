import { HamburgerIcon } from '@chakra-ui/icons';
import { getGravatar, useProfile } from './queries/profile';
import {
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Button,
  useColorMode
} from '@chakra-ui/react';

export function Navigation() {
  const { profile } = useProfile();
  const { colorMode, toggleColorMode } = useColorMode();

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
            <MenuItem>Linodes</MenuItem>
            <MenuItem>Volumes</MenuItem>
            <MenuItem>Firewalls</MenuItem>
            <MenuItem>Images</MenuItem>
            <MenuItem>NodeBalancers</MenuItem>
            <MenuItem>Kubernetes</MenuItem>
            <MenuItem>Object Storage</MenuItem>
            <MenuItem>StackScripts</MenuItem>
            <MenuItem>Domains</MenuItem>
            <MenuItem>Databases</MenuItem>
          </MenuList>
        </Menu>
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