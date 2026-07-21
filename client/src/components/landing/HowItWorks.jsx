import { motion } from 'framer-motion';
import { Upload, Brain, FileCheck, Bell, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Report Incident',
    description: 'Citizens upload photos, add descriptions, select incident type, and share location.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Brain,
    step: '02',
    title: 'AI Analysis',
    description: 'Our AI instantly classifies the incident, estimates severity, and calculates confidence.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon: FileCheck,
    step: '03',
    title: 'Generate Report',
    description: 'A structured report with first-aid instructions and emergency service recommendations is created.',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
  },
  {
    icon: Bell,
    step: '04',
    title: 'Dispatch Response',
    description: 'Admins receive prioritized alerts and dispatch the right emergency services.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-dark-100 mb-4">
            How <span className="gradient-text-emergency">ResQ AI</span> Works
          </h2>
          <p className="text-dark-400 max-w-2xl mx-auto">
            From incident report to emergency response in minutes, not hours.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500/30 via-violet-500/30 via-green-500/30 to-orange-500/30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step number circle */}
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 rounded-2xl ${step.bg} border flex items-center justify-center mx-auto relative z-10`}>
                    <step.icon size={32} className={step.color} />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-dark-900 border border-dark-700 flex items-center justify-center z-20`}>
                    <span className="text-xs font-bold text-dark-300">{step.step}</span>
                  </div>
                </div>

                {/* Arrow between steps (mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-2">
                    <ArrowDown size={20} className="text-dark-600" />
                  </div>
                )}

                <h3 className="text-lg font-semibold text-dark-100 mb-2">{step.title}</h3>
                <p className="text-sm text-dark-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
