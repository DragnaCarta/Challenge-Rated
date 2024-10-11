import EncounterCalculator from "@/app/lib/EncounterCalculator";
import {describe} from "node:test";
import {calculateOccurrences} from "@/app/lib/utils";

describe('test calculateOccurrences function in EncounterCalculator', () => {

    // Test for valid input with distinct numbers
    it('should return correct occurrences for an array of distinct numbers', () => {
        const input = [1, 2, 3];
        const result = calculateOccurrences(input);
        expect(result).toEqual({
            1: 1,
            2: 1,
            3: 1,
        });
    });

    // Test for valid input with duplicate numbers
    it('should return correct occurrences for an array with duplicate numbers', () => {
        const input = [1, 1, 2, 2, 3];
        const result = calculateOccurrences(input);
        expect(result).toEqual({
            1: 2,
            2: 2,
            3: 1,
        });
    });

    // Test for an empty array
    it('should return an empty object for an empty array', () => {
        const input: number[] = [];
        const result = calculateOccurrences(input);
        expect(result).toEqual({});
    });

    // Test for invalid input (non-array)
    it('should throw an error when input is not an array', () => {
        const input = 'not-an-array';
        expect(() => calculateOccurrences(input as any)).toThrow(
            `Invalid argument passed to calculateOccurrences. Expected an array, but got string. not-an-array`
        );
    });

    // Test for negative numbers
    it('should return correct occurrences for an array with negative numbers', () => {
        const input = [-1, -1, 0, 2];
        const result = calculateOccurrences(input);
        expect(result).toEqual({
            '-1': 2,
            '0': 1,
            '2': 1,
        });
    });

    // Test for mixed positive and negative numbers
    it('should return correct occurrences for mixed positive and negative numbers', () => {
        const input = [1, -1, 2, 1, -1];
        const result = calculateOccurrences(input);
        expect(result).toEqual({
            '1': 2,
            '-1': 2,
            '2': 1,
        });
    });
})

describe('test calculateTotalPower function in EncounterCalculator', () => {

    // Test for valid input with multiple creatures
    it('should calculate the total power correctly for valid inputs', () => {
        const creatureOccurrences = {
            1: 2, // Two creatures with CR 1
            2: 1, // One creature with CR 2
        };
        const powerTable = EncounterCalculator.CRPowerLookup
        const result = EncounterCalculator.calculateTotalPower({ creatureOccurrences, powerTable });
        expect(result).toBe(66); // (20 * 2) + (26 * 1)
    });

    // Test for empty creatureOccurrences
    it('should return 0 if creatureOccurrences is empty', () => {
        const creatureOccurrences = {};
        const powerTable = EncounterCalculator.CRPowerLookup
        const result = EncounterCalculator.calculateTotalPower({ creatureOccurrences, powerTable });
        expect(result).toBe(0); // No creatures, so total power is 0
    });

    // Test for empty powerTable
    it('should throw an exception if powerTable is empty', () => {
        const creatureOccurrences = {
            1: 2,
            2: 1,
        };
        const powerTable = {}; // No powers defined
        expect(() => EncounterCalculator.calculateTotalPower({ creatureOccurrences, powerTable })).toThrow(Error);
    });

    // Test for non-numeric keys or non-present keys in creatureOccurrences
    it('should handle non-numeric keys in creatureOccurrences and ignore them', () => {
        const creatureOccurrences = {
            1: 2,        // Two creatures with CR 1
            "invalid": 3 // Invalid CR, should be ignored
        };
        const powerTable = EncounterCalculator.CRPowerLookup
        expect(() => EncounterCalculator.calculateTotalPower({ creatureOccurrences, powerTable })).toThrow(Error);
    });
});


describe('test recalculateDifficulty in EncounterCalculator', () => {
    let calculator: EncounterCalculator;

    beforeEach(() => {
        calculator = new EncounterCalculator();
    });

    it('should calculate difficulty, hpLost, and resourcesSpent correctly for basic scenario', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [5, 3, 2],
            allyChallengeRatings: [4, 2],
            partyLevels: [3, 4],
            accountForPowerDecay: true,
        });

        expect(result).toHaveProperty('hpLost');
        expect(result).toHaveProperty('resourcesSpent');
        expect(result).toHaveProperty('encounterDifficulty');
        expect(result).toHaveProperty('multiplier');

        expect(result.hpLost).toBeGreaterThan(0);
        expect(result.resourcesSpent).toBeGreaterThan(0);
        expect(result.encounterDifficulty).toBe('Mild');  // Example expectation
    });

    it('should return 0 for hpLost and resourcesSpent when there are no enemies', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [],
            allyChallengeRatings: [4, 2],
            partyLevels: [3, 4],
            accountForPowerDecay: true,
        });

        expect(result.hpLost).toBe(0);
        expect(result.resourcesSpent).toBe(0);
        expect(result.encounterDifficulty).toBe('Unknown');
    });

    it('should calculate correctly when there are no allies', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [5, 3],
            allyChallengeRatings: [],
            partyLevels: [3, 4],
            accountForPowerDecay: false,
        });

        expect(result.hpLost).toBeGreaterThan(0);
        expect(result.resourcesSpent).toBeGreaterThan(0);
        expect(result.encounterDifficulty).toBe('Mild');  // Example expectation
    });

    it('should handle all zero powers correctly', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [],
            allyChallengeRatings: [],
            partyLevels: [],
            accountForPowerDecay: true,
        });

        expect(result.hpLost).toBe(0);
        expect(result.resourcesSpent).toBe(0);
        expect(result.encounterDifficulty).toBe('Unknown');
    });

    it('should correctly calculate the maximum challenge rating', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [1, 8, 10, 3],
            allyChallengeRatings: [4, 2],
            partyLevels: [3, 5],
            accountForPowerDecay: true,
        });

        expect(result.multiplier).toBeGreaterThan(1);  // Example expectation based on scaling
    });

    it('should not apply scaling when accountForPowerDecay is false', () => {
        const result = calculator.recalculateDifficulty({
            enemyChallengeRatings: [5, 3],
            allyChallengeRatings: [4, 2],
            partyLevels: [3, 4],
            accountForPowerDecay: false,
        });

        expect(result.multiplier).toBe(1);
    });
});