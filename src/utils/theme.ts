import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
      },
    }),
  },
  components: {
    Modal: {
      baseStyle: (props: StyleFunctionProps) => ({
        dialog: {
          bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
        }
      })
    },
    Menu: {
      baseStyle: (props: StyleFunctionProps) => ({
        list: {
          bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
        },
        item: {
          bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
          _hover: {
            bg: mode('rgb(245, 245, 245)', 'rgb(20, 24, 28)')(props),
          },
        },
      })
    },
    // Table: {
    //   parts: ['th', 'td'],
    //   baseStyle: {
    //     th: {
    //       border: 'none !important',
    //     },
    //     td: {
    //       border: 'none !important',
    //     },
    //   },
    // },
  },
});