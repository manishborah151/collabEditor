# 📄 CollabEditor

**CollabEditor** is a real-time collaborative document editor built with **React**, **Quill**, **Socket.IO**, and **Node.js**. It allows multiple users to edit a shared document simultaneously, without the need for login or registration.

---

## 🛠 Technologies Used
  - Frontend: React, Vite, Quill.js

  - Backend: Node.js, Express, Socket.IO

  - Data Storage: Local JSON files (one per room)

---

## ✨ Features

- 🧑‍🤝‍🧑 Real-time multi-user document collaboration
- ✍️ Rich text formatting with [Quill](https://quilljs.com/)
- 🔗 Join/edit documents via shared room URL
- 💾 Autosaves content every minute (to JSON)
- 💾 Manual save with `Ctrl + S`
- 🌐 No authentication required
- ⚡ Powered by WebSockets (Socket.IO)


---

## 📁 Project Structure
```
collabEditor/
├── client/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ │ └── Editor.jsx
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── socket.js
│ ├── index.html
│ └── vite.config.js
├── server/ 
│ ├── server.js
│ └── rooms/ 
├── package.json
└── README.md
```

## 🔗 Usage
  - Open the app in the browser.

  - Enter a username and create or join a room (e.g., /room/abc123).

  - Share the URL with others to collaborate in real-time.

  - Press Ctrl + S to manually save. Content is autosaved every 60 seconds to the server’s rooms/ folder.

---

## 📌 Notes

Data is not persisted permanently — room files are stored temporarily in the server/rooms/ directory.
This app is designed for demo or LAN usage; you can add authentication or database integration for production.

---

## Future updates
  - document history
  - Light/dark mode
  - Highlight changes by other users
  - Ai auto complete and auto summerize
  - Character Count
  - Typing indicator
   
---

## 🙋‍♂️ Author
MANISH BORAH
    

