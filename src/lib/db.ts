import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { initialJobs, JobOpportunity } from "@/data/initialData";
import { initialPosts, CommunityPost, PostComment } from "@/data/postsData";

const localDbPath = path.join(process.cwd(), "src", "data", "db.json");
const localMsgPath = path.join(process.cwd(), "src", "data", "messages.json");
const localJobsPath = path.join(process.cwd(), "src", "data", "jobs.json");
const localPostsPath = path.join(process.cwd(), "src", "data", "posts.json");

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
        phone VARCHAR(64),
        password VARCHAR(255),
        photo_url LONGTEXT,
        status VARCHAR(32) DEFAULT 'pending',
        github VARCHAR(255),
        linkedin VARCHAR(255),
        avatar_bg VARCHAR(32),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure columns exist on tables created in previous versions
    try { await p.query("ALTER TABLE student_profiles ADD COLUMN phone VARCHAR(64)"); } catch {}
    try { await p.query("ALTER TABLE student_profiles ADD COLUMN password VARCHAR(255)"); } catch {}
    try { await p.query("ALTER TABLE student_profiles ADD COLUMN photo_url LONGTEXT"); } catch {}
    try { await p.query("ALTER TABLE student_profiles ADD COLUMN status VARCHAR(32) DEFAULT 'pending'"); } catch {}

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

    await p.query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(64) PRIMARY KEY,
        author_id VARCHAR(64) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_roll_no VARCHAR(64) NOT NULL,
        author_department VARCHAR(16) NOT NULL,
        author_semester VARCHAR(32) NOT NULL,
        author_photo_url LONGTEXT,
        title VARCHAR(255),
        content TEXT NOT NULL,
        category VARCHAR(64) DEFAULT 'Problem / Query',
        code_snippet TEXT,
        tags TEXT,
        likes_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id VARCHAR(64) PRIMARY KEY,
        post_id VARCHAR(64) NOT NULL,
        author_id VARCHAR(64) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_roll_no VARCHAR(64) NOT NULL,
        author_department VARCHAR(16) NOT NULL,
        author_semester VARCHAR(32) NOT NULL,
        author_photo_url LONGTEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create a meta table to check if jobs were ever seeded
    await p.query(`
      CREATE TABLE IF NOT EXISTS db_meta (
        meta_key VARCHAR(64) PRIMARY KEY,
        meta_value VARCHAR(64)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check if initial seeding was done
    const [metaRows] = await p.query<any[]>("SELECT * FROM db_meta WHERE meta_key = 'jobs_seeded'");
    if (!metaRows || metaRows.length === 0) {
      // Seed initial jobs once
      for (const j of initialJobs) {
        await p.query(
          `INSERT IGNORE INTO jobs (id, title, company, location, type, department, stipend, description, apply_link, posted_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [j.id, j.title, j.company, j.location, j.type, j.department, j.stipend, j.description, j.applyLink, j.postedDate]
        );
      }
      await p.query("INSERT INTO db_meta (meta_key, meta_value) VALUES ('jobs_seeded', '1')");
    }

    tablesInitialized = true;
  } catch (err) {
    console.warn("Could not ensure MySQL tables:", err);
  }
}

/* ==========================================================
   PROFILES
========================================================== */
export async function getProfiles(onlyApproved: boolean = true) {
  try {
    const p = getPool();
    await ensureTables(p);

    let query = "SELECT * FROM student_profiles ORDER BY created_at DESC";
    if (onlyApproved) {
      query = "SELECT * FROM student_profiles WHERE status = 'approved' ORDER BY created_at DESC";
    }

    const [rows] = await p.query<any[]>(query);

    if (Array.isArray(rows)) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        rollNo: r.roll_no,
        department: r.department,
        semester: r.semester,
        bio: r.bio || "",
        skills: r.skills ? r.skills.split(",").map((s: string) => s.trim()) : [],
        email: r.email,
        phone: r.phone || "",
        photoUrl: r.photo_url || "",
        status: r.status || "pending",
        github: r.github || "",
        linkedin: r.linkedin || "",
        avatarBg: r.avatar_bg || "bg-blue-600",
        createdAt: r.created_at,
      }));
    }
  } catch {}

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    const list = (json.profiles || []).map((r: any) => ({
      ...r,
      rollNo: r.rollNo || r.roll_no,
      status: r.status || "pending",
      photoUrl: r.photoUrl || r.photo_url || "",
      phone: r.phone || "",
    }));

    if (onlyApproved) {
      return list.filter((p: any) => p.status === "approved");
    }
    return list;
  } catch {
    return [];
  }
}

export async function saveProfile(profile: {
  id?: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  bio?: string;
  skills?: string | string[];
  email: string;
  phone?: string;
  password?: string;
  photoUrl?: string;
  status?: string;
  github?: string;
  linkedin?: string;
}) {
  const id = profile.id || `std-${Date.now()}`;
  const skillsStr = Array.isArray(profile.skills)
    ? profile.skills.join(", ")
    : profile.skills || "";
  const avatarBg =
    profile.department === "CS"
      ? "bg-blue-600"
      : profile.department === "SE"
      ? "bg-sky-600"
      : "bg-indigo-600";
  const status = profile.status || "pending";
  const rollNo = profile.rollNo.toUpperCase().trim();

  let hashedPassword: string | null = null;
  if (profile.password && profile.password.trim().length > 0) {
    try {
      hashedPassword = await bcrypt.hash(profile.password.trim(), 10);
    } catch {
      hashedPassword = profile.password.trim();
    }
  }

  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO student_profiles 
       (id, name, roll_no, department, semester, bio, skills, email, phone, password, photo_url, status, github, linkedin, avatar_bg) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name), department = VALUES(department), semester = VALUES(semester), 
       bio = VALUES(bio), skills = VALUES(skills), email = VALUES(email), 
       phone = COALESCE(VALUES(phone), phone),
       password = COALESCE(VALUES(password), password),
       photo_url = COALESCE(VALUES(photo_url), photo_url),
       status = VALUES(status),
       github = VALUES(github), linkedin = VALUES(linkedin)`,
      [
        id,
        profile.name.trim(),
        rollNo,
        profile.department,
        profile.semester,
        profile.bio || "",
        skillsStr,
        profile.email.trim(),
        profile.phone ? profile.phone.trim() : null,
        hashedPassword,
        profile.photoUrl || null,
        status,
        profile.github || "",
        profile.linkedin || "",
        avatarBg,
      ]
    );
  } catch {}

  const newProfile = {
    id,
    name: profile.name.trim(),
    rollNo,
    department: profile.department,
    semester: profile.semester,
    bio: profile.bio || "",
    skills: skillsStr ? skillsStr.split(",").map((s) => s.trim()) : [],
    email: profile.email.trim(),
    phone: profile.phone ? profile.phone.trim() : "",
    photoUrl: profile.photoUrl || "",
    status,
    github: profile.github || "",
    linkedin: profile.linkedin || "",
    avatarBg,
    password: hashedPassword,
  };

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    json.profiles = [
      newProfile,
      ...(json.profiles || []).filter(
        (p: any) => (p.rollNo || p.roll_no) !== rollNo && p.id !== id
      ),
    ];
    await fs.writeFile(localDbPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  const { password: _, ...safeProfile } = newProfile;
  return { profile: safeProfile };
}

export async function updateProfileStatus(id: string, status: "approved" | "rejected" | "pending") {
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query("UPDATE student_profiles SET status = ? WHERE id = ?", [status, id]);
  } catch {}

  try {
    const fileData = await fs.readFile(localDbPath, "utf-8");
    const json = JSON.parse(fileData);
    if (Array.isArray(json.profiles)) {
      json.profiles = json.profiles.map((p: any) =>
        p.id === id ? { ...p, status } : p
      );
      await fs.writeFile(localDbPath, JSON.stringify(json, null, 2), "utf-8");
    }
  } catch {}

  return { success: true, id, status };
}

export async function findStudentAuth(identifier: string, passwordAttempt: string) {
  const cleanId = identifier.trim().toLowerCase();
  let student: any = null;

  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>(
      "SELECT * FROM student_profiles WHERE LOWER(email) = ? OR phone = ? OR UPPER(roll_no) = ? LIMIT 1",
      [cleanId, identifier.trim(), identifier.trim().toUpperCase()]
    );
    if (Array.isArray(rows) && rows.length > 0) {
      student = rows[0];
    }
  } catch {}

  if (!student) {
    try {
      const fileData = await fs.readFile(localDbPath, "utf-8");
      const json = JSON.parse(fileData);
      student = (json.profiles || []).find(
        (p: any) =>
          (p.email && p.email.toLowerCase() === cleanId) ||
          (p.phone && p.phone === identifier.trim()) ||
          ((p.rollNo || p.roll_no) && (p.rollNo || p.roll_no).toUpperCase() === identifier.trim().toUpperCase())
      );
    } catch {}
  }

  if (!student) {
    return { error: "No student profile found with this email, phone, or roll number." };
  }

  if (student.password) {
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(passwordAttempt, student.password);
    } catch {
      isMatch = student.password === passwordAttempt;
    }
    if (!isMatch && student.password === passwordAttempt) {
      isMatch = true;
    }
    if (!isMatch) {
      return { error: "Incorrect password. Please verify and try again." };
    }
  }

  return {
    success: true,
    profile: {
      id: student.id,
      name: student.name,
      rollNo: student.roll_no || student.rollNo,
      department: student.department,
      semester: student.semester,
      bio: student.bio || "",
      skills: student.skills
        ? Array.isArray(student.skills)
          ? student.skills
          : student.skills.split(",").map((s: string) => s.trim())
        : [],
      email: student.email,
      phone: student.phone || "",
      photoUrl: student.photo_url || student.photoUrl || "",
      status: student.status || "approved",
      github: student.github || "",
      linkedin: student.linkedin || "",
      avatarBg: student.avatar_bg || student.avatarBg || "bg-blue-600",
      createdAt: student.created_at || student.createdAt,
    },
  };
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
    if (Array.isArray(rows)) {
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
   JOBS & INTERNSHIPS (Accurate Database Queries)
========================================================== */
export async function getJobs(): Promise<JobOpportunity[]> {
  // 1. Try MySQL Database
  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );
    // If MySQL returns an array (even if 0 rows!), return it exactly as in the database!
    if (Array.isArray(rows)) {
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

  // 2. Try local jobs.json file
  try {
    const fileData = await fs.readFile(localJobsPath, "utf-8");
    const json = JSON.parse(fileData);
    if (Array.isArray(json.jobs)) {
      return json.jobs;
    }
  } catch {}

  // 3. Fallback only if local file doesn't exist at all yet
  try {
    await fs.writeFile(localJobsPath, JSON.stringify({ jobs: initialJobs }, null, 2), "utf-8");
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
    let json = { jobs: [] as JobOpportunity[] };
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
    let json = { jobs: [] as JobOpportunity[] };
    try {
      const fileData = await fs.readFile(localJobsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    json.jobs = (json.jobs || []).filter((j: any) => j.id !== id);
    await fs.writeFile(localJobsPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { success: true };
}

/* ==========================================================
   COMMUNITY POSTS & TWEETS (DEV LOUNGE)
========================================================== */

export async function getPosts(): Promise<CommunityPost[]> {
  // 1. Try MySQL database
  try {
    const p = getPool();
    await ensureTables(p);

    const [postRows] = await p.query<any[]>(
      "SELECT * FROM community_posts ORDER BY created_at DESC"
    );

    if (Array.isArray(postRows) && postRows.length > 0) {
      const [commentRows] = await p.query<any[]>(
        "SELECT * FROM post_comments ORDER BY created_at ASC"
      );
      const commentsList = Array.isArray(commentRows) ? commentRows : [];

      return postRows.map((r) => {
        let likes: string[] = [];
        try {
          likes = r.likes_json ? JSON.parse(r.likes_json) : [];
        } catch {}

        let tags: string[] = [];
        try {
          tags = r.tags ? (Array.isArray(r.tags) ? r.tags : r.tags.split(",").map((t: string) => t.trim())) : [];
        } catch {}

        const postComments = commentsList
          .filter((c) => c.post_id === r.id)
          .map((c) => ({
            id: c.id,
            postId: c.post_id,
            authorId: c.author_id,
            authorName: c.author_name,
            authorRollNo: c.author_roll_no,
            authorDepartment: c.author_department,
            authorSemester: c.author_semester,
            authorPhotoUrl: c.author_photo_url || "",
            content: c.content,
            createdAt: c.created_at,
          }));

        return {
          id: r.id,
          authorId: r.author_id,
          authorName: r.author_name,
          authorRollNo: r.author_roll_no,
          authorDepartment: r.author_department,
          authorSemester: r.author_semester,
          authorPhotoUrl: r.author_photo_url || "",
          title: r.title || "",
          content: r.content,
          category: r.category || "Problem / Query",
          codeSnippet: r.code_snippet || "",
          tags,
          likes,
          comments: postComments,
          createdAt: r.created_at,
        };
      });
    }
  } catch {}

  // 2. Try local posts.json file
  try {
    const fileData = await fs.readFile(localPostsPath, "utf-8");
    const json = JSON.parse(fileData);
    if (Array.isArray(json.posts)) {
      return json.posts;
    }
  } catch {}

  // 3. Fallback: Write initial posts to file
  try {
    await fs.writeFile(localPostsPath, JSON.stringify({ posts: initialPosts }, null, 2), "utf-8");
  } catch {}

  return initialPosts;
}

export async function savePost(post: {
  authorId: string;
  authorName: string;
  authorRollNo: string;
  authorDepartment: "CS" | "SE" | "AI";
  authorSemester: string;
  authorPhotoUrl?: string;
  title?: string;
  content: string;
  category?: "Problem / Query" | "FYP Idea & Teammates" | "Bug & Code Help" | "Career & Internships" | "General Discussion";
  codeSnippet?: string;
  tags?: string[];
}): Promise<{ post: CommunityPost }> {
  const id = `post-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const category = post.category || "Problem / Query";
  const tagsStr = Array.isArray(post.tags) ? post.tags.join(",") : "";
  const likes: string[] = [];

  const newPost: CommunityPost = {
    id,
    authorId: post.authorId,
    authorName: post.authorName,
    authorRollNo: post.authorRollNo,
    authorDepartment: post.authorDepartment,
    authorSemester: post.authorSemester,
    authorPhotoUrl: post.authorPhotoUrl || "",
    title: post.title || "",
    content: post.content,
    category,
    codeSnippet: post.codeSnippet || "",
    tags: post.tags || [],
    likes,
    comments: [],
    createdAt,
  };

  // 1. MySQL insert
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO community_posts (id, author_id, author_name, author_roll_no, author_department, author_semester, author_photo_url, title, content, category, code_snippet, tags, likes_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        newPost.authorId,
        newPost.authorName,
        newPost.authorRollNo,
        newPost.authorDepartment,
        newPost.authorSemester,
        newPost.authorPhotoUrl,
        newPost.title,
        newPost.content,
        newPost.category,
        newPost.codeSnippet,
        tagsStr,
        JSON.stringify(likes),
      ]
    );
  } catch {}

  // 2. File fallback update
  try {
    let json = { posts: [] as CommunityPost[] };
    try {
      const fileData = await fs.readFile(localPostsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    json.posts = [newPost, ...(json.posts || [])];
    await fs.writeFile(localPostsPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { post: newPost };
}

export async function togglePostLike(postId: string, studentRollNo: string): Promise<{ success: boolean; likes: string[] }> {
  let updatedLikes: string[] = [];

  // Try file update
  try {
    let json = { posts: [] as CommunityPost[] };
    try {
      const fileData = await fs.readFile(localPostsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    const post = json.posts.find((p) => p.id === postId);
    if (post) {
      if (!Array.isArray(post.likes)) post.likes = [];
      const index = post.likes.indexOf(studentRollNo);
      if (index > -1) {
        post.likes.splice(index, 1);
      } else {
        post.likes.push(studentRollNo);
      }
      updatedLikes = post.likes;
      await fs.writeFile(localPostsPath, JSON.stringify(json, null, 2), "utf-8");
    }
  } catch {}

  // Try MySQL update
  try {
    const p = getPool();
    await ensureTables(p);
    const [rows] = await p.query<any[]>("SELECT likes_json FROM community_posts WHERE id = ?", [postId]);
    if (Array.isArray(rows) && rows.length > 0) {
      let currentLikes: string[] = [];
      try {
        currentLikes = rows[0].likes_json ? JSON.parse(rows[0].likes_json) : [];
      } catch {}

      const idx = currentLikes.indexOf(studentRollNo);
      if (idx > -1) {
        currentLikes.splice(idx, 1);
      } else {
        currentLikes.push(studentRollNo);
      }
      updatedLikes = currentLikes;
      await p.query("UPDATE community_posts SET likes_json = ? WHERE id = ?", [
        JSON.stringify(currentLikes),
        postId,
      ]);
    }
  } catch {}

  return { success: true, likes: updatedLikes };
}

export async function addPostComment(
  postId: string,
  comment: {
    authorId: string;
    authorName: string;
    authorRollNo: string;
    authorDepartment: "CS" | "SE" | "AI";
    authorSemester: string;
    authorPhotoUrl?: string;
    content: string;
  }
): Promise<{ success: boolean; comment: PostComment }> {
  const commentId = `c-${Date.now()}`;
  const createdAt = new Date().toISOString();

  const newComment: PostComment = {
    id: commentId,
    postId,
    authorId: comment.authorId,
    authorName: comment.authorName,
    authorRollNo: comment.authorRollNo,
    authorDepartment: comment.authorDepartment,
    authorSemester: comment.authorSemester,
    authorPhotoUrl: comment.authorPhotoUrl || "",
    content: comment.content,
    createdAt,
  };

  // 1. MySQL insert
  try {
    const p = getPool();
    await ensureTables(p);
    await p.query(
      `INSERT INTO post_comments (id, post_id, author_id, author_name, author_roll_no, author_department, author_semester, author_photo_url, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        commentId,
        postId,
        newComment.authorId,
        newComment.authorName,
        newComment.authorRollNo,
        newComment.authorDepartment,
        newComment.authorSemester,
        newComment.authorPhotoUrl,
        newComment.content,
      ]
    );
  } catch {}

  // 2. File fallback update
  try {
    let json = { posts: [] as CommunityPost[] };
    try {
      const fileData = await fs.readFile(localPostsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    const targetPost = json.posts.find((p) => p.id === postId);
    if (targetPost) {
      if (!Array.isArray(targetPost.comments)) targetPost.comments = [];
      targetPost.comments.push(newComment);
      await fs.writeFile(localPostsPath, JSON.stringify(json, null, 2), "utf-8");
    }
  } catch {}

  return { success: true, comment: newComment };
}

export async function deletePost(postId: string, rollNo?: string): Promise<{ success: boolean }> {
  try {
    const p = getPool();
    await ensureTables(p);
    if (rollNo) {
      await p.query("DELETE FROM community_posts WHERE id = ? AND author_roll_no = ?", [postId, rollNo]);
    } else {
      await p.query("DELETE FROM community_posts WHERE id = ?", [postId]);
    }
    await p.query("DELETE FROM post_comments WHERE post_id = ?", [postId]);
  } catch {}

  try {
    let json = { posts: [] as CommunityPost[] };
    try {
      const fileData = await fs.readFile(localPostsPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {}

    json.posts = json.posts.filter((p) => {
      if (p.id !== postId) return true;
      if (rollNo && p.authorRollNo !== rollNo) return true;
      return false;
    });
    await fs.writeFile(localPostsPath, JSON.stringify(json, null, 2), "utf-8");
  } catch {}

  return { success: true };
}
