'use client'
import clsx from 'clsx'
import queryString from 'query-string'
import { useEffect, useState } from 'react'

import { CardBuildYourEncounter } from './components/CardBuildYourEncounter'
import EncounterCalculator from './lib/EncounterCalculator'
import { INITIAL_PARTY_SIZE } from './lib/PartySizeOptions'
import { INITIAL_PARTY_LEVEL } from './lib/PartyLevelOptions'
import { IconLinkExternal } from './ui/icons/IconLinkExternal'

const _encounterCalculator = new EncounterCalculator()

const powerToTextColor = [
  { max: 20, label: 'text-red-100' },
  { max: 40, label: 'text-red-200' },
  { max: 60, label: 'text-red-300' },
  { max: 80, label: 'text-red-400' },
  { max: 100, label: 'text-red-500' },
  { max: 130, label: 'text-red-600' },
  { max: 170, label: 'text-red-700' },
  { max: 250, label: 'text-red-800' },
  { max: Infinity, label: 'text-red-900' },
]

export default function Home({
  searchParams,
}: {
  searchParams:
    | {
        partySize?: string
        partyAverageLevel?: string
        enemies?: string
        allies?: string
      }
    | undefined
}) {
  const [partySize, setPartySize] = useState(
    searchParams?.partySize !== undefined
      ? Number(searchParams?.partySize)
      : INITIAL_PARTY_SIZE
  )
  const [partyAverageLevel, setPartyAverageLevel] = useState(
    searchParams?.partyAverageLevel !== undefined
      ? Number(searchParams?.partyAverageLevel)
      : INITIAL_PARTY_LEVEL
  )

  const [enemies, setEnemies] = useState<number[]>([])
  const [allies, setAllies] = useState<number[]>([])

  useEffect(() => {
    // Update URL
    if (
      partySize > 0 ||
      partyAverageLevel > 0 ||
      enemies.length > 0 ||
      allies.length > 0
    ) {
      const { protocol, host, pathname } = window.location
      const paramString = queryString.stringify(
        {
          partySize: partySize === 0 ? undefined : partySize,
          partyAverageLevel:
            partyAverageLevel === 0 ? undefined : partyAverageLevel,
          enemies,
          allies,
        },
        { arrayFormat: 'comma' }
      )

      const url = new URL(`${protocol}${host}${pathname}?${paramString}`)

      history.replaceState(null, '', url)
    } else {
      const { protocol, host, pathname } = window.location
      const url = new URL(`${protocol}${host}${pathname}`)

      history.replaceState(null, '', url)
    }
  }, [partySize, partyAverageLevel, enemies, allies])

  useEffect(() => {
    const search = searchParams
    if (search) {
      const parsedAllies =
        search.allies !== undefined && !Array.isArray(search.allies)
          ? search.allies.split(',')
          : []
      const parsedEnemies =
        search.enemies !== undefined && !Array.isArray(search.enemies)
          ? search.enemies.split(',')
          : []

      let allies: number[] = []
      let enemies: number[] = []

      allies = parsedAllies
        .filter((cr): cr is string => typeof cr === 'string')
        .map((cr: string) => parseFloat(cr as string))

      enemies = parsedEnemies
        .filter((cr): cr is string => typeof cr === 'string')
        .map((cr: string) => parseFloat(cr as string))

      const queryParams = {
        enemies,
        allies,
      }

      setEnemies(queryParams.enemies)
      setAllies(queryParams.allies)
    }
    // eslint-disable-next-line
  }, [])

  //
  const { hpLost, resourcesSpent, encounterDifficulty } =
    _encounterCalculator.recalculateDifficulty(
      partyAverageLevel,
      partySize,
      enemies,
      allies
    )

  function addCreature(challengeRating: number, creatureToggle: 0 | 1) {
    if (creatureToggle === 0) {
      setEnemies([...enemies, challengeRating])
    } else {
      setAllies([...allies, challengeRating])
    }
  }

  const textColor =
    powerToTextColor.find((ptc) => hpLost <= ptc.max)?.label ?? 'text-neutral'

  return (
    <section className="max-w-screen-md mx-auto">
      <div className="p-4">
        {/* <Banner /> */}
        <h1 className="text-3xl mt-6">Challenge Rated</h1>
        <p className="text-lg mt-4">
          An encounter-building tool for determining combat difficulty in
          Dungeons & Dragons 5th Edition Based on the{' '}
          <a
            href="https://www.gmbinder.com/share/-N4m46K77hpMVnh7upYa"
            target="_blank"
            rel="noreferrer"
            className="link link-accent inline-flex items-center gap-1"
          >
            Challenge Ratings 2.0
          </a>
          &nbsp;system developed by DragnaCarta.
        </p>
        <aside className="mt-10">
          <section>
            <CardBuildYourEncounter
              partySize={partySize}
              setPartySize={setPartySize}
              partyAverageLevel={partyAverageLevel}
              setPartyAverageLevel={setPartyAverageLevel}
              addCreature={addCreature}
              enemies={enemies}
              setEnemies={setEnemies}
              allies={allies}
              setAllies={setAllies}
            />
          </section>

          <section className="mt-10 mb-4 shadow-xl">
            <div className="stats w-full hidden md:inline-grid">
              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  Difficulty
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounterDifficulty}
                </p>
              </div>

              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  HP Loss
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {Number.isNaN(hpLost) ? 0 : Math.round(hpLost)}%
                </p>
              </div>
              <div className="stat">
                <p className="stat-title inline-flex items-center gap-2">
                  Resources Spent
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {Number.isNaN(resourcesSpent)
                    ? 0
                    : Math.round(resourcesSpent)}
                  %
                </p>
              </div>
            </div>

            <div className="join join-vertical w-full md:hidden">
              <div
                className="stat join-item bg-base-100 border-b border-base"
                style={{ borderBottomWidth: 1.5 }}
              >
                <p className="stat-title inline-flex items-center gap-2">
                  Difficulty
                </p>
                <p className={clsx('stat-value', textColor)}>
                  {encounterDifficulty}
                </p>
              </div>
              <div className="stats bg-base-100 join-item md:w-full border-base-content">
                <div className="stat">
                  <p className="stat-title inline-flex items-center gap-2">
                    HP Loss
                  </p>
                  <p className={clsx('stat-value', textColor)}>
                    {Number.isNaN(hpLost) ? 0 : Math.round(hpLost)}%
                  </p>
                </div>
                <div className="stat">
                  <p className="stat-title inline-flex items-center gap-2">
                    Resources Spent
                  </p>
                  <p className={clsx('stat-value', textColor)}>
                    {Number.isNaN(resourcesSpent)
                      ? 0
                      : Math.round(resourcesSpent)}
                    %
                  </p>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}
