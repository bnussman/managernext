import { Box, BoxProps } from "@chakra-ui/react";

interface Props { 
  color: BoxProps['bgColor'];
}

export function Indicator({ color }: Props) {
  return <Box borderRadius="full" bgColor={color} w={4} h={4} />
}