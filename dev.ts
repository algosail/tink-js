import { serveDir } from '@std/http'

import { denoPlugins } from 'jsr:@duesabati/esbuild-deno-plugin@^0.0.1'
import * as esbuild from 'npm:esbuild@0.23.0'

const script = async (path: string) => {
  try {
    const url = new URL('./test' + path, import.meta.url)
    await esbuild.build({
      plugins: [...denoPlugins()],
      entryPoints: [url.toString()],
      outfile: './test/dist/code.esm.js',
      bundle: true,
      format: 'esm',
    })
    const code = await Deno.readTextFile('./test/dist/code.esm.js')
    return new Response(code, {
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
