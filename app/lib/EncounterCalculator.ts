import Fraction from 'fraction.js'
import multipliers from './multipliers.json'
import Big from 'big.js'
import {calculateOccurrences} from "@/app/utils";
import {median} from "simple-statistics"
import {INITIAL_PARTY_LEVEL} from "@/app/lib/PartyLevelOptions";
/**
 * EncounterCalculator.js
 *
 * This utility class calculates the difficulty of a Dungeons & Dragons encounter in real-time
 * by listening to events emitted from instances of the `Party` and `Encounter` classes. It uses
 * predetermined Power values associated with Challenge Ratings (CR) and player levels, as well as
 * scale multipliers, to generate a final difficulty percentage.
 *
 * @author DragnaCarta
 */

/**
 * # EncounterCalculator Class Specification
 *
 * ## Overview
 * The `EncounterCalculator` class is responsible for determining the difficulty of an encounter,
 * taking into account the Powers of enemies, allies, and party members. The class subscribes to
 * events emitted by instances of `Party` and `Encounter` classes to update the difficulty in real-time.
 *
 * ## Properties
 * - **party**: A reference to the current Party object.
 * - **encounter**: A reference to the current Encounter object.
 * - **difficulty**: A read-only number representing the calculated encounter difficulty.
 *
 * ## Methods
 * ### constructor(party: Party, encounter: Encounter)
 * Initializes the EncounterCalculator with references to a Party and an Encounter object. Sets up event
 * listeners for both.
 *
 * ### recalculateDifficulty(): void
 * Recalculates the encounter difficulty based on the most recent state of the Party and Encounter objects.
 * Updates the `difficulty` property.
 *
 * ### getDifficulty(): number
 * Retrieves the current calculated difficulty.
 *
 * ## Events
 * ### onDifficultyChanged
 * Fired when the calculated difficulty changes. Listeners will receive the new difficulty.
 *
 * ## Usage Example
 * ```javascript
 * const party = new Party(4, 5);
 * const encounter = new Encounter();
 * const calculator = new EncounterCalculator(party, encounter);
 *
 * encounter.addEnemy('1');
 * // calculator.recalculateDifficulty() is automatically called
 * // calculator.onDifficultyChanged is automatically fired
 * ```
 */

/**
 * EncounterCalculator
 *
 * A utility class for calculating the difficulty of a Dungeons & Dragons encounter.
 * Listens to events emitted by Party and Encounter instances.
 *
 * @author DragnaCarta
 */
class EncounterCalculator {
  /**
   * Lookup table mapping player levels to their corresponding Power values.
   * Power values are based on a pre-determined formula or dataset that evaluates
   * the offensive and defensive capabilities of a player at a given level.
   *
   * @type {Object}
   */
  static LevelPowerLookup: Record<number, number> = {
    1: 9,
    2: 13,
    3: 16,
    4: 20,
    5: 31,
    6: 35,
    7: 38,
    8: 44,
    9: 52,
    10: 56,
    11: 65,
    12: 71,
    13: 79,
    14: 82,
    15: 91,
    16: 95,
    17: 109,
    18: 128,
    19: 136,
    20: 150,
  }

  /**
   * Lookup table mapping Challenge Ratings (CR) to their corresponding Power values.
   * Power values are based on a pre-determined formula or dataset that evaluates
   * the offensive and defensive capabilities of a creature with a given CR.
   *
   * @type {Object}
   */
  static CRPowerLookup: Record<number, number> = {
    0: 1,
    0.125: 5,
    0.25: 9,
    0.5: 13,
    1: 20,
    2: 26,
    3: 35,
    4: 46,
    5: 58,
    6: 66,
    7: 74,
    8: 90,
    9: 98,
    10: 111,
    11: 125,
    12: 135,
    13: 150,
    14: 160,
    15: 170,
    16: 187,
    17: 215,
    18: 226,
    19: 237,
    20: 259,
    21: 302,
    22: 336,
    23: 371,
    24: 405,
    25: 454,
    26: 489,
    27: 541,
    28: 577,
    29: 613,
    30: 669,
  }

  // Utility function to calculate total enemy power based on enemy CR occurrences
  static calculateTotalPower(
      {creatureOccurrences, powerTable} :
      {creatureOccurrences: Record<number, number>, powerTable: Record<number, number>}): number {
    let totalEnemyPower = 0;

    Object.keys(creatureOccurrences).forEach(function (cr) {
      const enemyChallengeRating = parseFloat(cr); // Convert CR to number
      const enemiesWithChallengeRating = creatureOccurrences[enemyChallengeRating]; // Number of enemies with that CR
      const enemyPower = powerTable[enemyChallengeRating]; // Get the power of this CR

      // const closestRatio = _findClosestRatio(ratio, EncounterCalculator.RatioScaleLookup);
      // const scaleMultiplier = EncounterCalculator.RatioScaleLookup[closestRatio];

      // Add to total power by multiplying enemy power with the count of enemies of that CR
      totalEnemyPower += enemyPower * enemiesWithChallengeRating;
    });

    return totalEnemyPower;
  }


  /**
   * Recalculates the encounter difficulty based on current Party and Encounter states.
   */
  recalculateDifficulty(
      {
        enemyChallengeRatings,
        allyChallengeRatings,
        partyLevels,
        accountForPowerDecay
      } : {
        enemyChallengeRatings: number[],
        allyChallengeRatings: number[],
        partyLevels: number[],
        accountForPowerDecay: boolean
      } ) {
    // Step 1: Scale the Power of each enemy and each ally.
    let totalEnemyPower: number
    let totalAllyPower: number
    let totalPartyPower: number

    const enemyCrOccurrences = calculateOccurrences(enemyChallengeRatings)

    const allyCrOccurrences = calculateOccurrences(allyChallengeRatings)

    const partyLevelOccurrences = calculateOccurrences(partyLevels)

    // Assuming CRPowerLookup, LevelPowerLookup, and RatioScaleLookup are your lookup tables
    totalEnemyPower = EncounterCalculator.calculateTotalPower({creatureOccurrences: enemyCrOccurrences,
      powerTable: EncounterCalculator.CRPowerLookup})

    totalAllyPower = EncounterCalculator.calculateTotalPower({creatureOccurrences: allyCrOccurrences,
      powerTable: EncounterCalculator.CRPowerLookup})

    totalPartyPower = EncounterCalculator.calculateTotalPower({creatureOccurrences: partyLevelOccurrences,
      powerTable: EncounterCalculator.LevelPowerLookup})


    const maxCr = enemyChallengeRatings.reduce(
        (max, cr) => Math.max(max, cr),
        0
    )

    let multiplier: Big
    if (totalPartyPower + totalAllyPower !== 0) {
      const medianPartyLevel = Math.ceil(median(partyLevels))
      multiplier = this.getMultiplier(medianPartyLevel, maxCr)
    } else {
      multiplier = Big(1)
    }

    const bigTotalPartyPower = (accountForPowerDecay ? multiplier : Big(1)).times(Big(totalPartyPower))

    let totalFriendlyPower = bigTotalPartyPower.plus(Big(totalAllyPower))


    // Step 3: Calculate difficulty.
    // These are the same things?
    // const hpLost = Math.round(100 * Math. pow(totalEnemyPower / totalPartyAndAllyPower, 2));
    // const resourcesSpent = Math.round(0.67 * hpLost);

    // const difficulty = Math.round(100 * Math.pow(totalEnemyPower / totalPartyAndAllyPower, 2));

    const difficulty =
        (totalFriendlyPower.eq(0) ? 0 : Big(totalEnemyPower)
      .div(
          totalFriendlyPower
      )
      .pow(2)
      .times(100)
      .toNumber())

    ///////////
    const difficultyLevels: {
      max: number
      label: string
    }[] = [
      { max: 20, label: 'Mild' },
      { max: 40, label: 'Bruising' },
      { max: 60, label: 'Bloody' },
      { max: 80, label: 'Brutal' },
      { max: 100, label: 'Oppressive' },
      { max: 130, label: 'Overwhelming' },
      { max: 170, label: 'Crushing' },
      { max: 250, label: 'Devastating' },
      { max: Infinity, label: 'Impossible' },
    ]

    const hpLost = difficulty
    const resourcesSpent = Math.round(0.67 * hpLost)
    const encounterDifficulty =
      difficultyLevels.find((level) => hpLost <= level.max)?.label || 'Unknown'

    //
    return {
      hpLost,
      resourcesSpent,
      encounterDifficulty,
      multiplier: multiplier.toNumber(),
    }
  }
  // Function to retrieve the power multiplier based on player level and highest CR
  private getMultiplier(medianPlayerLevel: number, highestCr: number): Big {
    const highestCrFraction = new Fraction(highestCr).toFraction(true)
    const crKey = highestCrFraction // Construct the CR key as it appears in the dictionary

    const levels: any = (multipliers as any)[crKey]

    if (!levels) {
      throw new Error('Invalid CR provided.')
    }

    const multiplier = levels[medianPlayerLevel]
    if (multiplier === undefined) {
      throw new Error('Invalid player level provided.')
    }
    return Big(multiplier)
  }
}

/**
 * Finds the closest ratio in a given ratio table and returns the corresponding multiplier.
 *
 * @param {number} targetRatio - The ratio to find the closest match for.
 * @param {Array<{ratio: number, multiplier: number}>} ratioTable - The table of predefined ratios and their multipliers.
 * @returns {number} - The multiplier corresponding to the closest ratio found.
 */
const _findClosestRatio = function (
  targetRatio: number,
  ratioTable: { ratio: number; multiplier: number }[]
) {
  // Validate that the ratioTable is not empty.
  if (ratioTable.length === 0) {
    throw new Error('The ratioTable must not be empty.')
  }

  // Initialize variables to track the closest ratio and its corresponding multiplier.
  let closestRatio = ratioTable[0].ratio
  let closestMultiplier = ratioTable[0].multiplier
  let smallestDifference = Math.abs(targetRatio - closestRatio)

  // Loop through each entry in the ratioTable to find the closest ratio.
  for (const { ratio, multiplier } of ratioTable) {
    const difference = Math.abs(targetRatio - ratio)

    // Update the closest values if a closer ratio is found.
    if (difference < smallestDifference) {
      closestRatio = ratio
      closestMultiplier = multiplier
      smallestDifference = difference
    }
  }

  return closestMultiplier
}

export default EncounterCalculator
