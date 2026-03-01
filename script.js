// script.js — ОБЩИЙ ФАЙЛ (создай новый)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Добавляем админа при первом запуске
if (!users.find(u => u.username === 'admin')) {
    users.push({
        id: Date.now(),
        username: 'admin',
        email: 'admin@vistora.ru',
        password: 'admin123',
        role: 'admin'
    });
    localStorage.setItem('users', JSON.stringify(users));
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function logout() {
    localStorage.removeItem('currentUser');
    location.href = 'index.html';
}

function isAdmin() {
    const u = getCurrentUser();
    return u && (u.username === 'admin' || u.role === 'admin');
}

// Обновление шапки на всех страницах
function updateHeader() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    
    const user = getCurrentUser();
    let html = `<button id="themeToggle">🌙</button>`;
    
    if (user) {
        html += `
            <a href="profile.html" class="btn">👤 ${user.username}</a>
            ${isAdmin() ? `<a href="admin.html" class="btn">🔧 Админ</a>` : ''}
            <button onclick="logout()" class="btn">Выйти</button>
        `;
    } else {
        html += `
            <a href="login.html" class="btn">Войти</a>
            <a href="register.html" class="btn primary">Регистрация</a>
        `;
    }
    nav.innerHTML = html;

    // Тема
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
        });
    }
}

// Запуск на всех страницах
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
    updateHeader();

    // Заполняем видео на главной (можно потом сделать из localStorage)
    if (document.getElementById('videoGrid')) {
        const grid = document.getElementById('videoGrid');
        grid.innerHTML = `
            <div class="video-card" onclick="location.href='video.html?id=1'">
                <div class="thumbnail"><img src="https://picsum.photos/id/1015/320/180" alt=""></div>
                <div class="video-info">
                    <h3>Как я начал программировать в 2026</h3>
                    <p>Islam Dev • 1.2K просмотров • 2 часа назад</p>
                </div>
            </div>
            <div class="video-card" onclick="location.href='video.html?id=2'">
                <div class="thumbnail"><img src="https://picsum.photos/id/201/320/180" alt=""></div>
                <div class="video-info">
                    <h3>Создание сайта с нуля за 1 час</h3>
                    <p>Frontend Life • 980 просмотров • 5 часов назад</p>
                </div>
            </div>
            <div class="video-card" onclick="location.href='video.html?id=3'">
                <div class="thumbnail"><img src="https://picsum.photos/id/301/320/180" alt=""></div>
                <div class="video-info">
                    <h3>CSS за 30 минут — Мастер-класс</h3>
                    <p>Code Start • 2.1K просмотров • вчера</p>
                </div>
            </div>
        `;
    }
});
