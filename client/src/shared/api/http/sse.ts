/**
 * Parser mínimo de Server-Sent Events sobre `ReadableStream`.
 * Suporta os campos `data:` (multi-linha) e `event:`; ignora comentários e `id:`.
 */
export interface SseMessage {
  event: string
  data: string
}

export async function* parseSse(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): AsyncGenerator<SseMessage> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const onAbort = () => reader.cancel().catch(() => undefined)
  signal?.addEventListener('abort', onAbort, { once: true })

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // Mensagens são separadas por linha em branco. Aceita \n\n e \r\n\r\n.
      let boundary: number
      while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
        const raw = buffer.slice(0, boundary)
        buffer = buffer.slice(boundary).replace(/^\r?\n\r?\n/, '')
        const message = parseBlock(raw)
        if (message) yield message
      }
    }
    // Flush de mensagem final sem linha em branco ao término.
    const tail = parseBlock(buffer)
    if (tail) yield tail
  } finally {
    signal?.removeEventListener('abort', onAbort)
    reader.releaseLock()
  }
}

function parseBlock(block: string): SseMessage | null {
  let event = 'message'
  const data: string[] = []

  for (const line of block.split(/\r?\n/)) {
    if (!line || line.startsWith(':')) continue
    const idx = line.indexOf(':')
    const field = idx === -1 ? line : line.slice(0, idx)
    const value = idx === -1 ? '' : line.slice(idx + 1).replace(/^ /, '')
    if (field === 'event') event = value
    else if (field === 'data') data.push(value)
  }

  return data.length ? { event, data: data.join('\n') } : null
}
