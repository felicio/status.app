import type { ContactCodeAdvertisement } from '../proto/communities/v1/push_notifications'

export type UserPreview = {
  photo?: Uint8Array
  displayName: string
  description?: string
  // todo:
  emojiHash: string
  // fixme:
  socialUrls: any[]
  appUrl: string
  // todo:
  color: string
}

export function mapUserPreview(
  contactCodeAdvertisement: ContactCodeAdvertisement,
  userPublicKey: string,
): UserPreview {
  const { chatIdentity: identity } = contactCodeAdvertisement

  const userPreview: UserPreview = {
    photo: identity!.images.thumbnail?.payload,
    displayName: identity!.displayName,
    description: identity!.description,
    emojiHash: '👳🏽‍♀️🧜🏾‍♀️🐐👢👿📍🧑🏼‍🔬👨🏾‍⚕️👱🏽‍♂️⚓🪰🪝🌎💂🏿‍♀️',
    socialUrls: identity!.socialLinks,
    appUrl: `https://join.status.im?u=${userPublicKey}`,
    color: '#EAB700',
  }

  return userPreview
}
