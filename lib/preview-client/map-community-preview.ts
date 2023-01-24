// todo?: rename to map-commuinty-details and use in client.ts too

import { tags as tagsMap } from './tags'

import type { CommunityDescription } from '../proto/communities/v1/communities'

export type CommunityPreview = {
  // todo?: blob, string, base64, or url
  banner?: Uint8Array
  photo?: Uint8Array
  displayName: string
  description: string
  membersCount: number
  // todo?: url
  appUrl: string
  tags: Array<{
    emoji?: string
    text: string
  }>
  color: string
}

export function mapCommunityPreview(
  communityDescription: CommunityDescription,
  communityPublicKey: string,
): CommunityPreview {
  const { identity, tags, members } = communityDescription

  const communityPreview: CommunityPreview = {
    // todo: check `!` and `?`
    banner: identity!.images.banner?.payload,
    photo: identity!.images.thumbnail?.payload,
    displayName: identity!.displayName,
    description: identity!.description,
    membersCount: Object.keys(members).length,
    // todo: change domain
    // todo: params or path fragments
    appUrl: `https://join.status.im?c=${communityPublicKey}`,
    tags: tags.map((tag) => ({
      text: tag,
      emoji: tagsMap[tag as keyof typeof tagsMap],
    })),
    color: identity!.color,
  }

  return communityPreview
}
