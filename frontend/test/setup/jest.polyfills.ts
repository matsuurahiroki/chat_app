import { TextDecoder, TextEncoder } from 'util'
import { ReadableStream, TransformStream, WritableStream } from 'stream/web'

if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as unknown as typeof globalThis.TextEncoder
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder

if (!globalThis.ReadableStream) globalThis.ReadableStream = ReadableStream as unknown as typeof globalThis.ReadableStream
if (!globalThis.WritableStream) globalThis.WritableStream = WritableStream as unknown as typeof globalThis.WritableStream
if (!globalThis.TransformStream) globalThis.TransformStream = TransformStream as unknown as typeof globalThis.TransformStream

if (!globalThis.fetch || !globalThis.Request || !globalThis.Response || !globalThis.Headers) {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { fetch, Request, Response, Headers } = require('undici') as typeof import('undici')
  /* eslint-enable @typescript-eslint/no-require-imports */

  globalThis.fetch = fetch as unknown as typeof globalThis.fetch
  globalThis.Request = Request as unknown as typeof globalThis.Request
  globalThis.Response = Response as unknown as typeof globalThis.Response
  globalThis.Headers = Headers as unknown as typeof globalThis.Headers
}
