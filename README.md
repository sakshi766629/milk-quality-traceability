# AI-Based Stage-Wise Milk Quality Deviation Detection and Traceability System

Beginner-friendly academic prototype using React + Vite, Node.js + Express, and MongoDB.

## Features
- Responsive dashboard with sample batch counts
- Register milk batches and analyze sensor readings
- Demo prediction: NORMAL / QUALITY DEVIATION / HIGH DEVIATION
- Stage-wise readings and comparison
- Deviation alerts and recommended laboratory verification
- Batch search / traceability timeline
- QR code generation for each batch
- Seeded demo data (10 batches) when MongoDB is connected
- CSV export for batch list
- Print-friendly report view

> Academic prototype only. Sensor-based patterns do not prove the presence of a specific adulterant. Results are not a substitute for certified laboratory testing.

## Requirements
- Node.js 20+ recommended
- MongoDB Community Server running locally, or a MongoDB Atlas connection string

## Run backend
```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```
Windows PowerShell also supports `Copy-Item .env.example .env`.
Edit `server/.env` and set `MONGO_URI` if needed. Backend: http://localhost:5000

## Run frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the URL shown by Vite, usually http://localhost:5173.

## Demo mode
The frontend can still demonstrate the analysis page if MongoDB is not connected, but saving/listing batches requires the backend and database to be running. Seed sample data with `npm run seed`.

## Demo login
This starter uses a simple prototype role selector instead of production authentication. Do not use it for real personal data. A production version should add hashed passwords, JWT/session security, validation, authorization and audit logs.
