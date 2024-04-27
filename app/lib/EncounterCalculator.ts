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
   * Lookup table of scaling factors used to adjust the Power values of enemies and allies.
   * Each object contains a 'ratio' representing the ratio of enemy/ally power to party power,
   * and a 'multiplier' used to scale the Power of the enemies and allies in the encounter.
   *
   * @type {Array.<Object>}
   */
  static RatioScaleLookup = [
    {
      ratio: 6,
      multiplier: 1.4,
    } /* 3/14/24: I zero'd out the other ratios to remove overaggressive Power Decay scaling. I added this additional entry to handle cases in which E[DPR] OHKOs the target. This is a placeholder until I can do more precise calculations regarding power decay. -Dragna */,
    { ratio: 5, multiplier: 1 },
    { ratio: 2.5, multiplier: 1 },
    { ratio: 1.5, multiplier: 1 },
    { ratio: 1, multiplier: 1 },
    { ratio: 0.67, multiplier: 1 },
    { ratio: 0.4, multiplier: 1 },
    { ratio: 0.2, multiplier: 1 },
  ];

  /**
   * Lookup table mapping player levels to their corresponding Power values.
   * Power values are based on a pre-determined formula or dataset that evaluates
   * the offensive and defensive capabilities of a player at a given level.
   *
   * @type {Object}
   */
  static LevelPowerLookup: Record<number, number> = {
    1: 11,
    2: 14,
    3: 18,
    4: 23,
    5: 32,
    6: 35,
    7: 41,
    8: 44,
    9: 49,
    10: 53,
    11: 62,
    12: 68,
    13: 71,
    14: 74,
    15: 82,
    16: 84,
    17: 103,
    18: 119,
    19: 131,
    20: 141,
  };

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
    0.25: 10,
    0.5: 16,
    1: 22,
    2: 28,
    3: 37,
    4: 48,
    5: 60,
    6: 65,
    7: 70,
    8: 85,
    9: 85,
    10: 95,
    11: 105,
    12: 115,
    13: 120,
    14: 125,
    15: 130,
    16: 140,
    17: 150,
    18: 160,
    19: 165,
    20: 180,
    21: 200,
    22: 225,
    23: 250,
    24: 275,
    25: 300,
    26: 325,
    27: 350,
    28: 375,
    29: 400,
    30: 425,
  };

  /**
   * Recalculates the encounter difficulty based on current Party and Encounter states.
   *
   * @returns {void}
   */
  recalculateDifficulty(
    partyLevel: number,
    partySize: number,
    enemyChallengeRatings: number[],
    allyChallengeRatings: number[]
  ) {
    // Step 1: Scale the Power of each enemy and each ally.
    let totalEnemyPower = 0;
    let totalAllyPower = 0;

    const enemyCrOccurrences = enemyChallengeRatings.reduce(function (
      acc: Record<number, number>,
      curr
    ) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    },
    {});

    const allyCrOccurrences = allyChallengeRatings.reduce(function (
      acc: Record<number, number>,
      curr
    ) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    },
    {});

    // Assuming CRPowerLookup, LevelPowerLookup, and RatioScaleLookup are your lookup tables
    Object.keys(enemyCrOccurrences).forEach(function (cr) {
      const enemenyChallengeRating = parseFloat(cr);
      const enemiesWithChallengeRating =
        enemyCrOccurrences[enemenyChallengeRating];
      const enemyPower =
        EncounterCalculator.CRPowerLookup[enemenyChallengeRating];
      const ratio =
        enemyPower / EncounterCalculator.LevelPowerLookup[partyLevel];
      const closestRatioMultiplier = _findClosestRatio(
        ratio,
        EncounterCalculator.RatioScaleLookup
      );
      // const closestRatio = _findClosestRatio(ratio, EncounterCalculator.RatioScaleLookup);
      // const scaleMultiplier = EncounterCalculator.RatioScaleLookup[closestRatio];

      totalEnemyPower +=
        enemyPower * closestRatioMultiplier * enemiesWithChallengeRating;
    });

    Object.keys(allyCrOccurrences).forEach(function (cr) {
      const allyChallengeRating = parseFloat(cr);
      const alliesWithChallengeRating = allyCrOccurrences[allyChallengeRating];
      const allyPower = EncounterCalculator.CRPowerLookup[allyChallengeRating];
      const ratio =
        allyPower / EncounterCalculator.LevelPowerLookup[partyLevel];
      const closestRatioMultiplier = _findClosestRatio(
        ratio,
        EncounterCalculator.RatioScaleLookup
      );
      // const closestRatio = _findClosestRatio(ratio, EncounterCalculator.RatioScaleLookup);
      // const scaleMultiplier = EncounterCalculator.RatioScaleLookup[closestRatio];

      totalAllyPower +=
        allyPower * closestRatioMultiplier * alliesWithChallengeRating;
    });

    // Step 2: Calculate total player + ally Power.
    const partyPower =
      EncounterCalculator.LevelPowerLookup[partyLevel] * partySize;
    const totalPartyAndAllyPower = partyPower + totalAllyPower;

    // Step 3: Calculate difficulty.
    // These are the same things?
    // const hpLost = Math.round(100 * Math. pow(totalEnemyPower / totalPartyAndAllyPower, 2));
    // const resourcesSpent = Math.round(0.67 * hpLost);

    // const difficulty = Math.round(100 * Math.pow(totalEnemyPower / totalPartyAndAllyPower, 2));
    const difficulty = (totalEnemyPower / totalPartyAndAllyPower) ** 2 * 100;

    ///////////
    const difficultyLevels: {
      max: number;
      label: string;
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
    ];

    const hpLost = difficulty;
    const resourcesSpent = Math.round(0.67 * hpLost);
    const encounterDifficulty =
      difficultyLevels.find((level) => hpLost <= level.max)?.label || 'Unknown';

    //
    return {
      hpLost,
      resourcesSpent,
      encounterDifficulty,
    };
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
    throw new Error('The ratioTable must not be empty.');
  }

  // Initialize variables to track the closest ratio and its corresponding multiplier.
  let closestRatio = ratioTable[0].ratio;
  let closestMultiplier = ratioTable[0].multiplier;
  let smallestDifference = Math.abs(targetRatio - closestRatio);

  // Loop through each entry in the ratioTable to find the closest ratio.
  for (const { ratio, multiplier } of ratioTable) {
    const difference = Math.abs(targetRatio - ratio);

    // Update closest values if a closer ratio is found.
    if (difference < smallestDifference) {
      closestRatio = ratio;
      closestMultiplier = multiplier;
      smallestDifference = difference;
    }
  }

  return closestMultiplier;
};

export default EncounterCalculator;
