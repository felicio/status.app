// todo: rename to link-preview-client.ts

import { bytesToHex } from 'ethereum-cryptography/utils'
import { Protocols } from 'js-waku'
import { createLightNode } from 'js-waku/lib/create_waku'
import { PeerDiscoveryStaticPeers } from 'js-waku/lib/peer_discovery_static_list'
import { waitForRemotePeer } from 'js-waku/lib/wait_for_remote_peer'
import { SymDecoder } from 'js-waku/lib/waku_message/version_1'

import { peers } from '../consts/peers'
import { CommunityDescription } from '../proto/communities/v1/communities'
import { ContactCodeAdvertisement } from '../proto/communities/v1/push_notifications'
import { ApplicationMetadataMessage } from '../protos/application-metadata-message'
import { ProtocolMessage } from '../protos/protocol-message'
import { generateKeyFromPassword } from '../utils/generate-key-from-password'
import { idToContentTopic } from '../utils/id-to-content-topic'
import { isClockValid } from '../utils/is-clock-valid'
import { payloadToId } from '../utils/payload-to-id'
import { recoverPublicKey } from '../utils/recover-public-key'
import { mapCommunityChatPreview } from './map-community-chat-preview'
import { mapCommunityPreview } from './map-community-preview'
import { mapUserPreview } from './map-user-preview'

import type { CommunityChatPreview } from './map-community-chat-preview'
import type { CommunityPreview } from './map-community-preview'
import type { UserPreview } from './map-user-preview'
import type { WakuLight } from 'js-waku/lib/interfaces'
import type { MessageV1 as WakuMessage } from 'js-waku/lib/waku_message/version_1'

export interface PreviewClientOptions {
  environment?: 'production' | 'test'
}

class PreviewClient {
  public waku: WakuLight
  /** Cache. */
  public readonly wakuMessages: Set<string>

  constructor(waku: WakuLight) {
    this.waku = waku
    this.wakuMessages = new Set()
  }

  static async start(options: PreviewClientOptions): Promise<PreviewClient> {
    const { environment = 'production' } = options

    let waku: WakuLight | undefined
    let previewClient: PreviewClient | undefined

    try {
      // Waku
      waku = await createLightNode({
        defaultBootstrap: false,
        // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        emitSelf: true,
        /**
         * Note: Delegated to `wakuDisconnectionTimer`.
         */
        pingKeepAlive: 0,
        /**
         * Note: Not supported in light mode.
         */
        relayKeepAlive: 0,
        libp2p: {
          peerDiscovery: [
            /**
             * >only connects to 1 remote node because of the limited number of nodes
             * >run by Status and the limited number of connections provided by these nodes
             * >
             * >@see https://forum.vac.dev/t/waku-v2-scalability-studies/142/2
             */
            new PeerDiscoveryStaticPeers(peers[environment], { maxPeers: 1 }),
          ],
        },
      })
      await waku.start()
      await waitForRemotePeer(waku, [Protocols.Store], 15 * 1000)

      // Preview Client
      previewClient = new PreviewClient(waku)
    } catch (error) {
      if (previewClient) {
        await previewClient.stop()
      } else if (waku) {
        await waku.stop()
      }

      throw error
    }

    return previewClient
  }

  public async stop() {
    await this.waku.stop()
  }

  public fetchCommunityPreview = async (): Promise<
    CommunityPreview | undefined
  > => {
    const publicKey =
      '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'

    const communityDescription = await this.fetchCommunityDescription(publicKey)

    if (!communityDescription) {
      return
    }

    const communityPreview = mapCommunityPreview(
      communityDescription,
      publicKey,
    )

    return communityPreview
  }

  public fetchCommunityChatPreview = async (): Promise<
    CommunityChatPreview | undefined
  > => {
    const publicKey =
      '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'

    const communityDescription = await this.fetchCommunityDescription(publicKey)

    if (!communityDescription) {
      return
    }

    // const uuid = '00d3f525-a0cf-4c40-832d-543ec9f8188b'
    const uuid = '30804ea7-bd66-4d5d-91eb-b2dcfe2515b3'
    const communityChat = communityDescription.chats[uuid]

    const communityChatPreview = mapCommunityChatPreview(
      communityChat,
      communityDescription,
      publicKey,
      uuid,
    )

    return communityChatPreview
  }

  public fetchUserPreview = async (): Promise<UserPreview | undefined> => {
    const publicKey =
      '0x0466382f82d00d7e75d8cec07b4f95040290a1727a6710bb4cca986f55311e15c018b89bc4888bbb3ba5a49c1da8288da58077f00a308e397cf30a30c645711a52'

    const contactCodeAdvertisement = await this.fetchContactCodeAdvertisement(
      publicKey,
    )

    if (!contactCodeAdvertisement) {
      return
    }

    const userPreview = mapUserPreview(contactCodeAdvertisement, publicKey)

    return userPreview
  }

  // todo: pass url
  // todo?: rename to fetchCommunityDetails/Info/Meta/Props
  private fetchCommunityDescription = async (
    publicKey: string,
  ): Promise<CommunityDescription | undefined> => {
    const contentTopic = idToContentTopic(publicKey)
    const symmetricKey = await generateKeyFromPassword(publicKey)

    let communityDescription: CommunityDescription | undefined = undefined
    await this.waku.store.queryOrderedCallback(
      [new SymDecoder(contentTopic, symmetricKey)],
      (wakuMessage) => {
        // handle
        const message = this.handleWakuMessage(wakuMessage)

        if (!message) {
          return
        }

        if (
          message.type !==
          ApplicationMetadataMessage.Type.TYPE_COMMUNITY_DESCRIPTION
        ) {
          return
        }

        // decode
        const decodedCommunityDescription = CommunityDescription.decode(
          message.payload,
        )

        // validate
        if (
          !isClockValid(
            BigInt(decodedCommunityDescription.clock),
            message.timestamp,
          )
        ) {
          return
        }

        // todo:
        // if (publicKey !== message.signerPublicKey) {
        //   return
        // }

        if (!communityDescription) {
          communityDescription = decodedCommunityDescription
        }

        // stop
        return true
      },
    )

    return communityDescription
  }

  private fetchContactCodeAdvertisement = async (
    publicKey: string,
  ): Promise<ContactCodeAdvertisement | undefined> => {
    const contentTopic = idToContentTopic(`${publicKey}-contact-code`)
    const symmetricKey = await generateKeyFromPassword(
      `${publicKey}-contact-code`,
    )

    let contactCodeAdvertisement: ContactCodeAdvertisement | undefined =
      undefined
    await this.waku.store.queryOrderedCallback(
      [new SymDecoder(contentTopic, symmetricKey)],
      (wakuMessage) => {
        // handle
        const message = this.handleWakuMessage(wakuMessage)

        if (!message) {
          return
        }

        if (
          message.type !==
          ApplicationMetadataMessage.Type.TYPE_CONTACT_CODE_ADVERTISEMENT
        ) {
          return
        }

        // decode
        const decodedContactCode = ContactCodeAdvertisement.decode(
          message.payload,
        )

        // validate
        if (!decodedContactCode.chatIdentity) {
          return
        }

        if (
          !isClockValid(
            BigInt(decodedContactCode.chatIdentity.clock),
            // todo: check
            wakuMessage.timestamp!,
          )
        ) {
          return
        }

        // todo: signerPublicKey !== urlPublicKey

        // todo: report js-waku abort logic
        if (!contactCodeAdvertisement) {
          contactCodeAdvertisement = decodedContactCode
        }

        // stop
        return true
      },
    )

    return contactCodeAdvertisement
  }

  private handleWakuMessage = (
    wakuMessage: WakuMessage,
  ):
    | {
        timestamp: Date
        signerPublicKey: string
        type: ApplicationMetadataMessage.Type
        payload: Uint8Array
      }
    | undefined => {
    // validate
    if (!wakuMessage.payload) {
      return
    }

    if (!wakuMessage.signaturePublicKey) {
      return
    }

    if (!wakuMessage.timestamp) {
      return
    }

    // decode (layers)
    let messageToDecode = wakuMessage.payload
    let decodedProtocol
    try {
      decodedProtocol = ProtocolMessage.decode(messageToDecode)
      if (decodedProtocol) {
        messageToDecode = decodedProtocol.publicMessage
      }
    } catch {
      // eslint-disable-next-line no-empty
    }

    const decodedMetadata = ApplicationMetadataMessage.decode(messageToDecode)
    if (!decodedMetadata.payload) {
      return
    }

    const signerPublicKeyBytes = recoverPublicKey(
      decodedMetadata.signature,
      decodedMetadata.payload,
    )

    const messageId = payloadToId(
      decodedProtocol?.publicMessage ?? wakuMessage.payload,
      signerPublicKeyBytes,
    )

    // already handled
    if (this.wakuMessages.has(messageId)) {
      return
    }

    this.wakuMessages.add(messageId)

    return {
      timestamp: wakuMessage.timestamp,
      signerPublicKey: `0x${bytesToHex(signerPublicKeyBytes)}`,
      type: decodedMetadata.type,
      payload: decodedMetadata.payload,
    }
  }
}

export async function createPreviewClient(
  options: PreviewClientOptions,
): Promise<PreviewClient> {
  const previewClient = await PreviewClient.start(options)

  return previewClient
}

export type { PreviewClient }
