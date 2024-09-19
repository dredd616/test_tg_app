const game = document.getElementById("game");
const character = document.getElementById("character");
const box = document.getElementById("box");
const house = document.getElementById("house");
let hearts = 3; // Изначальное количество жизней
const heartsDisplay = document.getElementById("heartsDisplay"); // Элемент для отображения жизней
const backgroundMusic = document.getElementById("backgroundMusic"); // Элемент для музыки
const musicToggle = document.getElementById("musicToggle"); // Кнопка управления музыкой
const startButton = document.getElementById("startButton"); // Кнопка старта игры
const restartButton = document.getElementById("restartButton"); // Кнопка перезапуска

let isJumping = false; // Флаг для отслеживания состояния прыжка
let isColliding = false; // Флаг для отслеживания состояния коллизии
let collisionInterval; // Переменная для интервала проверки коллизий

// Установите уровень громкости (от 0.0 до 1.0)
backgroundMusic.volume = 0.5; // Установите громкость на 50%

// Переменная для отслеживания состояния музыки
let isMusicPlaying = true; // Изначально музыка включена

const jump = (e, isMobile = false) => {
  if (e.code === "Space" || isMobile) {
    if (!isJumping) {
      character.classList.add("jump");
      isJumping = true; // Устанавливаем флаг, что персонаж прыгает
    }
  }
};

// Обработчик касания экрана (для мобильных устройств)
document.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Предотвращаем прокрутку страницы при касании
  jump(e, true);
});

// Событие завершения анимации прыжка
character.addEventListener("animationend", () => {
  character.classList.remove("jump");
  isJumping = false; // Сбрасываем флаг после завершения анимации
});

// Проверка на столкновение
const checkCollision = () => {
  const characterRect = character.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();

  const isCurrentlyColliding =
    characterRect.x < boxRect.x + boxRect.width &&
    characterRect.x + characterRect.width > boxRect.x &&
    characterRect.y < boxRect.y + boxRect.height &&
    characterRect.y + characterRect.height > boxRect.y;

  if (isCurrentlyColliding) {
    console.log("Collision detected!"); // Отладочное сообщение

    if (!isColliding) {
      hearts--; // Уменьшаем количество жизней
      heartsDisplay.textContent = `Hearts: ${hearts}`; // Обновляем отображение жизней
      console.log(`Hearts decreased: ${hearts}`); // Отладочное сообщение
      isColliding = true; // Устанавливаем флаг коллизии

      if (hearts <= 0) {
        box.classList.remove("boxMove");
        game.classList.remove("bgMove");
        alert("Game Over!"); // Выводим сообщение об окончании игры
        clearInterval(collisionInterval); // Останавливаем проверку столкновения
        restartButton.style.display = "block"; // Показываем кнопку перезапуска игры
        startButton.style.display = "block"; // Показываем кнопку старта игры
        heartsDisplay.textContent = `Hearts: 3`;
      }
    }
  } else {
    isColliding = false; // Сбрасываем флаг коллизии, если столкновения нет
  }
};

// Обработчик нажатия клавиш
document.addEventListener("keydown", jump);

// Функция для запуска игры
const startGame = () => {
  hearts = 3;
  heartsDisplay.textContent = `Hearts: ${hearts}`;
  isJumping = false;
  isColliding = false;

  game.classList.add("bgMove");
  box.classList.add("boxMove");
  house.style.display = "none";
  box.style.display = "block";
  character.style.display = "block";
  character.classList.remove("goToHouse");

  restartButton.style.display = "none"; // Скрываем кнопку перезапуска
  startButton.style.display = "none"; // Скрываем кнопку старта

  collisionInterval = setInterval(checkCollision, 100); // Запускаем проверку столкновения снова

  if (isMusicPlaying) {
    backgroundMusic.play(); // Запускаем музыку при старте игры.
  }

  setTimeout(() => {
    if (hearts > 0) {
      box.style.display = "none"; // Скрываем коробки после 30 секунд игры
      house.style.display = "block"; // Показываем дом после исчезновения коробок
      character.classList.remove("jump");
      character.classList.add("goToHouse");
    }
  }, 30000); // Через 30 секунд (30000 миллисекунд)
};

// Обработчик кнопки для управления музыкой
musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    musicToggle.textContent = "Pause Music"; // Изменяем текст кнопки на "Пауза"
    isMusicPlaying = true; // Устанавливаем флаг, что музыка играет
  } else {
    backgroundMusic.pause();
    musicToggle.textContent = "Play Music"; // Изменяем текст кнопки на "Играть"
    isMusicPlaying = false; // Устанавливаем флаг, что музыка остановлена
  }
});

// Обработчик кнопки старта игры
startButton.addEventListener("click", startGame);

// Обработчик кнопки перезапуска игры
restartButton.addEventListener("click", () => {
  startGame();
  restartButton.style.display = "none"; // Скрываем кнопку перезапуска при начале новой игры.
});

// Проверка достижения дома персонажем
const checkHouseCollision = () => {
  const characterRect = character.getBoundingClientRect();
  const houseRect = house.getBoundingClientRect();

  const isHouseColliding =
    characterRect.x < houseRect.x + houseRect.width &&
    characterRect.x + characterRect.width > houseRect.x &&
    characterRect.y < houseRect.y + houseRect.height &&
    characterRect.y + characterRect.height > houseRect.y;

  if (isHouseColliding) {
    alert("Вы прошли игру!"); // Выводим сообщение о прохождении игры

    clearInterval(collisionInterval); // Останавливаем проверку столкновения при достижении дома.
    restartButton.style.display = "none"; // Показываем кнопку перезапуска игры.
    startButton.style.display = "block"; // Показываем кнопку старта игры.
    character.style.display = "none";
    game.classList.remove("bgMove");
  }
};

// Запуск проверки столкновения с домом каждую секунду после появления дома.
setInterval(checkHouseCollision, 1000);
