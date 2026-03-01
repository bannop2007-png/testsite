// script.js — ОБНОВЛЁННАЯ ВЕРСИЯ (замени весь файл полностью)

let users = JSON.parse(localStorage.getItem('users')) || [];

// Создаём админа при первом запуске
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

// Обновление шапки (работает на всех страницах)
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

    // Переключение темы
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
        });
    }
}

// === ОСНОВНАЯ ЛОГИКА ГЛАВНОЙ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', () => {
    // Тема
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light');
    }

    updateHeader();

    // === ЗАПОЛНЯЕМ ВИДЕО С data-category (чтобы фильтры работали) ===
    const grid = document.getElementById('videoGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="video-card" data-category="Программирование" onclick="location.href='video.html?id=1'">
                <div class="thumbnail"><img src="https://picsum.photos/id/1015/320/180" alt=""></div>
                <div class="video-info">
                    <h3>Как я начал программировать в 2026</h3>
                    <p>Islam Dev • 1.2K просмотров • 2 часа назад</p>
                </div>
            </div>
            <div class="video-card" data-category="Программирование" onclick="location.href='video.html?id=2'">
                <div class="thumbnail"><img src="https://picsum.photos/id/201/320/180" alt=""></div>
                <div class="video-info">
                    <h3>Создание сайта с нуля за 1 час</h3>
                    <p>Frontend Life • 980 просмотров • 5 часов назад</p>
                </div>
            </div>
            <div class="video-card" data-category="Программирование" onclick="location.href='video.html?id=3'">
                <div class="thumbnail"><img src="https://picsum.photos/id/301/320/180" alt=""></div>
                <div class="video-info">
                    <h3>CSS за 30 минут — Мастер-класс</h3>
                    <p>Code Start • 2.1K просмотров • вчера</p>
                </div>
            </div>
        `;
    }

    // === ФИЛЬТР КАТЕГОРИЙ (красная рамка теперь работает!) ===
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.textContent.trim();
            const cards = document.querySelectorAll('.video-card');

            cards.forEach(card => {
                if (filter === 'Все') {
                    card.style.display = 'block';
                } else {
                    card.style.display = (card.getAttribute('data-category') === filter) ? 'block' : 'none';
                }
            });
        });
    });

    // === ПОИСК (теперь работает!) ===
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.video-card');

            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(term) ? 'block' : 'none';
            });
        });
    }
});
