import type { ConfigEnv } from "vite"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { mars3dPlugin } from "vite-plugin-mars3d"
import autoprefixer from "autoprefixer"

export default ({ mode }: ConfigEnv) => {
  const root = process.cwd()
  // 获取 .env 文件里定义的环境变量
  const ENV = loadEnv(mode, root)

  console.log(`当前环境信息：`, mode)
  console.log(`ENV：`, ENV)

  const ISDEV = mode === "development"

  const config: any = {
    base: ENV.VITE_BASE_URL,
    server: {
      host: "0.0.0.0",
      https: false,
      port: 4002
    },
    define: {
      "process.env": {
        mode,
        BASE_URL: ENV.VITE_BASE_URL
      }
    },
    resolve: {
      alias: {
        "@mars": path.join(__dirname, "src")
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
    },
    // optimizeDeps: {
    //   include: ["mars3d"]
    // },
    json: {
      // 支持从 .json 文件中进行按名导入
      namedExports: true,
      stringify: false
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, "src/components/MarsUI/base.less")}";`
        }
      },
      postcss: {
        plugins: [autoprefixer()]
      },
      modules: {
        localsConvention: "camelCase"
      }
    },
    build: {
      // 输出路径
      outDir: path.join("./dist", ENV.VITE_BASE_URL),
      // 小于此阈值的导入或引用资源将内联为 base64 编码， 以避免额外的http请求， 设置为 0, 可以完全禁用此项，
      assetsInlineLimit: 4096,
      // 启动 / 禁用 CSS 代码拆分
      cssCodeSplit: true,
      // 构建后是否生成 soutrce map 文件
      sourcemap: false,
      // 自定义rollup-commonjs插件选项
      commonjsOptions: {
        include: /node_modules|packages/
      },
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "index.html")
        }
      },
      // 当设置为 true, 构建后将会生成 manifest.json 文件
      manifest: false,
      // 设置为 false 可以禁用最小化混淆,或是用来指定是应用哪种混淆器 boolean | 'terser' | 'esbuild'
      minify: true,
      // 传递给 Terser 的更多 minify 选项
      terserOptions: {},
      // 设置为false 来禁用将构建好的文件写入磁盘
      write: true,
      // 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
      emptyOutDir: true
    },
    plugins: [react(), mars3dPlugin()]
  }
  // if (ISDEV) {
  //   config.plugins.push(react() as any)
  //   config.plugins.push(eslintPlugin({ cache: false }) as any)
  // } else {
  //   config.esbuild = {
  //     jsxInject: 'import React from "react";'
  //   }
  // }
  return defineConfig(config as any)
}
