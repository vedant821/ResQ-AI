import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Emergency Coordinator, AIIMS',
    content: 'ResQ AI has transformed how we handle incoming emergency reports. The AI triage system reduced our classification time by 70%, allowing us to dispatch ambulances faster.',
    rating: 5,
    avatar: 'PS',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Fire Department Chief, Mumbai',
    content: 'The priority-based dashboard is a game-changer. We can now see critical incidents immediately and allocate our resources more effectively. Response times have improved dramatically.',
    rating: 5,
    avatar: 'RK',
  },
  {
    name: 'Anita Desai',
    role: 'Citizen, Pune',
    content: 'I used ResQ AI to report a road accident near my home. The first-aid instructions helped me assist the injured while waiting for the ambulance. It truly saved lives that day.',
    rating: 5,
    avatar: 'AD',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="gradient-text">Professionals</span>
          </h2>
          <p className="text-dark-400 max-w-xl mx-auto">
            Hear from emergency coordinators and citizens who rely on ResQ AI.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="glass-card p-6 relative"
            >
              <Quote size={32} className="text-primary-500/20 absolute top-4 right-4" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-dark-300 text-sm leading-relaxed mb-6">"{testimonial.content}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-dark-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
