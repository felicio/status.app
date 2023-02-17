import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { base58, utf8 } from '@scure/base'

export const config = {
  // runtime: 'edge',
  // note?: because of next.js downgrade
  runtime: 'experimental-edge',
}

// todo: set cache header too
export default function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const now = new Date().toUTCString()

    // ?title=<title>
    // const hasTitle = searchParams.has('title')
    // const title = hasTitle
    //   ? searchParams.get('title')?.slice(0, 100)
    //   : 'My default title'

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: '#f6f6f6',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
          }}>
          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              justifyItems: 'center',
            }}>
            <img
              alt="Vercel"
              height={200}
              src="data:image/svg+xml,%3Csvg width='116' height='100' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M57.5 0L115 100H0L57.5 0z' /%3E%3C/svg%3E"
              style={{ margin: '0 30px' }}
              width={232}
            />
          </div> */}
          {/* <img
            alt="banner"
            width={200}
            height={75}
            src={URL.createObjectURL(
              new Blob([base58.decode(searchParams.get('banner')!)], {
                type: 'image/jpeg',
              }),
            )}
            style={{
              borderRadius: '8px',
            }}
          />
          <img
            alt="photo"
            width={50}
            height={50}
            src={URL.createObjectURL(
              new Blob([base58.decode(searchParams.get('photo')!)], {
                type: 'image/jpeg',
              }),
            )}
            style={{
              borderRadius: '8px',
              marginTop: 30,
            }}
          /> */}
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
            {utf8.encode(base58.decode(searchParams.get('displayName')!))}
          </div>
          {/* <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
            {utf8.encode(base58.decode(searchParams.get('emojiHash')!))}
          </div> */}
          <div
            style={{
              fontSize: 20,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
            {utf8
              .encode(base58.decode(searchParams.get('description')!))
              // .replaceAll('&', '&amp;')
              .replaceAll("'&lt;", '<') +
              // .replaceAll('>', '&gt;')
              // .replaceAll('"', '&quot;')
              // .replaceAll("'", '&#039;')
              ' (description; utf8)'}
          </div>
          <div
            style={{
              fontSize: 20,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
            {searchParams.get('membersCount') + ' (members)'}
          </div>
          <div
            style={{
              backgroundColor: utf8.encode(
                base58.decode(searchParams.get('color')!),
              )!,
              marginTop: 30,
              width: '25px',
              height: '25px',
              borderRadius: '8px',
            }}
          />
          <div
            style={{
              fontSize: 20,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'black',
              marginTop: 30,
              padding: '0 120px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
            }}>
            {now}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
