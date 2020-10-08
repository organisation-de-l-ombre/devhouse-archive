import * as React from 'react';
import { sum } from '@website/common/src/index';

export const Sum = ({ a, b }: { a: number; b: number }) => {
  return <div>{sum(a, b)}</div>;
};