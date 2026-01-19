import { TextDecoder as UtilTextDecoder, TextEncoder as UtilTextEncoder } from 'util'
import { MessageChannel } from 'worker_threads'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any

if (!g.TextEncoder) g.TextEncoder = UtilTextEncoder
if (!g.TextDecoder) g.TextDecoder = UtilTextDecoder

// undici が MessagePort を要求する環境があるので補完
if (!g.MessagePort) g.MessagePort = new MessageChannel().port1.constructor
