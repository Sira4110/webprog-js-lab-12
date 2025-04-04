// Змінні для зберігання стану пагінації
let currentPage = 1;
const postsPerPage = 5;

// Функція для завантаження постів з пагінацією
async function fetchPosts(page, limit) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Помилка при завантаженні постів:', error);
        throw error;
    }
}

// Функція для відображення постів на сторінці
function displayPosts(posts, append = false) {
    const postsListElement = document.getElementById('postsList');
    
    // Якщо append = false, очищаємо список перед додаванням нових постів
    if (!append) {
        postsListElement.innerHTML = '';
    }
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <small>Post ID: ${post.id}, User ID: ${post.userId}</small>
        `;
        
        postsListElement.appendChild(postCard);
    });
}

// Функція для завантаження наступної сторінки постів
async function loadMorePosts() {
    try {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.textContent = 'Завантаження...';
        loadMoreBtn.disabled = true;
        
        // Збільшуємо номер поточної сторінки
        currentPage++;
        
        // Завантажуємо наступну сторінку постів
        const posts = await fetchPosts(currentPage, postsPerPage);
        
        // Додаємо пости до існуючих (параметр append = true)
        displayPosts(posts, true);
        
    } catch (error) {
        console.error('Помилка при завантаженні додаткових постів:', error);
        const postsListElement = document.getElementById('postsList');
        
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error');
        errorMessage.textContent = `Помилка при завантаженні додаткових постів: ${error.message}`;
        
        postsListElement.appendChild(errorMessage);
    } finally {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.textContent = 'Завантажити ще';
        loadMoreBtn.disabled = false;
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Завантажуємо першу сторінку постів
        const initialPosts = await fetchPosts(currentPage, postsPerPage);
        displayPosts(initialPosts);
        
    } catch (error) {
        console.error('Помилка при початковому завантаженні постів:', error);
        const postsListElement = document.getElementById('postsList');
        postsListElement.innerHTML = `<p class="error">Помилка при завантаженні постів: ${error.message}</p>`;
    }
    
    // Додаємо обробник подій для кнопки "Завантажити ще"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', loadMorePosts);
});