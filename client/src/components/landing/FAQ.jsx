import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does ResQ AI classify emergencies?',
    answer: 'ResQ AI uses advanced classification algorithms that analyze incident descriptions, uploaded images, and contextual data to categorize emergencies into types like Road Accident, Fire, Flood, Medical Emergency, and more. The system assigns a severity level and confidence score for each classification.',
  },
  {
    question: 'Is ResQ AI available 24/7?',
    answer: 'Yes! ResQ AI operates around the clock. Citizens can report emergencies anytime, and the AI analysis runs instantly. The admin dashboard provides real-time monitoring for emergency coordinators working in shifts.',
  },
  {
    question: 'How accurate is the AI severity prediction?',
    answer: 'Our AI classification system achieves an accuracy rate of approximately 94% for incident classification and severity prediction. The system continuously improves as more data is processed, and human coordinators can always override AI recommendations.',
  },
  {
    question: 'Can I report anonymously?',
    answer: 'While registration is required for full features and tracking, the system prioritizes the emergency over identity verification. Contact information helps responders coordinate effectively, but your data is kept confidential and used only for emergency response.',
  },
  {
    question: 'What types of emergencies can I report?',
    answer: 'ResQ AI supports 8 major emergency categories: Road Accidents, Fire, Flood, Medical Emergency, Earthquake, Building Collapse, Gas Leak, and Chemical Spill. The system is designed to handle any emergency type and route it to the appropriate services.',
  },
  {
    question: 'How do first-aid instructions help?',
    answer: 'When you submit an emergency report, ResQ AI generates specific, step-by-step first-aid instructions tailored to the incident type. These instructions help bystanders provide immediate care while waiting for professional emergency services to arrive.',
  },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm md:text-base font-medium text-white pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-dark-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-5 pb-5 text-sm text-dark-400 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
