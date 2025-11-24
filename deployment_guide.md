# Panduan Deployment ke Render.com

Panduan ini akan membantu anda deploy aplikasi SkoolCeria (Database, Backend, dan Frontend) ke Render.com secara percuma.

## Prasyarat
1.  Pastikan anda ada akaun [GitHub](https://github.com) dan [Render](https://render.com).
2.  Pastikan code anda sudah di-push ke GitHub repository (termasuk folder `backend` dan `frontend`).

---

## Langkah 1: Setup Database (PostgreSQL)
1.  Login ke Dashboard Render.
2.  Klik **New +** -> **PostgreSQL**.
3.  Isi maklumat:
    - **Name**: `skoolceria-db`
    - **Database**: `skoolceria`
    - **User**: `user`
    - **Region**: Singapore (Singapore) - *paling laju untuk Malaysia*
    - **Instance Type**: Free
4.  Klik **Create Database**.
5.  Tunggu sehingga status jadi "Available".
6.  Copy **Internal DB URL** (untuk Backend nanti).
7.  Copy **External Database URL** (untuk connect dari PC anda guna DBeaver/pgAdmin jika perlu).

---

## Langkah 2: Deploy Backend (Express.js)
1.  Klik **New +** -> **Web Service**.
2.  Connect repository GitHub anda.
3.  Isi maklumat:
    - **Name**: `skoolceria-api`
    - **Root Directory**: `backend`
    - **Environment**: Node
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
    - **Instance Type**: Free
4.  Scroll ke bawah ke bahagian **Environment Variables**, tambah:
    - `DB_USER`: (Copy dari dashboard database)
    - `DB_PASSWORD`: (Copy dari dashboard database)
    - `DB_NAME`: `skoolceria`
    - `DB_HOST`: (Hostname dari dashboard database, biasanya `dpg-xxxx-a`)
    - `DB_PORT`: `5432`
    - *Atau cara mudah:* Tambah satu variable `DATABASE_URL` dan paste **Internal DB URL** tadi. (Anda perlu update `db.js` sikit untuk support ini jika belum).
5.  Klik **Create Web Service**.
6.  Tunggu deploy selesai. Copy URL backend anda (contoh: `https://skoolceria-api.onrender.com`).

---

## Langkah 3: Setup Table Database
Sebab database baru kosong, kita kena create table.
1.  Di dashboard Backend (Web Service) anda, pergi ke tab **Shell**.
2.  Tunggu connected, kemudian taip:
    ```bash
    node scripts/update_schema.js
    ```
    *(Pastikan script ini wujud dan boleh run. Jika tidak, anda mungkin perlu connect guna DBeaver di PC anda guna External URL dan run SQL dalam `database/schema.sql`)*.

---

## Langkah 4: Deploy Frontend (Next.js)
1.  Klik **New +** -> **Web Service** (atau Static Site, tapi Web Service lebih stabil untuk Next.js SSR).
2.  Connect repository yang sama.
3.  Isi maklumat:
    - **Name**: `skoolceria-web`
    - **Root Directory**: `frontend`
    - **Environment**: Node
    - **Build Command**: `npm install && npm run build`
    - **Start Command**: `npm start`
    - **Instance Type**: Free
4.  Tambah **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: URL Backend anda tadi (contoh: `https://skoolceria-api.onrender.com`) - **PENTING: Jangan letak slash `/` di hujung**.
5.  Klik **Create Web Service**.

---

## Selesai!
Aplikasi anda kini live. Buka URL Frontend anda untuk test.

### Tips Troubleshooting
- Jika error "Connection refused", check Environment Variables database di Backend.
- Jika frontend tak boleh fetch data, check `NEXT_PUBLIC_API_URL` di Frontend dan pastikan Backend dah live.
- Check tab **Logs** di Render untuk tengok error.
