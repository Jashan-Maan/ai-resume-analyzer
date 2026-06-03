import { fadeUp } from "@/app/page";
import { motion } from "framer-motion";

const stats = [
  { value: "95%", label: "ATS Accuracy" },
  { value: "<10s", label: "Analysis Time" },
  { value: "50+", label: "Metrics Checked" },
  { value: "Free", label: "To Get Started" },
];

const StatsBar = () => {
  return (
    <section className="py-12 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              custom={i}
              variants={fadeUp}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold bg-linear-to-r from-sky-blue-600 to-sky-blue-500 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
