enum TokenType {
  TEXT,
  OPEN_BRACE,
  CLOSE_BRACE,
  IDENTIFIER,
  QUESTION,
  COLON,
  STRING,
}

interface Token {
  type: TokenType
  value: string
}

// 插值解析Parser {{}}，暂时没转义支持
// "😯，没有找到用户「{{user}}」的谱面「{{id}} ({{mode ? '{{mode}}' : '' }} {{diff ? '-{{diff}}' : '' }})」的打分数据"
export class Parser {
  private tokens: Token[] = []
  private current = 0

  constructor(
    private template: string,
    private data: any
  ) {
    this.tokenize()
  }

  private tokenize(): void {
    let current = 0
    while (current < this.template.length) {
      let char = this.template[current]
      if (char === '\\' && current + 1 < this.template.length) {
        // 处理转义字符
        const nextChar = this.template[current + 1]
        if (
          nextChar === '{' ||
          nextChar === '}' ||
          nextChar === '?' ||
          nextChar === ':' ||
          nextChar === "'" ||
          nextChar === '\\'
        ) {
          this.tokens.push({ type: TokenType.TEXT, value: nextChar })
          current += 2
          continue
        }
      }
      if (char === '{' && this.template[current + 1] === '{') {
        this.tokens.push({ type: TokenType.OPEN_BRACE, value: '{{' })
        current += 2
        continue
      }

      if (char === '}' && this.template[current + 1] === '}') {
        this.tokens.push({ type: TokenType.CLOSE_BRACE, value: '}}' })
        current += 2
        continue
      }

      if (char === '?') {
        this.tokens.push({ type: TokenType.QUESTION, value: '?' })
        current++
        continue
      }

      if (char === ':') {
        this.tokens.push({ type: TokenType.COLON, value: ':' })
        current++
        continue
      }

      if (char === "'") {
        let value = ''
        char = this.template[++current]
        while (char !== "'" && current < this.template.length) {
          if (char === '\\' && current + 1 < this.template.length) {
            char = this.template[++current]
          }
          value += char
          char = this.template[++current]
        }
        if (char === "'") current++
        this.tokens.push({ type: TokenType.STRING, value })
        continue
      }

      if (/[a-zA-Z0-9_]/.test(char)) {
        let value = ''
        while (/[a-zA-Z0-9_]/.test(char)) {
          value += char
          char = this.template[++current]
        }
        this.tokens.push({ type: TokenType.IDENTIFIER, value })
        continue
      }

      if (/\s/.test(char)) {
        current++
        continue
      }

      let value = ''
      while (
        current < this.template.length &&
        char !== '{' &&
        char !== '}' &&
        char !== '?' &&
        char !== ':' &&
        char !== "'" &&
        !/[a-zA-Z0-9_]/.test(char)
      ) {
        if (char === '\\' && current + 1 < this.template.length) {
          value += this.template[++current]
        } else {
          value += char
        }
        char = this.template[++current]
      }
      if (value) {
        this.tokens.push({ type: TokenType.TEXT, value })
      }
    }
  }

  private match(...types: TokenType[]): boolean {
    if (this.current >= this.tokens.length) return false
    return types.includes(this.tokens[this.current].type)
  }

  private consume(type: TokenType): Token {
    if (this.match(type)) {
      return this.tokens[this.current++]
    }
    throw new Error(
      `Expected token type ${type}, but got ${this.tokens[this.current].type}`
    )
  }

  private parseExpression(): string {
    if (this.match(TokenType.OPEN_BRACE)) {
      this.consume(TokenType.OPEN_BRACE)
      const result = this.parseInterpolation()
      this.consume(TokenType.CLOSE_BRACE)
      return result
    }
    if (this.match(TokenType.STRING)) {
      const tmp = this.consume(TokenType.STRING).value
      return interpolate(tmp, this.data)
    }
    return this.consume(TokenType.TEXT).value
  }

  private parseInterpolation(): string {
    const identifier = this.consume(TokenType.IDENTIFIER).value
    if (this.match(TokenType.QUESTION)) {
      this.consume(TokenType.QUESTION)
      const truePart = this.parseExpression()
      this.consume(TokenType.COLON)
      const falsePart = this.parseExpression()
      return this.data[identifier] ? truePart : falsePart
    }
    return this.data[identifier]?.toString() || ''
  }

  parse(): string {
    // console.log(this.current, this.tokens)
    let result = ''
    while (this.current < this.tokens.length) {
      result += this.parseExpression()
    }
    return result
  }
}

export function interpolate(template: string, data): string {
  const parser = new Parser(template, data)
  return parser.parse()
}
