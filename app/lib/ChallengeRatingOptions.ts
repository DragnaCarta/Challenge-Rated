import type { RadioOption } from '@/app/lib/types';

const ChallengeRatingOptions: RadioOption[] = [
  { displayText: '0', value: 0 },
  { displayText: '1/8', value: 0.125 },
  { displayText: '1/4', value: 0.25 },
  { displayText: '1/2', value: 0.5 },
];

/** Push simple values into array */
for (let i = 1; i <= 30; i++) {
  ChallengeRatingOptions.push({ displayText: i.toString(), value: i });
}

export default ChallengeRatingOptions;
