import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

// Paths for local JSON fallback
const localDbPath = path.join(process.cwd(), "src", "data", "db.json");
const localMsgPath = path.join(process.cwd(), "src", "data", "messages.json");

let pool: mysql.Pool | null = null;
let tablesInitialized = false;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "u870455810_fuuast_admin",
      password: process.env.DB_PASSWORD || "Balti_dev110",
      database: process.env.DB_NAME || "u870455810_fuuast_db",
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000, // Quick timeout to fallback smoothly if running locally without MySQL
    });
  }
  return pool;
}

async function ensureTables(p: mysql.Pool) {
  if (tablesInitialized) return;
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        roll_no VARCHAR(64) NOT NULL UNIQUE,
        department VARCHAR(16) NOT NULL,
        semester VARCHAR(32) NOT NULL,
        bio TEXT,
        skills TEXT,
        email VARCHAR(255) NOT NULL,
        github VARCHAR(255),
        linkedin VARCHAR(255),
        avatar_bg VARCHAR(32),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        department VARCHAR(32),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    tablesInitialized = true;
  } catch (err) {
    console.warn("Could not ensure MySQL tables:", err);
  }
}

/**
 * Get all student profiles (MySQL first, local JSON fallback)
 */
export async function getProfiles() {
  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>(
      "SELECT * FROM student_profiles ORDER BY created_at DESC"
    );

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        rollNo: r.roll_no,
        department: r.department,
        semester: r.semester,
        bio: r.bio,
        skills: r.skills ? r.skills.split(",").map((s: string) => s.trim()) : [],
        email: r.email,
        github: r.github,
        linkedin: r.linkedin,
        avatarBg: r.avatar_bg || "bg-blue-600",
      }));
    }
  } catch (mysqlErr) {
    // MySQL not reachable (e.g. running locally) -> fallback to local file
  }

  // Fallback to local JSON
  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    return json.profiles || [];
  } catch {
    return [];
  }
}

/**
 * Save a new student profile (MySQL first, local JSON fallback)
 */
export async function saveProfile(profile: {
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  bio?: string;
  skills?: string | string[];
  email: string;
  github?: string;
  linkedin?: string;
}) {
  const id = `std-${Date.now()}`;
  const skillsStr = Array.isArray(profile.skills)
    ? profile.skills.join(", ")
    : profile.skills || "";
  const avatarBg =
    profile.department === "CS"
      ? "bg-blue-600"
      : profile.department === "SE"
      ? "bg-sky-600"
      : "bg-indigo-600";

  let savedToMySQL = false;

  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO student_profiles 
       (id, name, roll_no, department, semester, bio, skills, email, github, linkedin, avatar_bg) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name), department = VALUES(department), semester = VALUES(semester), 
       bio = VALUES(bio), skills = VALUES(skills), email = VALUES(email), 
       github = VALUES(github), linkedin = VALUES(linkedin)`,
      [
        id,
        profile.name,
        profile.rollNo.toUpperCase(),
        profile.department,
        profile.semester,
        profile.bio || "",
        skillsStr,
        profile.email,
        profile.github || "",
        profile.linkedin || "",
        avatarBg,
      ]
    );
    savedToMySQL = true;
  } catch (mysqlErr) {
    // MySQL unreachable locally, saving to local JSON
  }

  // Always update local file for consistent local dev
  const newProfile = {
    id,
    name: profile.name,
    rollNo: profile.rollNo.toUpperCase(),
    department: profile.department,
    semester: profile.semester,
    bio: profile.bio || "",
    skills: skillsStr ? skillsStr.split(",").map((s) => s.trim()) : [],
    email: profile.email,
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    avatarBg,
  };

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    json.profiles = [newProfile, ...(json.profiles || []).filter((p: any) => p.rollNo !== newProfile.rollNo)];
    await fs.writeFile(localDbPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { profile: newProfile, savedToMySQL };
}

/**
 * Save a contact message (MySQL first, local JSON fallback)
 */
export async function saveMessage(msg: {
  name: string;
  email: string;
  department?: string;
  subject?: string;
  message: string;
}) {
  const id = `msg-${Date.now()}`;
  let savedToMySQL = false;

  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO contact_messages (id, name, email, department, subject, message) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        msg.name,
        msg.email,
        msg.department || "General",
        msg.subject || "",
        msg.message,
      ]
    );
    savedToMySQL = true;
  } catch (mysqlErr) {
    // MySQL unreachable locally, saving to local JSON
  }

  // Also write to local file
  try {
    let json = { messages: [] as any[] };
    try {
      const fileData = await fs.readFile(localMsgPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    const newMsg = {
      id,
      name: msg.name,
      email: msg.email,
      department: msg.department || "General",
      subject: msg.subject || "",
      message: msg.message,
      timestamp: new Date().toISOString(),
    };
    json.messages.unshift(newMsg);
    await fs.writeFile(localMsgPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { id, savedToMySQL };
}
