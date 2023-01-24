import Error from 'next/error'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
// import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

const inter = Inter({ subsets: ['latin'] })

// http://localhost:3000/g/1/2/dataA;z?dataB=z#&dataC=z

// { entity: 'apple-touch-icon-precomposed.png' } /apple-touch-icon-precomposed.png
// { entity: 'apple-touch-icon.png' } /apple-touch-icon.png

type Props = {
  entity: string
  url: string
  data: string
  now: string
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

  const props: Props = {
    entity,
    data,
    url,
    now,
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
  // const [location, setLocation] = useState<Location>()

  // useEffect(() => {
  //   setLocation(window.location)
  // }, [])

  const { entity, data, url, now: nowProp } = props

  if (!['c', 'cc', 'u'].includes(entity)) {
    return <Error statusCode={404} />
  }

  // todo?: sort
  // todo?: log content url
  const searchParams = new URL(url).searchParams.toString()
  const now = new Date().toUTCString()

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
          <p className={inter.className}>{nowProp}</p>
        </div>

        <br />
        <div>
          <p className={inter.className}>{now}</p>
        </div>

        <br />

        <div>
          <p className={inter.className} style={{ wordBreak: 'break-all' }}>
            {JSON.stringify(url)}
          </p>
        </div>

        {/* {location && (
          <div>
            <p className={inter.className}>{location.href}</p>
          </div>
        )} */}
      </main>
    </>
  )
}
