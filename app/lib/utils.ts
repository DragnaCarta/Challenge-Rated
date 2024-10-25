import IntlMessageFormat from "intl-messageformat";

export const ENEMY_CREATURE_TOGGLE = 0
export const ENEMY_CREATURE_TYPE = 'Enemy'
export const ALLY_CREATURE_TOGGLE = 1
export const ALLY_CREATURE_TYPE = 'Ally'
export const PLAYER_CREATURE_TOGGLE = 2
export const PLAYER_MEMBER_CREATURE_TYPE = 'Player'

export const UNKNOWN_CREATURE_TYPE = 'Unknown'


export const WRONG_ARGUMENT_TYPE = new IntlMessageFormat(`Invalid argument passed to calculateOccurrences.` +
    ` Expected an array, but got {wrong_type}. {provided_object}`, 'en-US')
export const NO_ENTRY_IN_TABLE = new IntlMessageFormat('no entry for {variable_name} {variable_value} in {table_name}',
    'en-US')
export const INVALID_VALUE_PROVIDED = new IntlMessageFormat('Invalid {value_type} provided. {invalid_value} is not' +
    ' valid for {invalid_scope}', 'en-US')


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
        const error_msg = String(WRONG_ARGUMENT_TYPE.format({ wrong_type: typeof challengeRatings,
            provided_object: challengeRatings}))
        throw new TypeError(error_msg);
    }
    return challengeRatings.reduce(function (
        acc: Record<number, number>,
        curr: number
    ) {
        acc[curr] ? ++acc[curr] : (acc[curr] = 1);
        return acc;
    }, {});
}
