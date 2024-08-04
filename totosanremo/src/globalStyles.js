import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 8px; /* Rendi la scrollbar più sottile */
        }
        ::-webkit-scrollbar-track {
          background: #e0e0e0; /* Usa un colore di sfondo più chiaro */
        }
        ::-webkit-scrollbar-thumb {
          background: #bdbdbd; /* Usa un colore più chiaro per la thumb */
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9e9e9e; /* Un colore leggermente più scuro al passaggio del mouse */
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #bdbdbd #e0e0e0; /* Aggiorna i colori anche per Firefox */
        }
      `,
    },
  },
});

export default function GlobalStyles() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    </ThemeProvider>
  );
}

