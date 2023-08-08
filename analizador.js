// Definición de los tokens
const TokenType = {
    NUMBER: 'NUMBER',
    ADD: 'ADD',
    SUB: 'SUB',
    MUL: 'MUL',
    DIV: 'DIV',
    LPAREN: 'LPAREN',
    RPAREN: 'RPAREN',
    EOF: 'EOF'
  };
  
  // Clase Token
  class Token {
    constructor(type, value) {
      this.type = type;
      this.value = value;
    }
  }
  
  // Analizador léxico
  class Lexer {
    constructor(input) {
      this.input = input;
      this.pos = 0;
    }
  
    getNextToken() {
      while (this.pos < this.input.length) {
        let char = this.input[this.pos];
  
        if (char === ' ') {
          this.pos++;
          continue;
        }
  
        if (!isNaN(char)) {
          let number = this.getNumberToken();
          return new Token(TokenType.NUMBER, number);
        }
  
        switch (char) {
          case '+':
            this.pos++;
            return new Token(TokenType.ADD, char);
          case '-':
            this.pos++;
            return new Token(TokenType.SUB, char);
          case '*':
            this.pos++;
            return new Token(TokenType.MUL, char);
          case '/':
            this.pos++;
            return new Token(TokenType.DIV, char);
          case '(':
            this.pos++;
            return new Token(TokenType.LPAREN, char);
          case ')':
            this.pos++;
            return new Token(TokenType.RPAREN, char);
          default:
            throw new Error('Caracter no reconocido: ' + char);
        }
      }
  
      return new Token(TokenType.EOF, null);
    }
  
    getNumberToken() {
      let number = '';
      while (this.pos < this.input.length && !isNaN(this.input[this.pos])) {
        number += this.input[this.pos];
        this.pos++;
      }
      return parseInt(number);
    }
  }
  
  // Prueba del analizador léxico
  function testLexer() {
    const input = '3 + 5 * (10 - 2)';
    const lexer = new Lexer(input);
  
    let token = lexer.getNextToken();
    while (token.type !== TokenType.EOF) {
      console.log(token);
      token = lexer.getNextToken();
    }
  }
  
  testLexer();
  