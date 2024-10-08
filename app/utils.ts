import {RadioOption} from "@/app/lib/types";
import PartyLevelOptions from "@/app/lib/PartyLevelOptions";
import ChallengeRatingOptions from "@/app/lib/ChallengeRatingOptions";

export const ENEMY_CREATURE_TOGGLE = 0
export const ENEMY_CREATURE_TYPE = 'Enemy'
export const ALLY_CREATURE_TOGGLE = 1
export const ALLY_CREATURE_TYPE = 'Ally'
export const PLAYER_CREATURE_TOGGLE = 2
export const PLAYER_MEMBER_CREATURE_TYPE = 'Player'

export const UNKNOWN_CREATURE_TYPE = 'Unknown'


export function getCreatureType(creatureToggle: 0 | 1 | 2): string {
    switch (creatureToggle) {
        case ALLY_CREATURE_TOGGLE:
            return ALLY_CREATURE_TYPE;
        case ENEMY_CREATURE_TOGGLE:
            return ENEMY_CREATURE_TYPE;
        case PLAYER_CREATURE_TOGGLE:
            return PLAYER_MEMBER_CREATURE_TYPE;
        default:
            return UNKNOWN_CREATURE_TYPE;
    }
}


export function creatureHasCRorLevel(creatureToggle: 0 | 1 | 2): string {
    return getCreatureType(creatureToggle) === PLAYER_MEMBER_CREATURE_TYPE ? 'Level' : 'CR'
}


export function calculateOccurrences(challengeRatings: number[]): Record<number, number> {
    if (!Array.isArray(challengeRatings)) {
        throw new Error(`Invalid argument passed to calculateOccurrences. Expected an array, but got ${typeof challengeRatings}. ${challengeRatings}`);
    }
    return challengeRatings.reduce(function (
        acc: Record<number, number>,
        curr: number
    ) {
        acc[curr] ? ++acc[curr] : (acc[curr] = 1);
        return acc;
    }, {});
}
