
export function calculateOccurrences(challengeRatings: number[]): Record<number, number> {
    if (!Array.isArray(challengeRatings)) {
        throw new Error(`Invalid argument passed to calculateOccurrences. Expected an array, but got ${typeof challengeRatings}. ${challengeRatings}`);
    }
    return challengeRatings.reduce(function (
        acc: Record<number, number>,
        curr: number
    ) {
        return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
}
