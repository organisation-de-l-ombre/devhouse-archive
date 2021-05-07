import { Dispatch, SetStateAction, useCallback, useState } from "react";

export function useSwitcher(
  defaultValue = false
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  const [value, setValue] = useState(defaultValue);
  const swt = useCallback(() => setValue(!value), [value]);
  return [value, swt, setValue];
}
