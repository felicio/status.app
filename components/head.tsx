import Head from 'next/head'

type Props = {
  index?: boolean
  children?: React.ReactElement
}

function _Head({ index = true, children }: Props) {
  return (
    <Head>
      <title>Status</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
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
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@ethstatus" />
      {/* <meta property="twitter:image" content="<logo>" /> */}
      <meta property="twitter:image:alt" content="Status logo" />
      <meta property="status-im:target" content="<displayName>" />
      <meta property="al:ios:url" content="status-im:/<url>" />
      <meta property="al:ios:app_store_id" content="1178893006" />
      <meta property="al:ios:app_name" content="Status — Ethereum. Anywhere" />
      <meta property="al:android:url" content="status-im:/<url>" />
      <meta property="al:android:package" content="im.status.ethereum" />
      <meta
        property="al:android:app_name"
        content="Status — Ethereum. Anywhere"
      />
      {/* todo?: except communities; ask product */}
      {!index && <meta name="robots" content="noindex" />}
      {/* todo?: entity QR */}
      {/* todo?: fallback OG */}
      {children}
    </Head>
  )
}

export { _Head as Head }
