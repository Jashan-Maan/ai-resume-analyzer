"use client";
import { fadeUp } from "@/app/page";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="relative rounded-3xl bg-linear-to-br from-sky-blue-600 via-sky-blue-600 to-sky-blue-700 p-12 md:p-16 text-center overflow-hidden"
        >
          {/* CTA background orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to level up your resume?
            </h2>
            <p className="text-sky-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of job seekers who are landing more interviews with
              Kira&apos;s AI‑powered resume analysis.
            </p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 bg-white text-sky-blue-700 font-semibold px-8 py-4 rounded-2xl hover:bg-sky-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
