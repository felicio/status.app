// import 'node:zlib'
import Error from 'next/error'
import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import {
  // createPreviewClient,
  decodeCommunityUrlData,
  decodeChannelUrlData,
  decodeUserUrlData,
  // fixme: `Module build failed: UnhandledSchemeError: Reading from "node:zlib" is not handled by plugins (Unhandled scheme).`
  // publicKeyToEmojiHash,
  // } from '../../node_modules/@status-im/js/packages/status-js/dist/index.es'
} from '@status-im/js'
// fixme: imports
//
// import { Paragraph } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'
// // import { Paragraph } from '@status-im/components'
// // import { Avatar } from '../../node_modules/@status-im/components/packages/components/dist/avatar/index'
// import { Button } from '../../node_modules/@status-im/components/packages/components/dist/button/index'
// import { Heading } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'
// import { Label } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'
//
import { Paragraph, Button, Heading, Label } from '@status-im/components'
// import { Paragraph } from '@status-im/components'
// import { Avatar } from '../../node_modules/@status-im/components/packages/components/dist/avatar/index'
// import { Button } from '../../node_modules/@status-im/components/packages/components/dist/button/index'
// import { Heading } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'
// import { Label } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'

// import { mockData } from '../../.data/mockData'

// const inter = Inter({ subsets: ['latin'] })

type ServerSideProps =
  | { errorCode: number }
  | {
      entity: string
      url: string
      now: string
      // todo?: verify optionality of the field with product
      // fixme: null isn't considered
      data: ReturnType<
        | typeof decodeCommunityUrlData
        | typeof decodeChannelUrlData
        | typeof decodeUserUrlData
      > | null
      // fixme?: worth showing data if corrupted
      corrupted?: boolean
    }

interface Query extends ParsedUrlQuery {
  entity: string
  slug: string[]
}

// todo?: handle requests for and provide images for adding the site to the home screen
// { entity: 'apple-touch-icon-precomposed.png' } /apple-touch-icon-precomposed.png
// { entity: 'apple-touch-icon.png' } /apple-touch-icon.png

const ERROR_CODES = {
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

const VALID_ROUTES = [
  'c', // community
  'cc', // community channel
  'u', // user
]

export const getServerSideProps: GetServerSideProps<
  ServerSideProps,
  Query
> = async (context) => {
  const { params, req, res } = context

  const entity = params!.entity

  if (!VALID_ROUTES.includes(entity)) {
    const props: ServerSideProps = { errorCode: ERROR_CODES.NOT_FOUND }

    return { props }
  }

  const url = new URL(
    `https://${req.headers.host}${req.url!.replaceAll(';', '')}`,
  )
  // note: used for debugging props and og image cache
  const now = new Date().toUTCString()
  const encodedData = url.searchParams.get('d')

  let decodedData
  try {
    switch (entity) {
      case 'c':
        decodedData = decodeCommunityUrlData(encodedData)

        break

      case 'cc':
        decodedData = decodeChannelUrlData(encodedData)

        break

      case 'u':
        decodedData = decodeUserUrlData(encodedData)

        break
    }
  } catch (error) {
    console.error(error)
  }

  const props: ServerSideProps = {
    entity,
    url: url.toString(),
    now,
    data: decodedData || null,
  }

  // todo: set s-maxage according to if waku returned within; no longer relevant
  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=180, stale-while-revalidate=239',
    // 'public, max-age=0, s-maxage=1, stale-while-revalidate=900',
    // 'public, max-age=0, s-maxage=600, stale-while-revalidate=900',
    // 'public, s-maxage=10, stale-while-revalidate=59',
    // 'public, max-age=31536000, immutable',
  )

  return { props }
}

// todo?: rename to entity, preview, orverview, or else
export default function Preview(props: ServerSideProps) {
  // todo: set decoded data
  // todo: set loading state
  // todo: set valid/invalid/outdated data comparison state
  const [publicKey, setPublicKey] = useState<string>()
  // todo: stop client
  // const [client, setClient] = useState<any>()
  const [community, setCommunity] = useState(!isError(props) && props.data)
  const [channel, setChannel] = useState(!isError(props) && props.data)
  const [user, setUser] = useState(!isError(props) && props.data)

  useEffect(() => {
    // todo?: extend spec for more than just public key after #
    // todo?: OR signature
    const publicKey = window.location.hash.replace('#', '')

    setPublicKey(publicKey)
  }, [])

  // useEffect(() => {
  //   // todo: set env
  //   // todo: select peers by reagion or use disovery?
  //   createPreviewClient({
  //     environment: 'test',
  //   })
  //     .then((client) => {
  //       setClient(client)
  //     })
  //     .catch((err) => {
  //       // todo: handle
  //       console.error(err)
  //     })
  // }, [])

  // useEffect(() => {
  //   if (client) {
  //     switch (props.entity) {
  //       case 'c': {
  //         client.fetchCommunityPreview('').then((community) => {
  //           // todo: compare decoded data and set comparison state
  //           // todo?: cache response
  //           setCommunity(community)
  //         })
  //         break
  //       }

  //       case 'cc': {
  //         client.fetchChannelPreview('').then((channel) => {
  //           setChannel(channel)
  //         })

  //         break
  //       }

  //       case 'u': {
  //         client.fetchUserPreview('').then((user) => {
  //           setUser(user)
  //         })

  //         break
  //       }
  //     }
  //   }
  // }, [])

  if (isError(props)) {
    // todo: check error code
    // todo?: return some <Head> too
    return <Error statusCode={404} />
  }

  const { entity, url, now: nowProp } = props

  // fixme!:
  const searchParams = new URL(url).searchParams.toString()
  // const now = new Date().toUTCString()

  // todo: parse, validate and decode url
  // todo: verify checksum
  // todo?!: resolve ENS with chat key records; or just past through
  // todo: set constrains on url data
  // todo: decoded url data againts schema

  const renderEntity = () => {
    // todo?: switch entities or have seperate routes instead */
    switch (entity) {
      case 'c':
        return (
          // todo: loading otherwise
          community && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* todo: banner */}
              {/* <Avatar
                // src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
                // src=""
                src={null}
                size={56}
              /> */}
              <Heading>{community.displayName}</Heading>
              <Paragraph>{community.description}</Paragraph>
              {/* todo?: add to desings */}
              <Paragraph>{publicKey}</Paragraph>
              <div>
                {/* todo: icons */}
                <Label>{community.membersCount}</Label>
              </div>
              {/* todo: tags */}
              <Button>View community</Button>
              <div>
                <Paragraph>Community in</Paragraph>
                {/* todo: icon */}
                <Paragraph>Status</Paragraph>
              </div>
              {/* todo: download dialog */}
              {/* todo: download QR */}
              <Button>Download Status</Button>
            </div>
          )
        )

      case 'cc':
        return (
          channel && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* todo: banner placeholder */}
              {/* todo: avatar */}
              <Heading># {channel.displayName}</Heading>
              <Paragraph>{channel.description}</Paragraph>
              {/* todo: indicate that it's community's */}
              <Paragraph>{publicKey}</Paragraph>
              {/* todo: tags */}
              <Button># View channel</Button>
              <div>
                <Paragraph>Channel in</Paragraph>
                {/* todo: community photo */}
                <Paragraph>{channel.community.displayName}</Paragraph>
              </div>
              <Button>Download Status</Button>
            </div>
          )
        )

      case 'u':
        return (
          user && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* todo: banner placeholder */}
              {/* todo: avatar */}
              <Heading>{user.displayName}</Heading>
              <Paragraph>{user.description}</Paragraph>
              {/* <Paragraph>{publicKeyToEmojiHash(publicKey)}</Paragraph> */}
              <Paragraph>{publicKey}</Paragraph>
              {/* todo: links */}
              <Button>View profile</Button>
              <div>
                <Paragraph>Profile in</Paragraph>
                <Paragraph>Status</Paragraph>
              </div>
              <Button>Download Status</Button>
            </div>
          )
        )
    }
  }

  return (
    <>
      <Head>
        <title>{`Status – ${nowProp}`}</title>

        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* todo: social tags */}
        {/* todo: app stores banners/redirects */}
        {/* todo: eval following meta tags */}
        <meta property="og:site_name" content="Join Status" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="Status — A secure messaging app, crypto wallet, and Web3 browser"
        />
        <meta property="og:title" content="Join [@|#]<name> in Status" />
        <meta property="og:url" content="<url>" />
        {/* todo?: entity QR */}
        <meta
          property="og:image"
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/og?${searchParams}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ethstatus" />
        <meta property="twitter:image" content="<logo>" />
        <meta property="twitter:image:alt" content="Status logo" />
        <meta property="status-im:target" content="<displayName>" />
        <meta property="al:ios:url" content="status-im:/<url>" />
        <meta property="al:ios:app_store_id" content="1178893006" />
        <meta
          property="al:ios:app_name"
          content="Status — Ethereum. Anywhere"
        />
        <meta property="al:android:url" content="status-im:/<url>" />
        <meta property="al:android:package" content="im.status.ethereum" />
        <meta
          property="al:android:app_name"
          content="Status — Ethereum. Anywhere"
        />
        {/* todo?: except communities; ask product */}
        <meta name="robots" content="noindex" />
      </Head>
      {/* todo?: theme; based on user system settings? */}
      <main className={styles.main}>
        {/* <div>
          <p className={inter.className}>{nowProp}</p>
        </div>

        <br />

        <div>
          <p className={inter.className}>{now}</p>
        </div> */}

        {renderEntity()}
      </main>
    </>
  )
}

function isError(props: ServerSideProps): props is { errorCode: number } {
  return (props as { errorCode: number }).errorCode !== undefined
}
