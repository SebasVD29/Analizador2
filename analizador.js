// Definición de los tokens
const TokenType = {
  NUMBER: "NUMBER",
  ADD: "ADD",
  SUB: "SUB",
  EOF: "EOF",
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

      if (char === " ") {
        this.pos++;
        continue;
      }

      if (!isNaN(char)) {
        let number = this.getNumberToken();
        return new Token(TokenType.NUMBER, number);
      }

      switch (char) {
        case "+":
          this.pos++;
          return new Token(TokenType.ADD, char);
        case "-":
          this.pos++;
          return new Token(TokenType.SUB, char);
        default:
          throw new Error("Caracter no reconocido: " + char);
      }
    }

    return new Token(TokenType.EOF, null);
  }

  getNumberToken() {
    let number = "";
    while (this.pos < this.input.length && !isNaN(this.input[this.pos])) {
      number += this.input[this.pos];
      this.pos++;
    }
    return parseInt(number);
  }
}

// Analizador sintáctico y calculadora
class Calculator {
  constructor(input) {
    this.lexer = new Lexer(input);
    this.currentToken = this.lexer.getNextToken();
  }

  eat(expectedType) {
    if (this.currentToken.type === expectedType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error("Token inesperado: " + this.currentToken.type);
    }
  }

  factor() {
    let token = this.currentToken;
    this.eat(TokenType.NUMBER);
    return token.value;
  }

  expr() {
    let result = this.factor();

    while (this.currentToken.type === TokenType.ADD || this.currentToken.type === TokenType.SUB) {
      let op = this.currentToken;
      if (op.type === TokenType.ADD) {
        this.eat(TokenType.ADD);
        result += this.factor();
      } else if (op.type === TokenType.SUB) {
        this.eat(TokenType.SUB);
        result -= this.factor();
      }
    }

    return result;
  }
  
  calculate() {
    return this.expr();
  }
}

// Prueba del analizador léxico y calculadora
function testCalculator() {
  var input = "2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2";
  var lexer = new Lexer(input);

  let token = lexer.getNextToken();
  while (token.type !== TokenType.EOF) {
    console.log("Operacion 1: ", token);
    token = lexer.getNextToken();
  }

  var calculator = new Calculator(input);
  console.log("Resultado: ", calculator.calculate());

  input = "10 - 5 ";
  lexer = new Lexer(input);

  let token2 = lexer.getNextToken();
  while (token2.type !== TokenType.EOF) {
    console.log("Operacion 2: ", token2);
    token2 = lexer.getNextToken();
  }

  calculator = new Calculator(input);
  console.log("Resultado: ", calculator.calculate());

}

testCalculator();
