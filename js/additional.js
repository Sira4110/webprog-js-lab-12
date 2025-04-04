// Змінні для зберігання стану
let currentPage = 1;
const postsPerPage = 5;
let loadedPosts = [];
let loadedComments = {};

// 1. Функція для завантаження постів
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

// 2. Функція для завантаження коментарів до конкретного поста
async function fetchComments(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error(`Помилка при завантаженні коментарів для поста ${postId}:`, error);
        throw error;
    }
}

// 3. Функція для завантаження фотографій
async function fetchPhotos(limit = 10) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=${limit}`);
        
        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        
        const photos = await response.json();
        return photos;
    } catch (error) {
        console.error('Помилка при завантаженні фотографій:', error);
        throw error;
    }
}

// Функція для відображення постів з кнопками для завантаження коментарів
function displayPosts(posts) {
    const postsListElement = document.getElementById('postsList');
    postsListElement.innerHTML = '';
    
    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.setAttribute('data-post-id', post.id);
        
        postCard.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <small>Post ID: ${post.id}, User ID: ${post.userId}</small>
            <button class="comments-btn" data-post-id="${post.id}">Показати коментарі</button>
            <div class="comments-container" id="comments-${post.id}" style="display: none;"></div>
        `;
        
        postsListElement.appendChild(postCard);
    });
    
    // Додаємо обробники подій для кнопок коментарів
    document.querySelectorAll('.comments-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const postId = this.getAttribute('data-post-id');
            const commentsContainer = document.getElementById(`comments-${postId}`);
            
            // Змінюємо текст кнопки залежно від стану блоку коментарів
            if (commentsContainer.style.display === 'none') {
                // Показуємо коментарі
                if (loadedComments[postId]) {
                    // Якщо коментарі вже завантажені, просто показуємо їх
                    commentsContainer.style.display = 'block';
                    this.textContent = 'Приховати коментарі';
                } else {
                    // Якщо коментарі ще не завантажені, завантажуємо їх
                    this.textContent = 'Завантаження...';
                    this.disabled = true;
                    
                    try {
                        const comments = await fetchComments(postId);
                        loadedComments[postId] = comments;
                        
                        // Відображаємо коментарі
                        commentsContainer.innerHTML = '';
                        comments.forEach(comment => {
                            const commentElement = document.createElement('div');
                            commentElement.classList.add('comment');
                            commentElement.innerHTML = `
                                <h4>${comment.name}</h4>
                                <p>${comment.body}</p>
                                <small>Email: ${comment.email}</small>
                            `;
                            commentsContainer.appendChild(commentElement);
                        });
                        
                        commentsContainer.style.display = 'block';
                        this.textContent = 'Приховати коментарі';
                    } catch (error) {
                        commentsContainer.innerHTML = `<p class="error">Помилка при завантаженні коментарів: ${error.message}</p>`;
                        commentsContainer.style.display = 'block';
                    } finally {
                        this.disabled = false;
                    }
                }
            } else {
                // Приховуємо коментарі
                commentsContainer.style.display = 'none';
                this.textContent = 'Показати коментарі';
            }
        });
    });
}

// Функція для відображення фотографій у галереї
function displayPhotos(photos) {
    const photoGalleryElement = document.getElementById('photoGallery');
    photoGalleryElement.innerHTML = '';
    
    photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.classList.add('photo-item');
        
        photoItem.innerHTML = `
            <img src="${photo.thumbnailUrl}" alt="${photo.title}">
            <p>${photo.title}</p>
        `;
        
        photoGalleryElement.appendChild(photoItem);
    });
}

// Функція для завантаження постів
async function loadPosts() {
    try {
        const loadPostsBtn = document.getElementById('loadPostsBtn');
        loadPostsBtn.textContent = 'Завантаження...';
        loadPostsBtn.disabled = true;
        
        // Завантажуємо пости
        const posts = await fetchPosts(currentPage, postsPerPage);
        loadedPosts = posts;
        
        // Відображаємо пости
        displayPosts(posts);
        
    } catch (error) {
        console.error('Помилка при завантаженні постів:', error);
        const postsListElement = document.getElementById('postsList');
        postsListElement.innerHTML = `<p class="error">Помилка при завантаженні постів: ${error.message}</p>`;
    } finally {
        const loadPostsBtn = document.getElementById('loadPostsBtn');
        loadPostsBtn.textContent = 'Завантажити пости';
        loadPostsBtn.disabled = false;
    }
}

// Функція для оновлення постів (очищення та повторне завантаження)
async function refreshPosts() {
    // Скидаємо лічильник сторінок
    currentPage = 1;
    
    // Очищаємо кеш коментарів
    loadedComments = {};
    
    // Завантажуємо пости знову
    await loadPosts();
}

// Функція для завантаження фотографій
async function loadPhotos() {
    try {
        const loadPhotosBtn = document.getElementById('loadPhotosBtn');
        loadPhotosBtn.textContent = 'Завантаження...';
        loadPhotosBtn.disabled = true;
        
        // Завантажуємо фотографії
        const photos = await fetchPhotos();
        
        // Відображаємо фотографії
        displayPhotos(photos);
        
    } catch (error) {
        console.error('Помилка при завантаженні фотографій:', error);
        const photoGalleryElement = document.getElementById('photoGallery');
        photoGalleryElement.innerHTML = `<p class="error">Помилка при завантаженні фотографій: ${error.message}</p>`;
    } finally {
        const loadPhotosBtn = document.getElementById('loadPhotosBtn');
        loadPhotosBtn.textContent = 'Завантажити фотографії';
        loadPhotosBtn.disabled = false;
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Додаємо обробники подій для кнопок
    const loadPostsBtn = document.getElementById('loadPostsBtn');
    const refreshPostsBtn = document.getElementById('refreshPostsBtn');
    const loadPhotosBtn = document.getElementById('loadPhotosBtn');
    
    loadPostsBtn.addEventListener('click', loadPosts);
    refreshPostsBtn.addEventListener('click', refreshPosts);
    loadPhotosBtn.addEventListener('click', loadPhotos);
    
    // Завантажуємо пости одразу при відкритті сторінки
    loadPosts();
});