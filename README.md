📦 Sui Logistics (Decentralized Supply Chain)

Sistem pelacakan rantai pasok (supply chain) terdesentralisasi yang transparan, aman, dan futuristik.

Aplikasi ini dibangun di atas blockchain Sui Network untuk menjamin keaslian data produk mulai dari pabrik hingga ke tangan konsumen. Dilengkapi dengan visualisasi 3D interaktif dan pelacakan berbasis QR Code.

🌐 Live Demo

Cobain langsung aplikasinya di sini:

👉 sui-supply-chain-dapp.vercel.app

(Pastikan kamu sudah menginstall Sui Wallet (Slush) dan terhubung ke jaringan Testnet)

✨ Fitur Unggulan

🏭 Factory Minting (Produksi):
Pabrik dapat mencetak "Digital Twin" dari produk fisik sebagai objek on-chain yang unik.

📦 Real-time Tracking:
Pantau status dan perpindahan tangan barang secara transparan. Setiap perubahan status tercatat abadi di blockchain (Immutable).

🧊 3D Visualization:
Menampilkan representasi paket dalam bentuk 3D interaktif (menggunakan React Three Fiber) untuk pengalaman pengguna yang imersif.

📱 QR Code Verification:
Setiap barang memiliki QR Code unik yang digenerate otomatis berdasarkan ID Blockchain-nya. Scan untuk verifikasi keaslian!

🛠️ Teknologi (Tech Stack)

Blockchain: Sui Network (Testnet)

Smart Contract: Sui Move Language

Frontend: React + Vite (TypeScript)

Wallet Integration: @mysten/dapp-kit

3D Engine: Three.js & React Three Fiber

Styling: Custom CSS (Glassmorphism & Dark Mode UI)

🚀 Cara Menjalankan di Lokal

Jika ingin mengutak-atik kodenya di komputer sendiri:

Clone Repository

git clone [https://github.com/Ov3rkill15/sui-supply-chain-dapp.git](https://github.com/Ov3rkill15/sui-supply-chain-dapp.git)
cd sui-supply-chain-dapp


Install Dependencies

cd src # atau folder root project
npm install
# Jika error, gunakan: npm install --legacy-peer-deps


Jalankan Frontend

npm run dev


Buka http://localhost:5173 di browser.

📜 Lisensi

Project ini dibuat sebagai bagian dari Web3 Bootcamp untuk tujuan pembelajaran (Educational Purpose).

Author: [Alwan Suryadi]
