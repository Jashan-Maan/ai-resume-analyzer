"use client";
import { fadeUp } from "@/app/page";
import { motion } from "framer-motion";
import {
  FileSearch,
  Sparkles,
  Target,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "ATS Score Analysis",
    description:
      "Get an instant ATS compatibility score and see exactly how your resume performs against applicant tracking systems.",
    color: "from-sky-blue-500 to-sky-blue-600",
    bg: "bg-sky-blue-50",
    iconColor: "text-sky-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description:
      "Receive intelligent suggestions powered by Google Gemini AI to optimize every section of your resume.",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Target,
    title: "Job Matching",
    description:
      "Compare your resume against specific job descriptions and get targeted recommendations for improvement.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Career Tracking",
    description:
      "Track all your job applications, interview progress, and career metrics in one beautiful dashboard.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume data is processed securely and never shared. We take your privacy seriously.",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get comprehensive analysis in seconds, not hours. Upload and receive actionable feedback immediately.",
    color: "from-sky-blue-400 to-sky-blue-600",
    bg: "bg-sky-blue-50",
    iconColor: "text-sky-blue-600",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-sky-blue-600 bg-sky-blue-50 px-4 py-1.5 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Everything you need to{" "}
            <span className="bg-linear-to-r from-sky-blue-600 to-sky-blue-500 bg-clip-text text-transparent">
              stand out
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Kira gives you the competitive edge with AI‑powered resume analysis
            and career tracking tools.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-500 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
