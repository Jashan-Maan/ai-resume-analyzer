"use client";
import { fadeUp } from "@/app/page";
import { motion } from "framer-motion";
import { Upload, Brain, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description:
      "Simply drag and drop your PDF resume or upload it directly. We support all standard resume formats.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes It",
    description:
      "Our AI engine parses every detail — skills, experience, formatting, keywords, and more.",
  },
  {
    step: "03",
    icon: CheckCircle,
    title: "Get Actionable Results",
    description:
      "Receive a detailed score breakdown, personalized tips, and specific improvements to land more interviews.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 bg-linear-to-b from-gray-50 to-white"
    >
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
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Three simple steps to a{" "}
            <span className="bg-linear-to-r from-sky-blue-600 to-sky-blue-500 bg-clip-text text-transparent">
              better resume
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            No complicated setup. Just upload, analyze, and improve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
              className="relative text-center"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-px bg-linear-to-r from-sky-blue-200 to-transparent" />
              )}

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-sky-blue-500 to-sky-blue-600 text-white shadow-lg shadow-sky-blue-500/25 mb-6">
                <step.icon className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold text-sky-blue-400 tracking-widest uppercase mb-2">
                Step {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
