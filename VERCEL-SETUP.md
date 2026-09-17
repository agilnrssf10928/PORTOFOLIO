# Setup Vercel untuk `/setting`

## 1. Deploy folder yang benar

Di Vercel, import project ini dan gunakan folder `PORTOFOLIO-main` yang berisi `index.html`, `setting.html`, `api/`, dan `vercel.json` sebagai Root Directory.

## 2. Pasang storage

Buka Vercel Dashboard > project > **Storage** > buat atau hubungkan Redis/Upstash Redis. Pastikan environment berikut tersedia untuk Production, Preview, dan Development:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Data panel disimpan dengan key `portfolio_content`.

## 3. Buat password admin

Jangan masukkan password asli ke source code. Buat hash SHA-256 dari PowerShell lokal:

```powershell
$bytes = [Text.Encoding]::UTF8.GetBytes('GANTI_DENGAN_PASSWORD_KUAT')
$hash = [Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
-join ($hash | ForEach-Object { $_.ToString('x2') })
```

Tambahkan hasilnya di Vercel Project Settings > Environment Variables:

- `ADMIN_PASSWORD_HASH` = hasil hash di atas
- `SESSION_SECRET` = string acak panjang minimal 32 karakter

Setelah itu lakukan **Redeploy**.

## 4. Tes

Buka:

- Website: `https://domain-kamu.vercel.app/`
- Panel: `https://domain-kamu.vercel.app/setting`

Panel saat ini dapat mengubah nama, path/URL foto, deskripsi hero, dan Tentang Saya dalam bahasa Indonesia/English.

Catatan: field foto memakai path/URL gambar. Untuk mengganti file lokal seperti `foto.jpg`, unggah file tersebut bersama deployment berikutnya. Upload foto langsung dari panel memerlukan Vercel Blob dan token tambahan.
