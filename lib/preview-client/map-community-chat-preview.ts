import type {
  CommunityChat,
  CommunityDescription,
} from '../proto/communities/v1/communities'

export type CommunityChatPreview = {
  emoji?: string
  displayName: string
  description: string
  appUrl: string
  color: string
  // todo?: use whole community
  community: {
    photo?: Uint8Array
    displayName: string
  }
}

// todo: less mouthful
export function mapCommunityChatPreview(
  communityChat: CommunityChat,
  communityDescription: CommunityDescription,
  communityPublicKey: string,
  communityChatUuid: string,
): CommunityChatPreview {
  const communityChatPreview: CommunityChatPreview = {
    emoji: communityChat.identity!.emoji,
    displayName: communityChat.identity!.displayName,
    description: communityChat.identity!.description,
    color: communityChat.identity!.color,
    appUrl: `https://join.status.im?c=${communityPublicKey}&cc=${communityChatUuid}`,
    community: {
      photo: communityDescription.identity!.images.thumbnail?.payload,
      displayName: communityDescription.identity!.displayName,
    },
  }

  return communityChatPreview
}
