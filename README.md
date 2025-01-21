# Sistem Perpustakaan Online

## Deskripsi
Ini adalah sistem perpustakaan online yang dibangun menggunakan Node.js. Sistem ini memungkinkan pengguna untuk mendaftar, masuk, meminjam buku, dan mengembalikannya. Admin dapat memantau buku yang terlambat dikembalikan dan mengelola proses peminjaman. Sistem memastikan bahwa setiap pengguna hanya dapat meminjam satu buku dalam satu waktu.

## Fitur
- **Registrasi dan Login Pengguna**
  - Validasi email untuk memastikan format email yang benar (contoh: `@gmail.com`, `@hotmail.com`).
  - Validasi password untuk memastikan minimal 8 karakter alfanumerik, mengandung setidaknya satu huruf kapital, dan tanpa karakter khusus.
  - Tidak dapat mendaftar dengan email yang sudah terdaftar.

- **Peminjaman Buku**
  - Pengguna dapat meminjam satu buku dalam satu waktu.
  - Buku memiliki periode peminjaman selama 7 hari.

- **Pengembalian Buku**
  - Pengguna harus mengembalikan buku yang dipinjam sebelum dapat meminjam buku lain.

- **Pemantauan Admin**
  - Admin dapat melihat buku yang terlambat dikembalikan atau masih dalam status peminjaman.

## Endpoint

### Endpoint Pengguna

#### Registrasi Pengguna
**POST** `/register`
- **Body Permintaan:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Respon:**
  - 201: Pengguna berhasil terdaftar.
  - 400: Format email/password tidak valid atau email sudah terdaftar.

#### Login Pengguna
**POST** `/login`
- **Body Permintaan:**
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
- **Respon:**
  - 200: Login berhasil.
  - 400: Email atau password tidak valid.

### Endpoint Buku

#### Melihat Daftar Buku Tersedia
**GET** `/books`
- **Respon:**
  ```json
  [
    {
      "id": 1,
      "title": "Book One",
      "borrowedBy": null,
      "dueDate": null
    },
    {
      "id": 2,
      "title": "Book Two",
      "borrowedBy": "user-id",
      "dueDate": "2025-01-28T00:00:00.000Z"
    }
  ]
  ```

#### Meminjam Buku
**POST** `/borrow`
- **Body Permintaan:**
  ```json
  {
    "userId": "user-id",
    "bookId": 1
  }
  ```
- **Respon:**
  - 200: Buku berhasil dipinjam dengan tanggal jatuh tempo.
  - 400: Pengguna sudah meminjam buku atau buku sudah dipinjam.
  - 404: Pengguna atau buku tidak ditemukan.

#### Mengembalikan Buku
**POST** `/return`
- **Body Permintaan:**
  ```json
  {
    "userId": "user-id",
    "bookId": 1
  }
  ```
- **Respon:**
  - 200: Buku berhasil dikembalikan.
  - 404: Buku tidak ditemukan atau bukan dipinjam oleh pengguna ini.

### Endpoint Admin

#### Melihat Buku Terlambat Dikembalikan
**GET** `/admin/overdue`
- **Respon:**
  ```json
  [
    {
      "id": 1,
      "title": "Book One",
      "borrowedBy": "user-id",
      "dueDate": "2025-01-14T00:00:00.000Z"
    }
  ]
  ```

## Instalasi
1. Clone repository:
   ```bash
   git clone <repository-url>
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd Gefima-Test-BE
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Jalankan server:
   ```bash
   node app.js
   ```

5. Akses aplikasi di `http://localhost:3000`.

## Teknologi yang Digunakan
- Node.js
- Express.js
- bcrypt (untuk hashing password)
- uuid (untuk ID pengguna unik)

