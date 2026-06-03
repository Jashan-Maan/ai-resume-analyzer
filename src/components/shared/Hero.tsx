import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { fadeUp, scaleIn } from "@/app/page";

interface fadeUpProps {
  hidden: { opacity: number; y: number };
  visible: (i: number) => {
    opacity: number;
    y: number;
    transition: {
      delay: number;
      duration: number;
      ease: [number, number, number, number];
    };
  };
}

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-linear-to-br from-sky-blue-100 to-sky-blue-50/50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-linear-to-br from-sky-blue-50 to-sky-blue-200/40 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-t from-sky-blue-50/80 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-blue-50 border border-sky-blue-100 text-sky-blue-700 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
          >
            Your resume,{" "}
            <span className="bg-linear-to-r from-sky-blue-600 via-sky-blue-500 to-sky-blue-700 bg-clip-text text-transparent">
              perfected
            </span>{" "}
            by AI
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Kira analyzes your resume against ATS systems, provides AI‑powered
            feedback, and helps you land more interviews — all in seconds.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-base font-semibold text-white bg-linear-to-r from-sky-blue-600 to-sky-blue-500 hover:from-sky-blue-700 hover:to-sky-blue-600 px-8 py-4 rounded-2xl transition-all shadow-xl shadow-sky-blue-500/25 hover:shadow-sky-blue-500/40 hover:-translate-y-0.5"
            >
              Analyze Your Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 px-6 py-4 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              See How It Works
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Hero visual - floating card mockup */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={scaleIn}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="relative rounded-3xl bg-linear-to-b from-gray-50 to-white border border-gray-200/80 shadow-2xl shadow-gray-200/50 p-6 md:p-8">
            {/* Window chrome */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 h-7 bg-gray-100 rounded-lg flex-1 flex items-center px-3">
                <span className="text-xs text-gray-400 font-mono">
                  kira.app/dashboard/analyze
                </span>
              </div>
            </div>

            {/* Mock analysis result */}
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-linear-to-br from-sky-blue-50 to-sky-blue-100/50 border border-sky-blue-100">
                <div className="relative w-28 h-28">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e5f5ff"
                      strokeWidth="10"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 50}
                      initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.87),
                      }}
                      transition={{
                        delay: 0.8,
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    />
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#0099ff" />
                        <stop offset="100%" stopColor="#005c99" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-3xl font-bold text-sky-blue-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      87
                    </motion.span>
                    <span className="text-xs text-sky-blue-500 font-medium">
                      ATS Score
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-sky-blue-600 font-medium">
                  Great Resume!
                </p>
              </div>

              <div className="md:col-span-3 space-y-3">
                {[
                  {
                    label: "Skills Match",
                    value: 92,
                    color: "bg-emerald-500",
                  },
                  { label: "Experience", value: 85, color: "bg-blue-500" },
                  { label: "Keywords", value: 78, color: "bg-amber-500" },
                  { label: "Formatting", value: 95, color: "bg-sky-blue-500" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-24 shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{
                          delay: 1 + i * 0.15,
                          duration: 1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 items-center gap-2 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 px-4 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                ATS Compatible
              </p>
              <p className="text-[10px] text-gray-400">Passed all checks</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="hidden md:flex absolute -right-8 top-1/3 items-center gap-2 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 px-4 py-3"
          >
            <div className="w-8 h-8 rounded-full bg-sky-blue-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-sky-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">
                +23% Improvement
              </p>
              <p className="text-[10px] text-gray-400">vs. last version</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
