const API_URL = 'https://vistora-api.islamov2007islam.workers.dev';
let currentUser = null;
let videos = [];
let comments = [];

// ===== ПОЛЬЗОВАТЕЛЬ =====
async function loadUser() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/api/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            currentUser = await res.json();
            updateUIForUser();
        }
    } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
    }
}

function updateUIForUser() {
    if (currentUser?.avatar) {
        document.querySelectorAll('.user-avatar img').forEach(img => {
            img.src = currentUser.avatar;
        });
    }
    
    // Показываем админ-ссылку если нужно
    if (currentUser?.role === 'admin') {
        const adminLink = document.createElement('a');
        adminLink.href = 'admin.html';
        adminLink.className = 'nav-item';
        adminLink.innerHTML = '<i class="fas fa-cog"></i><span>Админка</span>';
        document.querySelector('.sidebar-nav')?.appendChild(adminLink);
    }
}

// ===== ВИДЕО =====
async function loadVideos(category = 'all', sort = 'date') {
    try {
        let url = `${API_URL}/api/videos`;
        if (category !== 'all') url += `?category=${category}`;
        
        const res = await fetch(url);
        if (res.ok) {
            videos = await res.json();
        } else {
            videos = getDemoVideos();
        }
    } catch {
        videos = getDemoVideos();
    }
    
    sortVideos(sort);
    return videos;
}

function getDemoVideos() {
    return [
        {
            id: 1,
            title: "iPhone 15 Pro Max — Полный обзор",
            channel: "TechMaster",
            channelIcon: "https://via.placeholder.com/36/ff0000",
            views: "1.2M",
            date: "2025-02-15",
            duration: "12:34",
            thumbnail: "https://img.youtube.com/vi/0pI5jvY4Tgs/maxresdefault.jpg",
            category: "tech"
        },
        {
            id: 2,
            title: "CS2 — Гайд для новичков 2025",
            channel: "GamePro",
            channelIcon: "https://via.placeholder.com/36/00ff00",
            views: "890K",
            date: "2025-02-14",
            duration: "25:10",
            thumbnail: "https://img.youtube.com/vi/edYCtaNueQY/maxresdefault.jpg",
            category: "games"
        }
    ];
}

function sortVideos(sortBy) {
    videos.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'views') {
            const viewsA = parseInt(a.views) || 0;
            const viewsB = parseInt(b.views) || 0;
            return viewsB - viewsA;
        }
        return 0;
    });
}

function displayVideos(videosToShow, containerId = 'videosGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = videosToShow.map(video => `
        <a href="video.html?id=${video.id}" class="video-card">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <div class="video-channel-icon">
                    <img src="${video.channelIcon || 'https://via.placeholder.com/36'}" alt="">
                </div>
                <div class="video-details">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-channel">${video.channel}</div>
                    <div class="video-stats">
                        <span>${video.views} просмотров</span>
                        <span class="separator">•</span>
                        <span>${formatDate(video.date)}</span>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

// ===== КОММЕНТАРИИ =====
async function loadComments(videoId) {
    try {
        const res = await fetch(`${API_URL}/api/comments/${videoId}`);
        if (res.ok) {
            comments = await res.json();
        }
    } catch {
        comments = [];
    }
    return comments;
}

async function addComment(videoId, text) {
    if (!currentUser) {
        alert('Войдите, чтобы комментировать');
        return false;
    }

    try {
        const res = await fetch(`${API_URL}/api/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                videoId,
                content: text,
                userId: currentUser.id
            })
        });
        return res.ok;
    } catch {
        return false;
    }
}

function displayComments(comments, containerId = 'commentsList') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (comments.length === 0) {
        container.innerHTML = '<p class="no-comments">Нет комментариев. Будьте первым!</p>';
        return;
    }

    container.innerHTML = comments.map(c => `
        <div class="comment">
            <img src="${c.avatar || 'https://via.placeholder.com/40'}" class="comment-avatar">
            <div class="comment-content">
                <strong>${c.username}</strong>
                <p>${c.content}</p>
                <small>${formatDate(c.created_at)}</small>
            </div>
        </div>
    `).join('');
}

// ===== РЕГИСТРАЦИЯ/ВХОД =====
async function registerUser(username, email, password) {
    try {
        const res = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            return { success: true };
        }
        return { success: false, error: data.message };
    } catch {
        return { success: false, error: 'Ошибка соединения' };
    }
}

async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            return { success: true };
        }
        return { success: false, error: data.message };
    } catch {
        return { success: false, error: 'Ошибка соединения' };
    }
}

function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    window.location.href = 'index.html';
}

// ===== ВСПОМОГАТЕЛЬНЫЕ =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    return date.toLocaleDateString('ru-RU');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    
    // Меню-бургер
    const menuBtn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    menuBtn?.addEventListener('click', () => {
        sidebar?.classList.toggle('closed');
        if (window.innerWidth <= 1024) {
            sidebar?.classList.toggle('mobile-open');
        }
    });
    
    // Поиск
    const searchForm = document.getElementById('searchForm');
    searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput')?.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });
});
