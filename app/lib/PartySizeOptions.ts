import type { RadioOption } from '@/app/lib/types';

const PartySizeOptions: RadioOption[] = [];

/** Push simple values into array */
for (let i = 1; i <= 10; i++) {
  PartySizeOptions.push({ displayText: i.toString(), value: i });
}

export const INITIAL_PARTY_SIZE = 5;

export default PartySizeOptions;
