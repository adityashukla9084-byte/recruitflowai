import { NextResponse } from "next/server";

// ── Mock job database (RapidAPI JSearch subscription expired) ──
// To re-enable the live API, replace the mock logic below with the
// original fetch to: https://jsearch.p.rapidapi.com/search
const allJobs = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    location: "Bangalore, India",
    salary: "₹18,00,000 - ₹30,00,000/yr",
    match: 95,
    applyUrl: "https://careers.google.com",
    tags: ["frontend", "react", "javascript", "developer", "web", "ui"],
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Full Stack Developer",
    location: "Hyderabad, India",
    salary: "₹20,00,000 - ₹35,00,000/yr",
    match: 92,
    applyUrl: "https://careers.microsoft.com",
    tags: ["fullstack", "full stack", "developer", "react", "node", "javascript", "web"],
  },
  {
    id: 3,
    company: "Amazon",
    role: "Backend Engineer",
    location: "Delhi, India",
    salary: "₹22,00,000 - ₹40,00,000/yr",
    match: 88,
    applyUrl: "https://amazon.jobs",
    tags: ["backend", "engineer", "java", "python", "developer", "api"],
  },
  {
    id: 4,
    company: "Flipkart",
    role: "React Developer",
    location: "Bangalore, India",
    salary: "₹14,00,000 - ₹24,00,000/yr",
    match: 90,
    applyUrl: "https://www.flipkartcareers.com",
    tags: ["react", "frontend", "developer", "javascript", "web", "ui"],
  },
  {
    id: 5,
    company: "Infosys",
    role: "Software Engineer",
    location: "Pune, India",
    salary: "₹6,00,000 - ₹12,00,000/yr",
    match: 82,
    applyUrl: "https://www.infosys.com/careers",
    tags: ["software", "engineer", "developer", "java", "python", "fullstack"],
  },
  {
    id: 6,
    company: "TCS",
    role: "Python Developer",
    location: "Mumbai, India",
    salary: "₹5,50,000 - ₹10,00,000/yr",
    match: 80,
    applyUrl: "https://www.tcs.com/careers",
    tags: ["python", "developer", "backend", "data", "engineer"],
  },
  {
    id: 7,
    company: "Razorpay",
    role: "Frontend Engineer",
    location: "Bangalore, India",
    salary: "₹16,00,000 - ₹28,00,000/yr",
    match: 93,
    applyUrl: "https://razorpay.com/jobs",
    tags: ["frontend", "engineer", "react", "javascript", "developer", "web", "ui"],
  },
  {
    id: 8,
    company: "Zomato",
    role: "Mobile Developer",
    location: "Delhi, India",
    salary: "₹15,00,000 - ₹26,00,000/yr",
    match: 85,
    applyUrl: "https://www.zomato.com/careers",
    tags: ["mobile", "developer", "react native", "android", "ios", "app"],
  },
  {
    id: 9,
    company: "Swiggy",
    role: "Data Scientist",
    location: "Bangalore, India",
    salary: "₹20,00,000 - ₹35,00,000/yr",
    match: 87,
    applyUrl: "https://careers.swiggy.com",
    tags: ["data", "scientist", "ml", "machine learning", "python", "ai"],
  },
  {
    id: 10,
    company: "Paytm",
    role: "DevOps Engineer",
    location: "Noida, India",
    salary: "₹12,00,000 - ₹22,00,000/yr",
    match: 84,
    applyUrl: "https://paytm.com/careers",
    tags: ["devops", "engineer", "aws", "docker", "kubernetes", "cloud"],
  },
  {
    id: 11,
    company: "Wipro",
    role: "Java Developer",
    location: "Chennai, India",
    salary: "₹6,00,000 - ₹14,00,000/yr",
    match: 81,
    applyUrl: "https://careers.wipro.com",
    tags: ["java", "developer", "backend", "spring", "engineer"],
  },
  {
    id: 12,
    company: "Adobe",
    role: "UI/UX Designer",
    location: "Noida, India",
    salary: "₹15,00,000 - ₹25,00,000/yr",
    match: 89,
    applyUrl: "https://adobe.wd5.myworkdayjobs.com",
    tags: ["ui", "ux", "designer", "design", "figma", "frontend"],
  },
  {
    id: 13,
    company: "Stripe",
    role: "Backend Developer",
    location: "Remote",
    salary: "$120,000 - $180,000/yr",
    match: 91,
    applyUrl: "https://stripe.com/jobs",
    tags: ["backend", "developer", "python", "ruby", "api", "remote"],
  },
  {
    id: 14,
    company: "Atlassian",
    role: "Full Stack Engineer",
    location: "Remote",
    salary: "$130,000 - $190,000/yr",
    match: 94,
    applyUrl: "https://www.atlassian.com/company/careers",
    tags: ["fullstack", "full stack", "engineer", "developer", "react", "node", "remote"],
  },
  {
    id: 15,
    company: "PhonePe",
    role: "Android Developer",
    location: "Bangalore, India",
    salary: "₹16,00,000 - ₹28,00,000/yr",
    match: 86,
    applyUrl: "https://www.phonepe.com/careers",
    tags: ["android", "developer", "mobile", "kotlin", "java", "app"],
  },
];

export async function POST(request: Request) {
  try {
    const { query, location } = await request.json();

    const q = (query || "").toLowerCase().trim();
    const loc = (location || "").toLowerCase().trim();

    let filtered = allJobs;

    // Filter by query keywords
    if (q) {
      const queryWords = q.split(/\s+/);
      filtered = filtered.filter((job) => {
        const searchable = [
          job.role.toLowerCase(),
          job.company.toLowerCase(),
          ...job.tags,
        ].join(" ");
        return queryWords.some((word: string) => searchable.includes(word));
      });
    }

    // Filter by location
    if (loc) {
      const locWords = loc.split(/\s+/);
      filtered = filtered.filter((job) => {
        const jobLoc = job.location.toLowerCase();
        return locWords.some((word: string) => jobLoc.includes(word));
      });
    }

    // Sort by match score descending
    filtered.sort((a, b) => b.match - a.match);

    // Strip internal tags before sending to client
    const jobs = filtered.map(({ tags, ...rest }) => rest);

    return NextResponse.json({ jobs });
  } catch (err: any) {
    return NextResponse.json(
      {
        jobs: [],
        error: err.message,
      },
      { status: 500 }
    );
  }
}