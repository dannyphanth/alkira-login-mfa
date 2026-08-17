export type SiteStatus = 'Up' | 'Down'

export type Site = {
    id: string
    name: string
    region: string
    status: SiteStatus
}

export const siteRegions = ['us-west', 'us-east', 'eu-west', 'ap-southeast'] as const

export const siteStatuses: SiteStatus[] = ['Up', 'Down']

export const initialSites: Site[] = [
    { id: 'site-1', name: 'San Jose HQ', region: 'us-west', status: 'Up' },
    { id: 'site-2', name: 'New York office', region: 'us-east', status: 'Up' },
    { id: 'site-3', name: 'London office', region: 'eu-west', status: 'Down' },
    { id: 'site-4', name: 'Singapore office', region: 'ap-southeast', status: 'Up' },
]