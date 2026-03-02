export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        try {
            // Создаём таблицы, если их нет
            await env.DB.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    avatar TEXT DEFAULT 'https://via.placeholder.com/100',
                    role TEXT DEFAULT 'user',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            await env.DB.exec(`
                CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    video_url TEXT NOT NULL,
                    thumbnail TEXT,
                    category TEXT,
                    views INTEGER DEFAULT 0,
                    likes INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `);

            // Получить все видео
            if (url.pathname === '/api/videos' && request.method === 'GET') {
                const { results } = await env.DB.prepare(`
                    SELECT v.*, u.username as channel 
                    FROM videos v 
                    JOIN users u ON v.user_id = u.id 
                    ORDER BY v.created_at DESC
                `).all();
                return Response.json(results, { headers: corsHeaders });
            }

            // Регистрация
            if (url.pathname === '/api/register' && request.method === 'POST') {
                const { username, email, password } = await request.json();
                
                const existing = await env.DB.prepare(
                    'SELECT id FROM users WHERE email = ? OR username = ?'
                ).bind(email, username).first();
                
                if (existing) {
                    return Response.json({ 
                        success: false, 
                        message: 'Пользователь уже существует' 
                    }, { headers: corsHeaders });
                }

                const { success } = await env.DB.prepare(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
                ).bind(username, email, password).run();
                
                return Response.json({ 
                    success: true, 
                    message: 'Регистрация успешна' 
                }, { headers: corsHeaders });
            }

            // Вход
            if (url.pathname === '/api/login' && request.method === 'POST') {
                const { email, password } = await request.json();
                
                const user = await env.DB.prepare(
                    'SELECT id, username, email, avatar, role FROM users WHERE email = ? AND password = ?'
                ).bind(email, password).first();
                
                if (user) {
                    return Response.json({ 
                        success: true, 
                        user,
                        token: btoa(user.id + ':' + Date.now())
                    }, { headers: corsHeaders });
                } else {
                    return Response.json({ 
                        success: false, 
                        message: 'Неверный email или пароль' 
                    }, { headers: corsHeaders });
                }
            }

            return new Response('Vistora API работает', { headers: corsHeaders });

        } catch (error) {
            return Response.json({ 
                success: false, 
                error: error.message 
            }, { 
                status: 500, 
                headers: corsHeaders 
            });
        }
    }
};
