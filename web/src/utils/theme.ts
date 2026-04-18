import { alpha, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0A0B',
      paper: '#111113',
      light2: 'rgba(255, 255, 255, 0.02)',
      light4: 'rgba(255, 255, 255, 0.04)',
      light8: 'rgba(255, 255, 255, 0.06)',
      dark4: 'rgba(0, 0, 0, 0.04)',
      dark12: 'rgba(0, 0, 0, 0.12)',
      primary20: 'rgba(59, 130, 246, 0.15)',
    },
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F8FAFC',
      contrastText: '#0A0A0B',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
    },
    success: {
      main: '#34D399',
      light: '#6EE7B7',
    },
    warning: {
      main: '#FBBF24',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
    text: {
      primary: '#F0F0F3',
      secondary: '#6B7280',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.15,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.375rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.04em',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 400,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.15)',
    '0 2px 8px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.25)',
    '0 8px 32px rgba(0, 0, 0, 0.3)',
    ...Array(20).fill('none'),
  ] as any,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 20px',
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111113',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 16px 48px -12px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        disableScrollLock: true,
      },
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          },
        },
        paper: {
          borderRadius: 20,
          padding: '8px',
          backgroundImage: 'none',
          backgroundColor: '#141416',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px -12px rgba(0, 0, 0, 0.7)',
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: 'rgba(255, 255, 255, 0.3)',
          lineHeight: '32px',
        },
      },
    },
  },
});

declare module '@mui/material/styles' {
  interface TypeBackground {
    light2: string;
    light4: string;
    light8: string;
    dark4: string;
    dark12: string;
    primary20: string;
  }
}

export default theme;
