```bash
% npm ci
% npm run build
% npm run dev

visit: http://localhost:3000/c?d=G74AgK0ObFNmYT-WC_Jcc9KfSjHXAQo9THKEEbgPaJoItceMES-bUxr2Tj9efv447rRefBIUg9CEsSFyjBOFTRdZ9PH2wUOW8hVNYqIje3BC96mZ8uFogqM6k7gCCJnMHy4ulsmsgHTdeh5dAzTNNuG8m9XB8oVeildTCKlRhINnTZh4kAl5sP8SzBB4V2_I41a8PKl3mcS0z_eF5gA=#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU
visit: http://localhost:3000/cc/30804ea7-bd66-4d5d-91eb-b2dcfe2515b3?d=G5EBYCwOMrkec8PbsvkGVxRnInqDN3deAUebRefR-VRkKX2Lwov4MpDwMxkfQRPD49F0k4Sf-ry6-Afpu3HhmwAlpZ1Ojr8DW1uUWCAYYC2BBPOUchsDx3HqUWgXZfSxrjPnLLpPztKMUqbA5QIbjyA2OBqQyfjhy8ViMNIhTbeeR1cHh0a94twfIw-WLbRUvBpCSPYkSozlxBBzMiAP9l-c4QJrahWt-a14eULvHDnr13hu-7cAPSZdhQuX5KrK8tCyzB3qBTf2taCfNIs_d5HkynMDq6wB#zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU
visit: http://localhost:3000/u?d=GxgBoJwHdsOLl4DWt55mGELN6clGsb1UKTEkT0KUMDfwhWFpUyWH_cefTnvlcSf2JUXCOAWoY5ywzry-LnJ-PjgOGT1Pkb8riQp7ghv6Zu-x70x4m8lncZaRWpDN-sEfT85idUCWvppT_QFNa2A6J3Gr69UJGvWmL3S4DBwX2Jr7LBTNOvFPo6lejNUb-xizlAMUTrokunCH-qNmgtU6UK0J6Vkn8Ce35XGBFObxpxnAtnC_J_D-SrBCBnjiUlwH0ViNr3lHBg==#zQ3shUHp2rAM1yqBYeo6LhFbtrozG5mZeA6cRoGohsudtsieT
```

---

> npm install will randomly hang forever
>
> – <https://github.com/npm/cli/issues/4028>

> npm stuck too long on apple new m1 computer
>
> – <https://github.com/npm/cli/issues/2306>

> Private github repository returns invalid package version
>
> – <https://github.com/yarnpkg/yarn/issues/6195#issuecomment-1434510765>

> Allow to install packages from git monorepos
>
> – <https://github.com/yarnpkg/yarn/issues/1570>

> ability to install in a workspace in isolation
>
> – <https://github.com/yarnpkg/yarn/issues/4099>

> "Sparse" workspaces
>
> – <https://github.com/yarnpkg/yarn/issues/4207>

> Previously, defining an engines property in the package.json file was required to customize the Node.js version. However, this property will take precedence over the Project Setting.
>
> – <https://vercel.com/changelog/node-js-version-now-customizable-in-the-project-settings>

> To update your Install Command, first navigate to your General tab in Project Settings. There, you should see your Build & Development Settings. Then, enable the Override toggle. Finally, update the Install Command input with your desired command, such as npx npm@7 install.
>
> – <https://vercel.com/guides/how-do-i-use-the-latest-npm-version-for-my-vercel-deployment>

> The Vercel build pipeline only supports Yarn 2 for static builds. Serverless Functions and SSR (Server-side Rendering) will not work with Yarn 2. The Vercel build pipeline fully supports Yarn 1 for all deployment types.
>
> – <https://vercel.com/guides/does-vercel-support-yarn-2>

> The following files are cached in addition to node_modules/**, yarn.lock, and package-lock.json.
>
> .next/cache/**
>
> – <https://vercel.com/docs/concepts/deployments/troubleshoot-a-build#what-is-cached>

> Sometimes, you may not want to use the Build cache for a specific deployment. You can invalidate or delete the existing Build cache in three ways:
>
> – <https://vercel.com/docs/concepts/deployments/troubleshoot-a-build#excluding-development-dependencies>

> All features of next-transpile-modules are now natively built-in Next.js 13.1. Please use Next's transpilePackages option
>
> – <https://www.npmjs.com/package/next-transpile-modules>

> Cannot find module 'react-native'
>
> – <https://github.com/vercel/next.js/issues/12481>

> How can I clean the build cache?
>
> – <https://github.com/vercel/community/discussions/457>

---

```js
Error: Cannot find module '/vercel/path0/node_modules/react-native-web/dist/cjs/exports/createElement'
Require stack:
- /var/task/.next/server/pages/_document.js
- /var/task/node_modules/next/dist/server/require.js
- /var/task/node_modules/next/dist/server/next-server.js
- /var/task/___next_launcher.cjs
    at Module._resolveFilename (node:internal/modules/cjs/loader:1039:15)
    at mod._resolveFilename (/var/task/node_modules/next/dist/build/webpack/require-hook.js:23:32)
    at Module._load (node:internal/modules/cjs/loader:885:27)
    at Module.require (node:internal/modules/cjs/loader:1105:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at 33330 (/var/task/.next/server/pages/_document.js:1032:18)
    at __webpack_require__ (/var/task/.next/server/webpack-runtime.js:25:43)
    at 83849 (/var/task/.next/server/chunks/318.js:10285:45)
    at __webpack_require__ (/var/task/.next/server/webpack-runtime.js:25:43)
    at 95209 (/var/task/.next/server/pages/_document.js:20:70) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/var/task/.next/server/pages/_document.js',
    '/var/task/node_modules/next/dist/server/require.js',
    '/var/task/node_modules/next/dist/server/next-server.js',
    '/var/task/___next_launcher.cjs'
  ],
  page: '/c'
}
RequestId: 95899430-7666-47cd-bbde-7a5951e11a1f Error: Runtime exited with error: exit status 1
Runtime.ExitError

// next.config.js#transpilePackages
```

```js
Error: Cannot find module '../../package.json'
Require stack:
- /vercel/path0/node_modules/@status-im/js/node_modules/@achingbrain/ssdp/dist/src/default-ssdp-options.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1039:15)
    at mod._resolveFilename (/var/task/node_modules/next/dist/build/webpack/require-hook.js:23:32)
    at Module._load (node:internal/modules/cjs/loader:885:27)
    at Module.require (node:internal/modules/cjs/loader:1105:19)
    at require (node:internal/modules/cjs/helpers:103:18)
    at 92217 (/var/task/.next/server/chunks/197.js:113712:34)
    at __webpack_require__ (/var/task/.next/server/webpack-runtime.js:25:43)
    at 45461 (/var/task/.next/server/pages/[entity]/[[...slug]].js:92:16)
    at __webpack_require__ (/var/task/.next/server/webpack-runtime.js:25:43)
    at __webpack_exec__ (/var/task/.next/server/pages/[entity]/[[...slug]].js:841:39) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/vercel/path0/node_modules/@status-im/js/node_modules/@achingbrain/ssdp/dist/src/default-ssdp-options.js'
  ],
  page: '/[entity]/[[...slug]]'
}
RequestId: db57a7d9-6b13-49f0-814b-d76a683ac249 Error: Runtime exited with error: exit status 1
Runtime.ExitError

// node_modules/@status-im/js/node_modules/@achingbrain/ssdp/package.json
// node_modules/@status-im/js/node_modules/@achingbrain/ssdp/src/default-ssdp-options.ts
// node_modules/@status-im/js/node_modules/@achingbrain/ssdp/dist/src/default-ssdp-options.js
```
