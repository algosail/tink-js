import { serveDir } from '@std/http'

import { denoPlugins } from 'jsr:@duesabati/esbuild-deno-plugin@^0.0.1'
import * as esbuild from 'npm:esbuild@0.23.0'

const script = async (path: string) => {
  try {
    const url = new URL('./test' + path, import.meta.url)
    const res = await esbuild.build({
      plugins: [...denoPlugins()],
      entryPoints: [url.toString()],
      outfile: '.',
      format: 'esm',
      bundle: true,
      treeShaking: true,
      // minify: true,
      write: false,
    })
    return new Response(res.outputFiles[0].contents, {
      headers: { 'content-type': 'application/javascript' },
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Response('Not Found', { status: 404 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
}

Deno.serve((req) => {
  const path = new URL(req.url).pathname

  if (path.endsWith('ts')) return script(path)
  return serveDir(req, { fsRoot: './test' })
})
