export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRollNo: string;
  authorDepartment: "CS" | "SE" | "AI";
  authorSemester: string;
  authorPhotoUrl?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRollNo: string;
  authorDepartment: "CS" | "SE" | "AI";
  authorSemester: string;
  authorPhotoUrl?: string;
  title?: string;
  content: string;
  category: "Problem / Query" | "FYP Idea & Teammates" | "Bug & Code Help" | "Career & Internships" | "General Discussion";
  codeSnippet?: string;
  tags?: string[];
  likes: string[]; // List of user roll numbers/IDs
  comments: PostComment[];
  createdAt: string;
}

export const initialPosts: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "p2",
    authorName: "Ayesha Malik",
    authorRollNo: "SP23-BAI-019",
    authorDepartment: "AI",
    authorSemester: "5th Semester",
    authorPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    title: "CUDA Out-of-Memory error on Colab while fine-tuning Llama-3 with LoRA",
    content: "Hey everyone! Working on our NLP semester project fine-tuning an open-source LLM for Urdu healthcare queries. During the evaluation phase on Colab T4 GPU, I keep encountering CUDA OOM. Has anyone in BSAI or BSCS solved this using gradient_accumulation_steps or bitsandbytes 4-bit quantization? Would love to know your settings!",
    category: "Problem / Query",
    codeSnippet: `peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)`,
    tags: ["AI", "PyTorch", "NLP", "CUDA"],
    likes: ["FA22-BCS-041", "FA21-BSE-012"],
    comments: [
      {
        id: "c-1",
        postId: "post-1",
        authorId: "p3",
        authorName: "Bilal Ahmed",
        authorRollNo: "FA21-BSE-012",
        authorDepartment: "SE",
        authorSemester: "7th Semester",
        authorPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        content: "Set `per_device_eval_batch_size=1` and enable `fp16=True` in TrainingArguments. That cut our VRAM usage from 14GB down to 8.5GB on Colab.",
        createdAt: "2026-10-19T14:30:00.000Z",
      },
      {
        id: "c-2",
        postId: "post-1",
        authorId: "p1",
        authorName: "Hamza Tariq",
        authorRollNo: "FA22-BCS-041",
        authorDepartment: "CS",
        authorSemester: "6th Semester",
        authorPhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
        content: "Also call `torch.cuda.empty_cache()` inside your eval callback loop to clear intermediate tensors.",
        createdAt: "2026-10-19T15:10:00.000Z",
      },
    ],
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    id: "post-2",
    authorId: "p3",
    authorName: "Bilal Ahmed",
    authorRollNo: "FA21-BSE-012",
    authorDepartment: "SE",
    authorSemester: "7th Semester",
    authorPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    title: "Looking for 1 BSAI or BSCS Teammate for Smart Campus FYP Project",
    content: "Our Final Year Project group (2 SE students) is building an automated intelligent resource allocation and exam timetable platform for FUUAST Islamabad. We already have the Next.js 15 frontend, NestJS API, and Docker configuration ready. We are looking for 1 teammate with an interest in genetic optimization algorithms or constraint programming. Comment or DM if interested!",
    category: "FYP Idea & Teammates",
    tags: ["FYP", "Next.js", "AI", "Collaboration"],
    likes: ["FA22-BCS-041", "SP23-BAI-019", "SP24-BCS-105"],
    comments: [
      {
        id: "c-3",
        postId: "post-2",
        authorId: "p4",
        authorName: "Daniyal Khan",
        authorRollNo: "SP24-BCS-105",
        authorDepartment: "CS",
        authorSemester: "4th Semester",
        authorPhotoUrl: "",
        content: "Sounds like a great FYP project Bilal! I worked on constraint satisfaction and heuristic search in AI lab. Let's discuss on campus tomorrow.",
        createdAt: "2026-10-19T16:00:00.000Z",
      },
    ],
    createdAt: "2026-10-19T13:45:00.000Z",
  },
  {
    id: "post-3",
    authorId: "p1",
    authorName: "Hamza Tariq",
    authorRollNo: "FA22-BCS-041",
    authorDepartment: "CS",
    authorSemester: "6th Semester",
    authorPhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    title: "Tips for Software House Interviews in Islamabad & Rawalpindi?",
    content: "For seniors who recently cleared technical rounds at software houses in Blue Area or I-9 Islamabad: what matters more in initial screenings? Live LeetCode DSA problem solving, or practical full-stack Next.js/Docker code walkthroughs from your GitHub repositories?",
    category: "Career & Internships",
    tags: ["Interviews", "Islamabad", "Careers", "Advice"],
    likes: ["FA21-BSE-012", "SP23-BAI-019"],
    comments: [
      {
        id: "c-4",
        postId: "post-3",
        authorId: "p3",
        authorName: "Bilal Ahmed",
        authorRollNo: "FA21-BSE-012",
        authorDepartment: "SE",
        authorSemester: "7th Semester",
        authorPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        content: "Most software houses in Islamabad first inspect your public GitHub repository commit history to check clean code and architecture, followed by 1-2 medium DSA problems (usually HashMaps, Trees, or SQL query optimization).",
        createdAt: "2026-10-19T17:15:00.000Z",
      },
    ],
    createdAt: "2026-10-19T15:20:00.000Z",
  },
];
