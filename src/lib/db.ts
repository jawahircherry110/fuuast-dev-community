import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import { initialJobs, JobOpportunity } from "@/data/initialData";

const localDbPath = path.join(process.cwd(), "src", "data", "db.json");
const localMsgPath = path.join(process.cwd(), "src", "data", "messages.json");
const localJobsPath = path.join(process.cwd(), "src", "data", "jobs.json");

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
      connectTimeout: 2000,
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

    await p.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(64) NOT NULL,
        department VARCHAR(64) NOT NULL,
        stipend VARCHAR(255),
        description TEXT,
        apply_link VARCHAR(512) NOT NULL,
        posted_date VARCHAR(64),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    tablesInitialized = true;
  } catch (err) {
    console.warn("Could not ensure MySQL tables:", err);
  }
}

/* ==========================================================
   PROFILES
========================================================== */
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
  } catch {}

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    return json.profiles || [];
  } catch {
    return [];
  }
}

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
  } catch {}

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

  return { profile: newProfile };
}

export async function deleteProfile(id: string) {
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query("DELETE FROM student_profiles WHERE id = ?", [id]);
  } catch {}

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    json.profiles = (json.profiles || []).filter((p: any) => p.id !== id);
    await fs.writeFile(localDbPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { success: true };
}

/* ==========================================================
   CONTACT MESSAGES
========================================================== */
export async function getMessages() {
  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        department: r.department,
        subject: r.subject,
        message: r.message,
        timestamp: r.created_at,
      }));
    }
  } catch {}

  try {
    const fileData = await fs.readFile(localMsgPath, "utf-8");
    const json = JSON.parse(fileData);
    return json.messages || [];
  } catch {
    return [];
  }
}

export async function saveMessage(msg: {
  name: string;
  email: string;
  department?: string;
  subject?: string;
  message: string;
}) {
  const id = `msg-${Date.now()}`;
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
  } catch {}

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

  return { id };
}

export async function deleteMessage(id: string) {
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query("DELETE FROM contact_messages WHERE id = ?", [id]);
  } catch {}

  try {
    const fileData = await fs.readFile(localMsgPath, "utf-8");
    const json = JSON.parse(fileData);
    json.messages = (json.messages || []).filter((m: any) => m.id !== id);
    await fs.writeFile(localMsgPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { success: true };
}

/* ==========================================================
   JOBS & INTERNSHIPS (Admin managed)
========================================================== */
export async function getJobs(): Promise<JobOpportunity[]> {
  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );
    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        title: r.title,
        company: r.company,
        location: r.location,
        type: r.type,
        department: r.department,
        stipend: r.stipend,
        description: r.description,
        applyLink: r.apply_link,
        postedDate: r.posted_date || "Recently",
      }));
    }
  } catch {}

  try {
    const fileData = await fs.readFile(localJobsPath, "utf-8");
    const json = JSON.parse(fileData);
    if (json.jobs && json.jobs.length > 0) {
      return json.jobs;
    }
  } catch {}

  return initialJobs;
}

export async function saveJob(job: {
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time" | "Remote";
  department: "CS" | "SE" | "AI" | "All";
  stipend?: string;
  description: string;
  applyLink: string;
}) {
  const id = `j-${Date.now()}`;
  const postedDate = "Just now";

  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO jobs (id, title, company, location, type, department, stipend, description, apply_link, posted_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        job.title,
        job.company,
        job.location,
        job.type,
        job.department,
        job.stipend || "Competitive",
        job.description,
        job.applyLink,
        postedDate,
      ]
    );
  } catch {}

  const newJob: JobOpportunity = {
    id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    department: job.department,
    stipend: job.stipend || "Competitive",
    description: job.description,
    applyLink: job.applyLink,
    postedDate,
  };

  try {
    let json = { jobs: initialJobs };
    try {
      const fileData = await fs.readFile(localJobsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    json.jobs = [newJob, ...(json.jobs || [])];
    await fs.writeFile(localJobsPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { job: newJob };
}

export async function deleteJob(id: string) {
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query("DELETE FROM jobs WHERE id = ?", [id]);
  } catch {}

  try {
    let json = { jobs: initialJobs };
    try {
      const fileData = await fs.readFile(localJobsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    json.jobs = (json.jobs || []).filter((j: any) => j.id !== id);
    await fs.writeFile(localJobsPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { success: true };
}
