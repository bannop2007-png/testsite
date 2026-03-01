// script.js — ПОЛНАЯ ВЕРСИЯ (замени весь файл)

let users = JSON.parse(localStorage.getItem('users')) || [];
let videos = JSON.parse(localStorage.getItem('videos')) || [
    {id:1, title:"Как я начал программировать в 2026", channel:"Islam Dev", views:"1.2K", time:"2 часа назад", thumbnail:"https://picsum.photos/id/1015/320/180", duration:"12:45", category:"Программирование"},
    {id:2, title:"Создание сайта с нуля за 1 час", channel:"Frontend Life", views:"980", time:"5 часов назад", thumbnail:"https://picsum.photos/id/201/320/180", duration:"08:20", category:"Программирование"},
    {id:3, title:"CSS за 30 минут — Мастер-класс", channel:"Code Start", views:"2.1K", time:"вчера", thumbnail:"https://picsum.photos/id/301/320/180", duration:"31:15", category:"Программирование"}
];

if (!users.find(u => u.username === 'admin')) {
    users.push({id: Date.now(), username: 'admin', email: 'admin@vistora.ru', password: 'admin123', role: 'admin'});
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() { return JSON.parse(localStorage.getItem('currentUser')); }
function logout() { localStorage.removeItem('currentUser'); location.href = 'index.html'; }
function isAdmin() {
    const u = getCurrentUser();
    return u && (u.username === 'admin' || u.username.toLowerCase() === 'islam');
}

function updateHeader() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const user = getCurrentUser();
    let html = `<button id="themeToggle">🌙</button>`;
    if (user) {
        html += `<a href="profile.html" class="btn">👤 ${user.username}</a>`;
        html += `<button onclick="logout()" class="btn">Выйти</button>`;
    } else {
        html += `<a href="login.html" class="btn">Войти</a><a href="register.html" class="btn primary">Регистрация</a>`;
    }
    nav.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
    updateHeader();

    // === ГЛАВНАЯ — ВИДЕО ===
    const grid = document.getElementById('videoGrid');
    if (grid) {
        grid.innerHTML = videos.map(v => `
            <div class="video-card" data-category="${v.category}" onclick="location.href='video.html?id=${v.id}'">
                <div class="thumbnail">
                    <img src="${v.thumbnail}" alt="">
                    <div class="duration">${v.duration}</div>
                </div>
                <div class="video-info">
                    <div class="channel-avatar">👤</div>
                    <div>
                        <h3>${v.title} <span class="verified">✔</span></h3>
                        <p>${v.channel}</p>
                        <p>${v.views} просмотров • ${v.time}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Фильтры и поиск (как раньше)
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const filter = chip.textContent.trim();
            document.querySelectorAll('.video-card').forEach(card => {
                card.style.display = (filter === 'Все' || card.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            document.querySelectorAll('.video-card').forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(term) ? 'block' : 'none';
            });
        });
    }
});

// === ФУНКЦИИ ДЛЯ АДМИНКИ ===
window.deleteUser = function(id) {
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    location.reload();
};

window.deleteVideo = function(id) {
    videos = videos.filter(v => v.id !== id);
    localStorage.setItem('videos', JSON.stringify(videos));
    location.reload();
};

window.addNewVideo = function() {
    const title = prompt('Название видео:');
    if (!title) return;
    const newVideo = {
        id: Date.now(),
        title: title,
        channel: getCurrentUser().username,
        views: '0',
        time: 'только что',
        thumbnail: 'https://picsum.photos/id/' + Math.floor(Math.random()*100) + '/320/180',
        duration: '10:00',
        category: 'Программирование'
    };
    videos.push(newVideo);
    localStorage.setItem('videos', JSON.stringify(videos));
    alert('✅ Видео добавлено!');
    location.reload();
};
