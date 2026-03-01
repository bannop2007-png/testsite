// ===== БАЗА ДАННЫХ ВИДЕО (БЕЗ СЕРВЕРА!) =====
const videosDatabase = [
    {
        id: 1,
        title: "iPhone 15 Pro Max — Обзор через год использования",
        channel: "TechMaster",
        channelId: "techmaster",
        channelAvatar: "https://via.placeholder.com/100/ff0000/ffffff?text=TM",
        views: "2.3M",
        date: "2025-02-15",
        duration: "18:24",
        thumbnail: "https://via.placeholder.com/640x360/ff0000/ffffff?text=iPhone+15",
        category: "tech",
        videoUrl: "videos/iphone-review.mp4", // или YouTube ссылку
        description: "Полный обзор iPhone 15 Pro Max. Рассказываю о плюсах и минусах.",
        likes: "125K",
        dislikes: "3K",
        comments: []
    },
    {
        id: 2,
        title: "MORGENSHTERN — НОВЫЙ ТРЕК 2025 (Премьера)",
        channel: "Music Zone",
        channelId: "musiczone",
        channelAvatar: "https://via.placeholder.com/100/00ff00/ffffff?text=MZ",
        views: "5.1M",
        date: "2025-02-14",
        duration: "3:45",
        thumbnail: "https://via.placeholder.com/640x360/00ff00/ffffff?text=Morgenshtern",
        category: "music",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Премьера нового трека!",
        likes: "500K",
        dislikes: "15K",
        comments: []
    },
    {
        id: 3,
        title: "CS2 — Как прокачать скилл за 1 день",
        channel: "GamePro",
        channelId: "gamepro",
        channelAvatar: "https://via.placeholder.com/100/0000ff/ffffff?text=GP",
        views: "890K",
        date: "2025-02-13",
        duration: "25:10",
        thumbnail: "https://via.placeholder.com/640x360/0000ff/ffffff?text=CS2",
        category: "games",
        videoUrl: "videos/cs2-guide.mp4",
        description: "Гайд для новичков и профи.",
        likes: "67K",
        dislikes: "2K",
        comments: []
    },
    {
        id: 4,
        title: "Новости России и мира — Главное за день",
        channel: "News24",
        channelId: "news24",
        channelAvatar: "https://via.placeholder.com/100/ffff00/000000?text=24",
        views: "1.1M",
        date: "2025-02-14",
        duration: "45:30",
        thumbnail: "https://via.placeholder.com/640x360/ffff00/000000?text=News",
        category: "news",
        videoUrl: "videos/news-today.mp4",
        description: "Самые важные события дня.",
        likes: "45K",
        dislikes: "8K",
        comments: []
    },
    {
        id: 5,
        title: "Зенит — Спартак: Обзор матча",
        channel: "Sport TV",
        channelId: "sporttv",
        channelAvatar: "https://via.placeholder.com/100/ff00ff/ffffff?text=Sport",
        views: "3.2M",
        date: "2025-02-12",
        duration: "15:45",
        thumbnail: "https://via.placeholder.com/640x360/ff00ff/ffffff?text=Zenit+Spartak",
        category: "sport",
        videoUrl: "videos/match-review.mp4",
        description: "Все голы и лучшие моменты.",
        likes: "230K",
        dislikes: "12K",
        comments: []
    },
    {
        id: 6,
        title: "Дюна 2 — Обзор фильма (без спойлеров)",
        channel: "CinemaTime",
        channelId: "cinematime",
        channelAvatar: "https://via.placeholder.com/100/00ffff/000000?text=CT",
        views: "4.5M",
        date: "2025-02-10",
        duration: "22:18",
        thumbnail: "https://via.placeholder.com/640x360/00ffff/000000?text=Dune+2",
        category: "movies",
        videoUrl: "videos/dune-review.mp4",
        description: "Стоит ли смотреть в кино?",
        likes: "340K",
        dislikes: "5K",
        comments: []
    }
];

// ===== ПОЛЬЗОВАТЕЛИ =====
const users = [
    {
        id: 1,
        name: "Иван Петров",
        email: "ivan@mail.ru",
        password: "123456",
        avatar: "https://via.placeholder.com/100",
        subscriptions: ["techmaster", "musiczone"],
        history: [],
        likedVideos: []
    }
];

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let currentUser = null;
let currentFilter = "all";
let currentSort = "date";
let displayedVideos = 6;

// ===== ЗАГРУЗКА ВИДЕО НА ГЛАВНУЮ =====
function loadVideos() {
    const videosGrid = document.getElementById('videosGrid');
    if (!videosGrid) return;

    let filteredVideos = [...videosDatabase];
    
    // Фильтрация по категории
    if (currentFilter !== "all") {
        filteredVideos = filteredVideos.filter(v => v.category === currentFilter);
    }
    
    // Сортировка
    filteredVideos.sort((a, b) => {
        switch(currentSort) {
            case "date":
                return new Date(b.date) - new Date(a.date);
            case "views":
                return parseInt(b.views) - parseInt(a.views);
            case "rating":
                return (parseInt(b.likes) - parseInt(b.dislikes)) - (parseInt(a.likes) - parseInt(a.dislikes));
            default:
                return 0;
        }
    });
    
    // Показываем только часть видео
    const videosToShow = filteredVideos.slice(0, displayedVideos);
    
    videosGrid.innerHTML = videosToShow.map(video => createVideoCard(video)).join('');
    
    // Обновляем кнопку "Загрузить ещё"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedVideos >= filteredVideos.length ? 'none' : 'flex';
    }
}

// ===== СОЗДАНИЕ КАРТОЧКИ ВИДЕО =====
function createVideoCard(video) {
    const date = new Date(video.date);
    const timeAgo = getTimeAgo(date);
    
    return `
        <a href="video.html?id=${video.id}" class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-channel">
                    <div class="channel-avatar">
                        <img src="${video.channelAvatar}" alt="${video.channel}">
                    </div>
                    <a href="channel.html?id=${video.channelId}" class="channel-name">${video.channel}</a>
                </div>
                <div class="video-stats">
                    <span><i class="fas fa-eye"></i> ${video.views}</span>
                    <span>•</span>
                    <span>${timeAgo}</span>
                </div>
            </div>
        </a>
    `;
}

// ===== ФОРМАТИРОВАНИЕ ДАТЫ =====
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            const ruUnit = {
                year: 'лет',
                month: 'месяцев',
                week: 'недель',
                day: 'дней',
                hour: 'часов',
                minute: 'минут'
            };
            return `${interval} ${ruUnit[unit]} назад`;
        }
    }
    
    return 'только что';
}

// ===== ЗАГРУЗКА СТРАНИЦЫ ВИДЕО =====
function loadVideoPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = parseInt(urlParams.get('id'));
    
    const video = videosDatabase.find(v => v.id === videoId);
    if (!video) {
        window.location.href = 'index.html';
        return;
    }
    
    // Обновляем заголовок страницы
    document.title = `${video.title} — Vistora`;
    
    // Заполняем контент
    document.getElementById('videoTitle').textContent = video.title;
    document.getElementById('videoViews').textContent = `${video.views} просмотров`;
    document.getElementById('videoDate').textContent = formatDate(video.date);
    document.getElementById('videoDescription').textContent = video.description;
    document.getElementById('channelName').textContent = video.channel;
    document.getElementById('channelAvatar').src = video.channelAvatar;
    document.getElementById('videoLikes').textContent = formatNumber(video.likes);
    
    // Настраиваем плеер
    const playerContainer = document.getElementById('videoPlayer');
    if (video.videoUrl.includes('youtube.com')) {
        playerContainer.innerHTML = `<iframe src="${video.videoUrl}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        playerContainer.innerHTML = `<video src="${video.videoUrl}" controls></video>`;
    }
    
    // Загружаем рекомендации
    loadRecommendations(video.category, video.id);
}

// ===== ФОРМАТИРОВАНИЕ ЧИСЕЛ =====
function formatNumber(num) {
    if (typeof num === 'string') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ===== ЗАГРУЗКА РЕКОМЕНДАЦИЙ =====
function loadRecommendations(category, currentVideoId) {
    const recommendations = videosDatabase
        .filter(v => v.category === category && v.id !== currentVideoId)
        .slice(0, 8);
    
    const container = document.getElementById('recommendations');
    if (container) {
        container.innerHTML = recommendations.map(v => createVideoCard(v)).join('');
    }
}

// ===== ПОИСК =====
function setupSearch() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById('searchInput').value.toLowerCase();
        
        const results = videosDatabase.filter(v => 
            v.title.toLowerCase().includes(query) || 
            v.channel.toLowerCase().includes(query) ||
            v.description.toLowerCase().includes(query)
        );
        
        // Сохраняем результаты в localStorage для страницы поиска
        localStorage.setItem('searchResults', JSON.stringify(results));
        localStorage.setItem('searchQuery', query);
        window.location.href = 'search.html';
    });
}

// ===== МЕНЮ =====
function setupMenu() {
    const menuBtn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }
}

// ===== ФИЛЬТРЫ =====
function setupFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach((chip, index) => {
        chip.addEventListener('click', () => {
            // Убираем active у всех
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add
