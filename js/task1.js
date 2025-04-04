// Функція, яка повертає число через проміс із затримкою 2 секунди
function fetchNumber() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            resolve(randomNumber);
        }, 2000);
    });
}

// Функція, яка симулює помилку
function fetchNumberWithError() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Сталася помилка при отриманні числа"));
        }, 2000);
    });
}

// Асинхронна функція для отримання числа з обробкою помилок
async function getNumber() {
    const resultElement = document.getElementById('result');
    
    try {
        resultElement.textContent = "Очікуємо число...";
        
        // Використовуємо await для очікування результату промісу
        const number = await fetchNumber();
        
        resultElement.textContent = `Отримане число: ${number}`;
    } catch (error) {
        // Обробка помилок
        resultElement.textContent = `Помилка: ${error.message}`;
        resultElement.classList.add('error');
    }
}

// Асинхронна функція для демонстрації обробки помилок
async function getNumberWithError() {
    const resultElement = document.getElementById('result');
    resultElement.classList.remove('error');
    
    try {
        resultElement.textContent = "Очікуємо число...";
        
        // Використовуємо await для очікування результату промісу з помилкою
        const number = await fetchNumberWithError();
        
        resultElement.textContent = `Отримане число: ${number}`;
    } catch (error) {
        // Обробка помилок
        resultElement.textContent = `Помилка: ${error.message}`;
        resultElement.classList.add('error');
    }
}

// Додаємо обробники подій на кнопки
document.addEventListener('DOMContentLoaded', () => {
    const getNumberBtn = document.getElementById('getNumberBtn');
    const getErrorBtn = document.getElementById('getErrorBtn');
    
    getNumberBtn.addEventListener('click', getNumber);
    getErrorBtn.addEventListener('click', getNumberWithError);
});