/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("gameCanvas");
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d");

/**
 * Розмір одного блоку на полі
 * @type {number}
 */
const box = 32;

/**
 * Початковий рахунок
 * @type {number}
 */
let score = 0;

/**
 * Напрямок руху змійки ("LEFT", "RIGHT", "UP", "DOWN")
 * @type {string|undefined}
 */
let d;

/**
 * Швидкість гри (в мілісекундах)
 * @type {number}
 */
let speed = 100;

/**
 * Масив для зберігання частин змійки
 * @type {Array<{x: number, y: number}>}
 */
let snake = [];
snake[0] = {
  x: 9 * box,
  y: 10 * box
};

/**
 * Створення їжі в випадковому місці
 * @type {{x: number, y: number}}
 */
let food = {
  x: Math.floor(Math.random() * 17 + 1) * box,
  y: Math.floor(Math.random() * 15 + 3) * box
};

/**
 * Управління напрямком руху
 * @param {KeyboardEvent} event
 */
document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode === 37 && d !== "RIGHT") {
    d = "LEFT";
  } else if (event.keyCode === 38 && d !== "DOWN") {
    d = "UP";
  } else if (event.keyCode === 39 && d !== "LEFT") {
    d = "RIGHT";
  } else if (event.keyCode === 40 && d !== "UP") {
    d = "DOWN";
  }
}

/**
 * Функція перевірки на зіткнення з тілом змійки
 * @param {{x: number, y: number}} head - Координати голови змійки
 * @param {Array<{x: number, y: number}>} array - Масив частин тіла змійки
 * @returns {boolean} Чи сталося зіткнення
 */
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

/**
 * Малювання змійки, їжі та рахунку на екрані
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищуємо полотно перед кожним новим кадром

  // Малювання змійки
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white"; // Голову змійки робимо зеленою, тіло — білим
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "red"; // Контури кожного блоку
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Малювання їжі
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x; // Поточна координата X голови змійки
  let snakeY = snake[0].y; // Поточна координата Y голови змійки

  // Рух змійки в залежності від напрямку
  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  // Якщо змійка з'їла їжу
  if (snakeX === food.x && snakeY === food.y) {
    score++; // Збільшуємо рахунок
    food = {
      x: Math.floor(Math.random() * 17 + 1) * box,
      y: Math.floor(Math.random() * 15 + 3) * box
    }; // Переміщуємо їжу в нове випадкове місце
  } else {
    snake.pop(); // Видаляємо останній елемент масиву змійки
  }

  // Створення нової голови змійки
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Перевірка на зіткнення зі стінами або тілом змійки
  if (
    snakeX < box ||
    snakeX > 17 * box ||
    snakeY < 3 * box ||
    snakeY > 17 * box ||
    collision(newHead, snake)
  ) {
    clearInterval(game); // Зупиняємо гру
  }

  snake.unshift(newHead); // Додаємо нову голову до масиву змійки

  // Виведення рахунку на екран
  ctx.fillStyle = "white";
  ctx.font = "45px Changa one";
  ctx.fillText(score, 2 * box, 1.6 * box);
}

// Створюємо перемикач швидкості гри
document.addEventListener("keydown", (event) => {
  if (event.keyCode === 49) speed = 100; // Швидкість 1
  if (event.keyCode === 50) speed = 80;  // Швидкість 2
  if (event.keyCode === 51) speed = 60;  // Швидкість 3
  clearInterval(game);
  game = setInterval(draw, speed);
});

/**
 * Функція для перезапуску гри
 */
function resetGame() {
  score = 0;
  snake = [];
  snake[0] = {
    x: 9 * box,
    y: 10 * box
  };
  d = undefined;
  food = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
  };
  clearInterval(game);
  game = setInterval(draw, speed);
}

// Обробляємо клавішу R для перезапуску гри
document.addEventListener("keydown", (event) => {
  if (event.keyCode === 82) {
    resetGame();
  }
});

// Починаємо гру з початковою швидкістю
let game = setInterval(draw, speed);

/**
 * Додаткові функції для кращої взаємодії
 */
function displayInstructions() {
  ctx.fillStyle = "yellow";
  ctx.font = "20px Arial";
  ctx.fillText("Use arrow keys to move", 5 * box, 2 * box);
  ctx.fillText("Press 1/2/3 to change speed", 5 * box, 2.5 * box);
  ctx.fillText("Press 'R' to reset the game", 5 * box, 3 * box);
}

// Виклик інструкцій при запуску гри
displayInstructions();

// Очищення інструкцій через деякий час
setTimeout(() => {
  ctx.clearRect(0, 0, canvas.width, 3 * box);
}, 5000);
