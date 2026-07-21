import { motion } from 'framer-motion';
import { Check, Shield, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: 'Community',
      price: 'Free',
      description: 'Essential emergency reporting for neighborhoods and citizen groups.',
      features: [
        'Quick emergency reporting form',
        'Basic Vision AI classification',
        'Immediate first-aid instructions',
        'Personal reports history logs',
        'SMS/Email status notifications',
      ],
      cta: 'Get Started',
      link: '/register',
      featured: false,
    },
    {
      name: 'Municipal Hub',
      price: '$249',
      period: '/month',
      description: 'Designed for city dispatch networks, fire, and rescue services.',
      features: [
        'Everything in Community plan',
        'Priority scoring and live triage queue',
        'Centralized Admin Dashboard access',
        'Interactive analytics & monthly trends charts',
        'Up to 10 admin coordinator seats',
        'Standard REST API integration keys',
      ],
      cta: 'Start Free Trial',
      link: '/register',
      featured: true,
      tag: 'Most Popular',
    },
    {
      name: 'National Grid',
      price: 'Custom',
      description: 'Comprehensive dashboard telemetry for state and national defense groups.',
      features: [
        'Unlimited coordinator operator seats',
        'Dedicated secure DB instances',
        'Vision AI model customization parameters',
        'Drone dispatch API integration',
        'Ambulance geo-tracking routing feeds',
        '24/7 priority SLA support access',
      ],
      cta: 'Contact Dispatch',
      link: '/#contact',
      featured: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 relative bg-dark-950/20">
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-accent-400 text-xs font-bold uppercase tracking-widest mb-3">Service Plans</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
            Flexible scale <br/>
            <span className="text-dark-400">for critical networks.</span>
          </h2>
          <p className="text-dark-400 text-base leading-relaxed">
            Choose a deployment level that matches your response coordination needs. All plans feature Vision AI triage.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-card p-8 flex flex-col justify-between relative overflow-hidden ${
                plan.featured 
                  ? 'gradient-border scale-102 shadow-xl shadow-primary-500/5 border-transparent' 
                  : ''
              }`}
            >
              {plan.featured && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary-500/25 border border-primary-500/35 text-[10px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <Sparkles size={10} />
                  {plan.tag}
                </div>
              )}

              <div>
                <p className="text-dark-400 text-xs font-bold uppercase tracking-wider mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-sm text-dark-400">{plan.period}</span>}
                </div>
                <p className="text-xs text-dark-400 leading-relaxed mb-8">{plan.description}</p>

                {/* Features Checklist */}
                <div className="space-y-3.5 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-xs text-dark-300">
                      <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={10} className="text-accent-400" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {plan.featured ? (
                <Link to={plan.link} className="btn-primary w-full text-center py-3 text-xs font-bold tracking-wide uppercase rounded-xl">
                  {plan.cta}
                </Link>
              ) : (
                <Link to={plan.link} className="btn-outline w-full text-center py-3 text-xs font-bold tracking-wide uppercase rounded-xl">
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
