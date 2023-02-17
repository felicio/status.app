// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

// /**
//  * @type {import('next/dist/server/config-shared').NextConfig}
//  */
// export default {
//   // reactStrictMode: true,
//   reactStrictMode: false,
//   experimental: {
//     esmExternals: true,
//   },
// }

/** @type {import('next').NextConfig} */
// const { withTamagui } = require('@tamagui/next-plugin')
// // const withImages = require('next-images')
// const { join } = require('path')
import pkg from '@tamagui/next-plugin'
import { join } from 'path'

const { withTamagui } = pkg

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

// const boolVals = {
//   true: true,
//   false: false,
// }

// const disableExtraction =
//   boolVals[process.env.DISABLE_EXTRACTION] ??
//   process.env.NODE_ENV === 'development'

const plugins = [
  // withImages,
  withTamagui({
    config: './tamagui.config.ts',
    components: [
      // '@status-im/components'
      './node_modules/@status-im/components/packages/components/dist',
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
    excludeReactNativeWebExports: [
      // 'Switch',
      // 'ProgressBar',
      // 'Picker',
      // 'CheckBox',
      // 'Touchable'
    ],
  }),
]

// module.exports = function () {
export default function foo() {
  /** @type {import('next').NextConfig} */
  let config = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    transpilePackages: [
      //   'solito',
      'react-native-web',
      //   'expo-linking',
      //   'expo-constants',
      //   'expo-modules-core'
      '@status-im/components',
    ],

    experimental: {
      // optimizeCss: true,
      // scrollRestoration: true,
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
