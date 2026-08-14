import { useEffect, useState } from 'react'

/**
 * Pulls real activity from GitHub's PUBLIC API — no token, no cost.
 *
 * Rate limit is the constraint that shapes this hook: unauthenticated requests
 * are capped at 60/hour PER IP, shared across every visitor behind the same
 * NAT. A naive fetch-on-mount would exhaust that during any traffic spike and
 * show every later visitor an empty section. Hence the localStorage cache with
 * a TTL — a returning visitor costs zero requests.
 */

const GH_USER = 'caiodiniz-developer'
const CACHE_KEY = `gh:${GH_USER}:v1`
const TTL_MS = 60 * 60 * 1000   // 1 hour

export interface GhRepo {
  name: string
  description: string | null
  language: string | null
  stars: number
  url: string
  pushedAt: string
}

export interface GhDay {
  date: string
  count: number
  /** 0–4, GitHub's own intensity bucket */
  level: number
}

export interface GhData {
  followers: number
  publicRepos: number
  /** Top languages by repo count, most used first */
  languages: { name: string; count: number }[]
  topRepos: GhRepo[]
  /** Most recent push across all public repos, ISO string */
  lastPush: string | null
  /** Contribution calendar for the trailing year (may be empty if unavailable) */
  days: GhDay[]
  totalContributions: number
  /** Days with at least one contribution. Unlike a streak this never collapses
   *  to zero over a weekend, so it is a fair summary of continuous work. */
  activeDays: number
  longestStreak: number
}

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GhData }
  | { status: 'error' }

/** Longest run of consecutive contributing days, and how many days had any. */
function computeStreaks(days: GhDay[]): { activeDays: number; longest: number } {
  let longest = 0
  let run = 0
  let activeDays = 0

  for (const d of days) {
    if (d.count > 0) {
      run++
      activeDays++
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }

  return { activeDays, longest }
}

async function fetchGitHub(signal: AbortSignal): Promise<GhData> {
  const headers = { Accept: 'application/vnd.github+json' }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GH_USER}`, { headers, signal }),
    fetch(`https://api.github.com/users/${GH_USER}/repos?sort=pushed&per_page=100`, { headers, signal }),
  ])

  if (!userRes.ok || !reposRes.ok) throw new Error('github api')

  const user  = await userRes.json()
  const repos = await reposRes.json()

  const owned = (Array.isArray(repos) ? repos : []).filter(
    (r: { fork?: boolean; private?: boolean }) => !r.fork && !r.private
  )

  // Language tally
  const langCount = new Map<string, number>()
  for (const r of owned) {
    if (r.language) langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1)
  }
  const languages = [...langCount.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const topRepos: GhRepo[] = owned
    .slice()
    .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) =>
      b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map((r: Record<string, unknown>) => ({
      name:        r.name as string,
      description: (r.description as string) ?? null,
      language:    (r.language as string) ?? null,
      stars:       r.stargazers_count as number,
      url:         r.html_url as string,
      pushedAt:    r.pushed_at as string,
    }))

  const lastPush = owned.length
    ? owned.reduce((max: string, r: { pushed_at: string }) =>
        r.pushed_at > max ? r.pushed_at : max, owned[0].pushed_at)
    : null

  /* The contribution calendar is NOT in the REST API — it needs the GraphQL
     endpoint, which requires a token. This community mirror serves the same
     data as public JSON with CORS. It is a soft dependency: if it is down we
     still render everything else. */
  let days: GhDay[] = []
  let totalContributions = 0
  try {
    const cRes = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`,
      { signal }
    )
    if (cRes.ok) {
      const c = await cRes.json()
      days = (c.contributions ?? []) as GhDay[]
      totalContributions =
        typeof c.total === 'number'
          ? c.total
          : Object.values(c.total ?? {}).reduce((a: number, b) => a + (b as number), 0)
    }
  } catch {
    // calendar unavailable — the rest of the section still has value
  }

  const { activeDays, longest } = computeStreaks(days)

  return {
    followers:   user.followers ?? 0,
    publicRepos: user.public_repos ?? 0,
    languages,
    topRepos,
    lastPush,
    days,
    totalContributions,
    activeDays,
    longestStreak: longest,
  }
}

export function useGitHubActivity(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    // Serve from cache first so a returning visitor spends no rate limit.
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { at, data } = JSON.parse(raw)
        if (Date.now() - at < TTL_MS) {
          setState({ status: 'ready', data })
          return () => controller.abort()
        }
      }
    } catch {
      // corrupt or unavailable storage — just fetch
    }

    fetchGitHub(controller.signal)
      .then(data => {
        setState({ status: 'ready', data })
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
        } catch {
          // quota / private mode — cache is an optimisation, not a requirement
        }
      })
      .catch((e: unknown) => {
        if ((e as Error)?.name === 'AbortError') return
        setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [])

  return state
}

export { GH_USER }
