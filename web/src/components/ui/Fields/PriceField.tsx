import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { InputAdornment, InputBase, type InputBaseProps, Stack, Typography, alpha } from '@mui/material';
import { formatMoneyWithoutCurrency, getCurrencySign, getSignLocation } from '@utils/currency';
import theme from '@utils/theme';
import React, { type ChangeEventHandler } from 'react';

const InputContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused?: boolean }>`
  display: flex;
  min-height: 44px;
  align-items: center;
  padding: 0 0.875rem;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid
    ${(props) => (props.isFocused ? alpha(theme.palette.primary.main, 0.6) : 'rgba(255, 255, 255, 0.06)')};
  transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: ${(props) =>
      props.isFocused ? alpha(theme.palette.primary.main, 0.6) : 'rgba(255, 255, 255, 0.12)'};
  }

  ${({ isFocused }) =>
    isFocused &&
    `
    background-color: rgba(255, 255, 255, 0.02);
    box-shadow: 0 0 0 3px ${alpha(theme.palette.primary.main, 0.08)};
  `}

  & > div {
    flex: 1;
  }

  input {
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.palette.text.primary};
    letter-spacing: -0.01em;
  }
`;

const Label = styled(Typography)`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${theme.palette.text.secondary};
  margin-bottom: 0.375rem;
`;

interface Props extends InputBaseProps {
  label?: string;
}

const PriceField: React.FC<Props> = ({ label, ...props }) => {
  const config = useConfig();
  const [isFocused, setIsFocused] = React.useState(false);

  const currencySignLocation = getSignLocation(config);
  const isLocationBefore = currencySignLocation === 'before';
  const currencySign = getCurrencySign(config);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    const formattedValue = formatMoneyWithoutCurrency(Number(value), config.general.language);

    if (!value) {
      props.onChange?.(event);
      return;
    }

    const formattedEvent = {
      ...event,
      target: { ...event.target, value: formattedValue },
    } as React.ChangeEvent<HTMLInputElement>;

    props.onChange?.(formattedEvent);
  };

  return (
    <Stack sx={{ width: '100%' }}>
      {label && <Label>{label}</Label>}
      <InputContainer isFocused={isFocused}>
        <InputBase
          {...props}
          value={props.value ?? ''}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          startAdornment={
            !isLocationBefore ? null : (
              <InputAdornment
                position='start'
                sx={{
                  '& p': {
                    fontWeight: 600,
                    color: alpha(theme.palette.primary.main, 0.7),
                    fontSize: '0.875rem',
                  },
                }}
              >
                {currencySign}
              </InputAdornment>
            )
          }
          endAdornment={
            isLocationBefore ? null : (
              <InputAdornment
                position='end'
                sx={{
                  '& p': {
                    fontWeight: 600,
                    color: alpha(theme.palette.primary.main, 0.7),
                    fontSize: '0.875rem',
                  },
                }}
              >
                {currencySign}
              </InputAdornment>
            )
          }
        />
      </InputContainer>
    </Stack>
  );
};

export default PriceField;
