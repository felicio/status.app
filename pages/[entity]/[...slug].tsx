import Error from 'next/error'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
// import { createPreviewClient } from '../../node_modules/@status-im/js/packages/status-js/dist/index.es'
import { Paragraph } from '../../node_modules/@status-im/components/packages/components/dist/typography/index'

const inter = Inter({ subsets: ['latin'] })

// http://localhost:3000/g/1/2/dataA;z?dataB=z#&dataC=z

// { entity: 'apple-touch-icon-precomposed.png' } /apple-touch-icon-precomposed.png
// { entity: 'apple-touch-icon.png' } /apple-touch-icon.png

type Props = {
  entity: string
  url: string
  data: string
  now: string
  communityPreview: any
}

interface Query extends ParsedUrlQuery {
  entity: string
  slug: string[]
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
  context,
) => {
  const { params, req, res } = context

  const entity = params!.entity
  const data = params!.slug[params!.slug.length - 1].replaceAll(';', '')
  const url = `https://${req.headers.host}${req.url!.replaceAll(';', '')}`
  const now = new Date().toUTCString()

  // // Preview Client
  // console.log(':start', new Date().toISOString())
  // const client = await createPreviewClient({
  //   environment: 'test',
  // })
  // // process.once('SIGTERM', async () => {
  // //   await client.stop()
  // // })
  // // process.once('SIGINT', async () => {
  // //   await client.stop()
  // // })
  // const communityPreview = await client.fetchCommunityPreview(
  //   '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133',
  // )
  // console.log(communityPreview)
  // // delete communityPreview?.banner
  // // delete communityPreview?.photo
  // // await client.stop()
  // // console.log(':end', new Date().toISOString())

  const props: Props = {
    entity,
    data,
    url,
    now,
    // communityPreview: JSON.stringify(communityPreview),
    communityPreview: '',
  }

  // todo: set s-maxage according to if waku returned within
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

export default function Entity(props: Props) {
  const [location, setLocation] = useState<Location>()
  // const [client, setClient] = useState<any>()
  const [community, setCommunity] = useState<any>()

  useEffect(() => {
    setLocation(window.location)
  }, [])

  // useEffect(() => {
  //   console.log('CLIENT')

  //   createPreviewClient({
  //     environment: 'test',
  //   }).then((client) => {
  //     // setClient(client)

  //     client
  //       .fetchCommunityPreview(
  //         '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133',
  //       )
  //       // .fetchUserPreview(
  //       //   '0x0466382f82d00d7e75d8cec07b4f95040290a1727a6710bb4cca986f55311e15c018b89bc4888bbb3ba5a49c1da8288da58077f00a308e397cf30a30c645711a52',
  //       // )
  //       .then((community) => {
  //         console.log('COMMUNITY')
  //         console.log(client)
  //         console.log(community)
  //         setCommunity(community)
  //       })
  //       .catch((err) => {
  //         console.error('ERROR')
  //         console.error(err)
  //       })
  //   })
  // }, [])

  const { entity, data, url, now: nowProp, communityPreview } = props

  if (!['c', 'cc', 'u'].includes(entity)) {
    return <Error statusCode={404} />
  }

  // todo?: sort
  // todo?: log content url
  const searchParams = new URL(url).searchParams.toString()
  const now = new Date().toUTCString()

  // // Preview Client
  // console.log(':start', new Date().toISOString())
  // const client = await createPreviewClient({
  //   environment: 'test',
  // })
  // // process.once('SIGTERM', async () => {
  // //   await client.stop()
  // // })
  // // process.once('SIGINT', async () => {
  // //   await client.stop()
  // // })
  // const communityPreview = await client.fetchCommunityPreview(
  //   '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133',
  // )
  // console.log(communityPreview)
  // // delete communityPreview?.banner
  // // delete communityPreview?.photo
  // // await client.stop()
  // // console.log(':end', new Date().toISOString())

  // init client when server component is loaded in browser

  return (
    <>
      <Head>
        <title>{`Status – ${nowProp}`}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`${
            process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
          }/api/og?${searchParams}`}
        />
      </Head>
      <main className={styles.main}>
        <div>
          <Paragraph>JDI.</Paragraph>
        </div>

        {community && (
          <div>
            <p className={inter.className}>{community.description}</p>
          </div>
        )}

        {/* <div>
          <p className={inter.className}>{nowProp}</p>
        </div>

        <br />
        <div>
          <p className={inter.className}>{now}</p>
        </div> */}

        {/* <br /> */}

        <div>
          <p className={inter.className} style={{ wordBreak: 'break-all' }}>
            {/* {JSON.stringify(communityPreview)} */}
            {communityPreview}
          </p>
        </div>

        {/* <br /> */}

        {/* <div>
          <p className={inter.className} style={{ wordBreak: 'break-all' }}>
            {JSON.stringify(url)}
          </p>
        </div> */}

        {location && (
          <div>
            <p className={inter.className}>{location.href}</p>
          </div>
        )}
      </main>
    </>
  )
}
