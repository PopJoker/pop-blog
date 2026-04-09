// lib/github.ts
export async function getGitHubContributions(username: string) {
  // 修改 lib/github.ts 的 query 部分
  const query = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
        commitContributionsByRepository(maxRepositories: 3) {
          repository {
            name
          }
        }
      }
    }
  }
`

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
      // 因為是靜態導出，建議加上 revalidate 確保數據會更新
      next: { revalidate: 3600 },
    })

    const data = await response.json()
    return data.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return 0
  }
}
