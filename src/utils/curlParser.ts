export interface CurlParsed {
  url: string
  method: string
  headers: Record<string, string>
  data?: string
}

export function curlToAxiosConfig(curlStr: string): CurlParsed {
  // 关键改进1：使用正则处理转义字符和引号包裹的参数
  const args = curlStr.match(/(?:'(?:\\'|[^'])*'|"(?:\\"|[^"])*"|\S)+/g) || []

  const cleanedArgs = args.map(
    (arg) =>
      arg
        .replace(/^['"]|['"]$/g, '') // 移除外层引号
        .replace(/\\(['"\\])/g, '$1') // 处理转义字符
  )

  let method = 'GET'
  const headers: Record<string, string> = {}
  let data: any
  let url = ''

  // 关键改进2：优先处理数据参数以推断方法
  let hasData = false
  for (let i = 0; i < cleanedArgs.length; i++) {
    const arg = cleanedArgs[i]
    switch (arg) {
      case '-X':
        method = cleanedArgs[++i].toUpperCase()
        break
      case '-H':
        const [rawKey, ...rawValue] = cleanedArgs[++i].split(':')
        headers[rawKey.trim()] = rawValue.join(':').trim()
        break
      case '--data-binary':
      case '--data-raw':
      case '-d':
        hasData = true
        data = cleanedArgs[++i]
        // 关键改进3：自动识别JSON格式并解析
        if (headers['Content-Type']?.includes('application/json')) {
          try {
            data = JSON.parse(data)
          } catch {
            /* 保持原始字符串 */
          }
        }
        break
      default:
        if (arg.startsWith('http')) url = arg
    }
  }

  // 关键改进4：隐式方法推断（根据网页1/2/6的规范）
  if (hasData && method === 'GET') method = 'POST'

  return { url, method, headers, data }
}
