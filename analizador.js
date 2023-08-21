// Definición de los tipos de token
//Se define un conjunto de tipos de tokens en TokenType para representar números, suma, resta y fin de entrada.
const TokenType = {
  NUMBER: "NUMBER",
  ADD: "ADD",
  SUB: "SUB",
  EOF: "EOF",
};

// Clase Token
//se utiliza para representar un token individual con un tipo y un valor.
class Token {
  constructor(type, value) {
    this.type = type; // Tipo del token (NUMBER, ADD, SUB, EOF)
    this.value = value; // Valor del token (puede ser número, "+", "-", o null para EOF)
  }
}

// Analizador léxico
//La clase Lexer se encarga del análisis léxico, identificando números, operadores y espacios en blanco en la entrada.
class Lexer {
  constructor(input) {
    this.input = input; // Entrada a analizar
    this.pos = 0; // Posición actual en la entrada
  }

  //inicia un bucle while que se ejecutará mientras la posición actual (this.pos) sea menor que la longitud total de la entrada 
  //(this.input.length). 
  //this.pos:indica la posición del carácter que se está considerando en el proceso de análisis.
  getNextToken() {
    while (this.pos < this.input.length) {
      //Obtiene el carácter en la posición actual (this.pos) de la entrada (this.input) y lo almacena en la variable char
      let char = this.input[this.pos];

      // Ignora espacios en blanco
      if (char === " ") {
        //Si el carácter es un espacio en blanco, se incrementa this.pos para avanzar a la siguiente posición 
        //y se pasa al siguiente carácter en la entrada utilizando continue.
        this.pos++;
        continue;
      }

      //Comprueba si el carácter actual es un número
      // Si es un número, obtén un token NUMBER
      if (!isNaN(char)) {
        //Si el carácter es un número, llama al método getNumberToken() para obtener el número completo.
        let number = this.getNumberToken();
        //Crea y devuelve un nuevo token de tipo NUMBER con el valor del número obtenido.
        return new Token(TokenType.NUMBER, number);
      }

      // Si es un operador, obtén el token correspondiente
      switch (char) {
        case "+":
          //incrementa this.pos para avanzar al siguiente carácter.
          this.pos++;
          //Crea y devuelve un nuevo token de tipo ADD con el valor del carácter.
          return new Token(TokenType.ADD, char);
        case "-":
          this.pos++;
          return new Token(TokenType.SUB, char);
          //Si el carácter no coincide con ninguno de los casos anteriores
        default:
          //Lanza un error indicando que el carácter no es reconocido.
          throw new Error("Caracter no reconocido: " + char);
      }
    }

    // Retorna un token EOF al final de la entrada
    //Cuando se agota la entrada, crea y devuelve un token de tipo EOF (fin de archivo) para indicar que no hay más tokens que analizar.
    return new Token(TokenType.EOF, null);
  }

  getNumberToken() {
    //Inicializa una variable llamada number como una cadena vacía. 
    //Esta variable se utilizará para construir el número a partir de los caracteres en la entrada.
    let number = "";
    //Inicia un bucle while que se ejecutará mientras la posición actual this.pos sea menor que la longitud total 
    //de la entrada this.input.length y el carácter actual (referenciado por this.input[this.pos]) sea un número.
    while (this.pos < this.input.length && !isNaN(this.input[this.pos])) {

      //Agrega el carácter actual a la cadena number. Esto hace la representación textual del número en la cadena number.
      number += this.input[this.pos];
      //para avanzar a la siguiente posición en la cadena de entrada, lo que permite continuar construyendo el número.
      this.pos++;
    }
    return parseInt(number); // Convierte el número en cadena a un entero
  }
}

// Analizador sintáctico y calculadora
//implementa un analizador sintáctico para evaluar expresiones aritméticas. 
//Utiliza el lexer para obtener tokens y luego aplica reglas gramaticales para evaluar las expresiones.
class Calculator {
  constructor(input) {
    this.lexer = new Lexer(input); // Crea un analizador léxico
    this.currentToken = this.lexer.getNextToken(); // Obtiene el primer token
  }

  eat(expectedType) {
    // Verifica si el token actual coincide con el tipo esperado
    if (this.currentToken.type === expectedType) {
      this.currentToken = this.lexer.getNextToken(); // Avanza al siguiente token
    } else {
      throw new Error("Token inesperado: " + this.currentToken.type);
    }
  }

  factor() {
    let token = this.currentToken;
    this.eat(TokenType.NUMBER); // Espera un token de tipo NUMBER
    return token.value; // Retorna el valor del token (un número)
  }

  expr() {
    let result = this.factor(); // Inicializa el resultado con el valor de un factor

    // Evalúa sumas y restas en el mismo nivel de precedencia
    //Inicia un bucle while que se ejecuta mientras el tipo del token actual (this.currentToken.type) sea igual 
    //al tipo de token de suma (TokenType.ADD) o al tipo de token de resta (TokenType.SUB). 
    //este bucle se encarga de iterar a través de los tokens de operadores de suma y resta en la expresión.
    while (this.currentToken.type === TokenType.ADD || this.currentToken.type === TokenType.SUB) {
      //Crea una variable op que almacena el token actual, que será un token de operador de suma (+) o de resta (-).
      let op = this.currentToken;
      //se verifica el tipo de operador almacenado en op. Si es un token de suma, 
      //el código dentro del primer bloque if se ejecuta. 
      //Si es un token de resta, el código dentro del segundo bloque else if se ejecuta.
      if (op.type === TokenType.ADD) {
        //Llama al método eat() para consumir el token de operador actual
        this.eat(TokenType.ADD);
        //Dependiendo del tipo de operador, se invoca el método factor() para evaluar el siguiente término de la expresión 
        //y se realiza la operación de suma o resta con el resultado previo almacenado en result.
        result += this.factor();
      } else if (op.type === TokenType.SUB) {
        this.eat(TokenType.SUB);
        result -= this.factor();
      }
    }

    return result; // Retorna el resultado de la expresión evaluada
  }

  calculate() {
    return this.expr(); // Inicia el proceso de cálculo evaluando la expresión completa
  }
}

// Función para probar el analizador léxico y la calculadora
//prueba tanto el analizador léxico como la calculadora en ejemplos de entrada predefinidos.
function testCalculator() {
  // Definición de la entrada
  var input = "2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2";

  // Creación de un analizador léxico
  var lexer = new Lexer(input);

  // Imprime los tokens obtenidos por el analizador léxico
  let token = lexer.getNextToken();
  //este bucle se ejecutará hasta que se hayan procesado todos los tokens en la cadena de entrada.
  while (token.type !== TokenType.EOF) {
    console.log("Operacion 1: ", token);
    //se llama al método getNextToken() del analizador léxico (lexer) para obtener el siguiente token en la cadena de 
    //entrada y asignarlo a la variable token. Esto avanza el analizador léxico al siguiente token en la secuencia.
    token = lexer.getNextToken();
  }

  // Creación de una calculadora
  var calculator = new Calculator(input);

  // Calcula y muestra el resultado
  console.log("Resultado: ", calculator.calculate());

  // Otra entrada para pruebas
  input = "10 - 5 ";

  // Creación de otro analizador léxico
  lexer = new Lexer(input);

  // Imprime los tokens obtenidos por el segundo analizador léxico
  let token2 = lexer.getNextToken();
  while (token2.type !== TokenType.EOF) {
    console.log("Operacion 2: ", token2);
    token2 = lexer.getNextToken();
  }

  // Creación de otra calculadora
  calculator = new Calculator(input);

  // Calcula y muestra el resultado
  console.log("Resultado: ", calculator.calculate());
}

// Ejecuta la función de prueba de la calculadora
testCalculator();
