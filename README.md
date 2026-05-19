# 🖥️ IT Project Dashboard — Web Version

Live dashboard ดึงข้อมูลจาก Notion "All Projects – Task Board" แสดงบนเว็บ

---

## 🚀 Deploy บน Vercel (ฟรี — แนะนำ)

### ขั้นตอน

**1. สร้าง Notion Integration Token**
- ไปที่ https://www.notion.so/my-integrations
- คลิก **"+ New integration"**
- ตั้งชื่อ เช่น `IT Dashboard`
- คัดลอก **Internal Integration Token** (ขึ้นต้นด้วย `secret_...`)
- ไปที่ Notion database → **"..." menu → Connections → Add connection → IT Dashboard**

**2. Push โค้ดขึ้น GitHub**
```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/it-dashboard.git
git push -u origin main
```

**3. Deploy บน Vercel**
- ไปที่ https://vercel.com → New Project → Import from GitHub
- เลือก repo → Deploy
- ไปที่ **Settings → Environment Variables** เพิ่ม:
  - Key: `NOTION_TOKEN`
  - Value: `secret_xxxxxxxxxxxxx` (token จากขั้นตอน 1)
- กด **Redeploy**

✅ Dashboard พร้อมใช้ที่ `https://your-project.vercel.app`

---

## 💻 รันบนเครื่อง (Local)

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. ตั้งค่า token
cp .env.example .env
# แก้ไข .env ใส่ NOTION_TOKEN

# 3. รัน server
node server.js

# เปิด http://localhost:3000
```

---

## 📁 โครงสร้างไฟล์

```
it-dashboard-web/
├── api/
│   └── notion.js        ← Vercel serverless function (Notion API proxy)
├── public/
│   └── index.html       ← Dashboard UI
├── server.js            ← Local dev server
├── package.json
├── vercel.json
└── .env.example
```

---

## ⚙️ ปรับแต่ง

- **Database ID**: แก้ใน `api/notion.js` บรรทัด `const DB_ID = '...'`
- **สี / layout**: แก้ใน `public/index.html` ส่วน `<style>`
- **Refresh อัตโนมัติ**: ข้อมูลจะดึงใหม่ทุกครั้งที่ reload หน้า
  - หากต้องการ auto-refresh ทุก N นาที เพิ่มใน HTML:
    `setTimeout(() => location.reload(), 5 * 60 * 1000); // 5 นาที`
