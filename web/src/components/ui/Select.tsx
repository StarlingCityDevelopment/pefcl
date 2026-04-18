import { useGlobalSettings } from '@hooks/useGlobalSettings';
import { ArrowDropDownRounded } from '@mui/icons-material';
import {
  Select as BaseSelect,
  type SelectProps as BaseSelectProps,
  Box,
  InputBase,
  Typography,
  alpha,
  styled,
} from '@mui/material';
import theme from '@utils/theme';
import React from 'react';

const InputContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused?: boolean }>(({ isFocused }) => ({
  display: 'flex',
  height: '44px',
  alignItems: 'center',
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${isFocused ? alpha(theme.palette.primary.main, 0.6) : 'rgba(255, 255, 255, 0.06)'}`,
  transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: isFocused ? alpha(theme.palette.primary.main, 0.6) : 'rgba(255, 255, 255, 0.12)',
  },
  ...(isFocused && {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)}`,
  }),
}));

const StyledSelect = styled(BaseSelect)(({ theme }) => ({
  '& .MuiSelect-select': {
    padding: '0 0.875rem',
    height: '44px !important',
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
}));

type SelectProps = BaseSelectProps<any> & {
  label?: string;
};

const Select = (props: SelectProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const { isMobile } = useGlobalSettings();

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {props.label && (
        <Typography
          variant='caption'
          sx={{
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'text.secondary',
            fontSize: '0.6875rem',
            mb: 0.25,
          }}
        >
          {props.label}
        </Typography>
      )}
      <InputContainer isFocused={isFocused}>
        <StyledSelect
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          input={<InputBase sx={{ width: '100%' }} />}
          IconComponent={(iconProps) => (
            <ArrowDropDownRounded
              {...iconProps}
              sx={{
                color: `${theme.palette.text.secondary} !important`,
                mr: 0.25,
                fontSize: '1.25rem',
                transition: 'transform 0.2s ease',
              }}
            />
          )}
          MenuProps={{
            disablePortal: isMobile,
            PaperProps: {
              sx: {
                bgcolor: '#141416',
                backgroundImage: 'none',
                mt: 0.75,
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 16px 48px -8px rgba(0, 0, 0, 0.6)',
                maxHeight: 280,
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(255, 255, 255, 0.12)',
                },
                '& .MuiMenuItem-root': {
                  fontSize: '0.8125rem',
                  py: 0.875,
                  borderRadius: '8px',
                  mx: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(59, 130, 246, 0.08)',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.12)' },
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.04)',
                  },
                },
              },
            },
          }}
        />
      </InputContainer>
    </Box>
  );
};

export default Select;
