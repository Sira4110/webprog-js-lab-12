// Функція для завантаження всіх користувачів
async function fetchUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Перевіряємо, чи успішний запит
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        // Перетворюємо відповідь у JSON
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Помилка при завантаженні користувачів:', error);
        throw error;
    }
}

// Функція для пошуку користувача за ID
async function fetchUserById(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        
        // Перевіряємо, чи успішний запит
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        // Перетворюємо відповідь у JSON
        const user = await response.json();
        return user;
    } catch (error) {
        console.error(`Помилка при завантаженні користувача з ID ${id}:`, error);
        throw error;
    }
}

// Функція для відображення користувачів на сторінці
function displayUsers(users) {
    const usersListElement = document.getElementById('usersList');
    usersListElement.innerHTML = '';
    
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> ${user.website}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
        `;
        
        usersListElement.appendChild(userCard);
    });
}

// Функція для відображення одного користувача у блоці результатів
function displayUser(user) {
    const userResultElement = document.getElementById('userResult');
    
    userResultElement.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
    `;
}

// Ініціалізація обробників подій після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    const loadUsersBtn = document.getElementById('loadUsersBtn');
    const findUserBtn = document.getElementById('findUserBtn');
    const userIdInput = document.getElementById('userId');
    const userResultElement = document.getElementById('userResult');
    
    // Обробник події для завантаження всіх користувачів
    loadUsersBtn.addEventListener('click', async () => {
        try {
            // Змінюємо текст кнопки під час завантаження
            loadUsersBtn.textContent = 'Завантаження...';
            loadUsersBtn.disabled = true;
            
            // Завантажуємо та відображаємо користувачів
            const users = await fetchUsers();
            displayUsers(users);
            
        } catch (error) {
            // Виводимо помилку, якщо щось пішло не так
            const usersListElement = document.getElementById('usersList');
            usersListElement.innerHTML = `<p class="error">Помилка при завантаженні користувачів: ${error.message}</p>`;
        } finally {
            // Повертаємо початковий стан кнопки
            loadUsersBtn.textContent = 'Завантажити список користувачів';
            loadUsersBtn.disabled = false;
        }
    });
    
    // Обробник події для пошуку користувача за ID
    findUserBtn.addEventListener('click', async () => {
        const userId = userIdInput.value;
        
        // Перевіряємо, чи введений ID
        if (!userId || userId < 1) {
            userResultElement.innerHTML = '<p class="error">Будь ласка, введіть коректний ID користувача (більше 0)</p>';
            return;
        }
        
        try {
            // Змінюємо текст кнопки під час завантаження
            findUserBtn.textContent = 'Пошук...';
            findUserBtn.disabled = true;
            
            // Шукаємо та відображаємо користувача
            const user = await fetchUserById(userId);
            displayUser(user);
            
        } catch (error) {
            // Виводимо помилку, якщо щось пішло не так
            userResultElement.innerHTML = `<p class="error">Помилка при пошуку користувача: ${error.message}</p>`;
        } finally {
            // Повертаємо початковий стан кнопки
            findUserBtn.textContent = 'Знайти';
            findUserBtn.disabled = false;
        }
    });
});