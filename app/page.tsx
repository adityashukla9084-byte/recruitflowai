export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-black text-theme-text">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold text-theme-accent">
          RecruitFlow AI
        </h1>

        <div className="space-x-6">
          <button className="hover:text-cyan-400 transition">
            Features
          </button>

          <button className="hover:text-cyan-400 transition">
            Pricing
          </button>

          <button className="hover:text-cyan-400 transition">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-24 px-6">

        <h2 className="text-6xl font-extrabold mb-6 leading-tight">
          AI Powered
          <br />
          Recruitment Platform
        </h2>

        <p className="text-xl text-gray-300 max-w-2xl">
          Find the best candidates faster using Artificial Intelligence,
          Resume Analysis, ATS Scoring and Automated Hiring Workflow.
        </p>

        <div className="mt-10 flex gap-5">
          <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Get Started
          </button>

          <button className="border border-cyan-500 hover:bg-cyan-500 px-8 py-4 rounded-xl transition">
            Live Demo
          </button>
        </div>

      </section>
<section className="py-24 px-10">

  <h2 className="text-4xl font-bold text-center mb-14">
    Why Choose RecruitFlow AI?
  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">
        🤖 AI Resume Analysis
      </h3>

      <p className="text-gray-300">
        Analyze resumes instantly using Artificial Intelligence.
      </p>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">
        📊 ATS Score
      </h3>

      <p className="text-gray-300">
        Calculate ATS compatibility before applying.
      </p>
    </div>

    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">
        ⚡ Smart Hiring
      </h3>

      <p className="text-gray-300">
        Hire better candidates with AI recommendations.
      </p>
    </div>

  </div>

</section>
    </main>
  );
}