import { extendTheme, StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      100: "#C8FBCB",
      200: "#94F7A3",
      300: "#5CE77F",
      400: "#33CF6B",
      500: "#00B050",
      600: "#009753",
      700: "#007E52",
      800: "#00664C",
      900: "#005448",
    }
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode(props.theme.semanticTokens.colors['chakra-body-bg']._light, 'rgb(14, 17, 19)')(props),
      },
    }),
  },
  components: {
    Tabs: {
      baseStyle: {
        tabpanel: {
          px: 0,
        }
      }
    },
    Card: {
      baseStyle: {
        header: {
          pb: 0,
        },
        footer: {
          pt: 0,
          justifyContent: 'flex-end',
        },
      }
    },
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
  },
});