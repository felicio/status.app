/** @type {import('next').NextConfig} */
import nextTamagui from '@tamagui/next-plugin'
import { join } from 'path'

const { withTamagui } = nextTamagui

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

const plugins = [
  withTamagui({
    config: './tamagui.config.ts',
    components: [
      // fixme?: works without it
      // './node_modules/@status-im/components/packages/components/dist',
      // '@status-im/components',
    ],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction: true,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
  }),
]

export default function config() {
  /** @type {import('next').NextConfig} */
  let config = {
    // webpack: (
    //   config,
    //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
    // ) => {
    //   // Important: return the modified config
    //   // console.log('HERE', isServer)
    //   return { ...config, nextRuntime: 'edge' }
    // },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    transpilePackages: [
      'react-native-web',
      // fixme?: works without it
      '@status-im/components',
    ],
    experimental: {
      legacyBrowsers: false,
    },

    reactStrictMode: false,
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
