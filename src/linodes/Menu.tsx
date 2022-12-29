import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton, Menu as ChakraMenu, MenuButton, MenuItem, MenuList, Portal, useToast } from "@chakra-ui/react";
import { Linode } from "@linode/api-v4";
import { MouseEventHandler } from "react";
import { useLinodeBootMutation, useLinodeShutdownMutation } from "../queries/linodes";

interface Props {
  linode: Linode;
  compact: boolean;
}

export function Menu({ linode, compact }: Props) {
  const toast = useToast();
  const { mutateAsync: shutdown } = useLinodeShutdownMutation(linode.id);
  const { mutateAsync: boot } = useLinodeBootMutation(linode.id);

  const onTogglePower: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (linode.status === 'running') {
      shutdown().then(() => toast({ title: 'Successfully shutdown Linode', status: 'success' }));
    }
    else {
      boot().then(() => toast({ title: 'Successfully booted Linode', status: 'success' }));
    }
  };

  return (
    <ChakraMenu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        size={compact ? "xs" : "sm"}
        p={0}
        onClick={e => e.stopPropagation()}
      />
      <Portal>
        <MenuList>
          <MenuItem onClick={onTogglePower}>
            {linode.status === "running" ? "Shut Down" : "Power On"}
          </MenuItem>
        </MenuList>
      </Portal>
    </ChakraMenu>
  );
}