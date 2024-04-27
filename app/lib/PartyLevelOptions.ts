import type { RadioOption } from '@/app/lib/types';

const PartyLevelOptions: RadioOption[] = [];

/** Push simple values into array */
for (let i = 1; i <= 20; i++) {
  PartyLevelOptions.push({ displayText: i.toString(), value: i });
}

export const INITIAL_PARTY_LEVEL = 1;

export default PartyLevelOptions;
