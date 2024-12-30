/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Input, type InputProps } from '@headlessui/react';

type NumericInputProps = InputProps & {
  onChange: (value: number) => void;
  value: number;
  digits: number;
  unitSuffix?: string;
};

function stripSuffix(value: string, suffix: string) {
  if (value.endsWith(suffix)) return value.substring(0, value.length - suffix.length);
  return value;
}

export default function NumericInput({ value, digits, onChange, unitSuffix, ...props }: NumericInputProps) {
  const [valueStr, setValueStr] = useState('');

  useEffect(() => {
    setValueStr((oldValueStr) => {
      const oldToFixed = parseFloat(stripSuffix(oldValueStr, unitSuffix || '')).toFixed(digits);
      const newToFixed = value.toFixed(digits);
      return oldToFixed === newToFixed ? oldValueStr : newToFixed + (unitSuffix || '');
    });
  }, [value, digits, unitSuffix]);

  const handleMemo = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (unitSuffix !== undefined && !event.target.value.endsWith(unitSuffix)) {
        event.preventDefault();
        return;
      }
      setValueStr(event.target.value);
      const newValue = parseFloat(event.target.value);
      if (!Number.isNaN(newValue)) onChange(newValue);
    },
    [onChange, unitSuffix],
  );

  return <Input value={valueStr} onChange={handleMemo} {...props} />;
}
