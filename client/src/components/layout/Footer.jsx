import { Shield, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-emergency-500 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">ResQ</span>
                <span className="gradient-text"> AI</span>
              </span>
            </div>
            <p className="text-dark-400 text-sm max-w-md leading-relaxed">
              AI-powered emergency incident triage and response system. Helping citizens report emergencies faster and enabling coordinators to prioritize and respond effectively.
            </p>
            <p className="text-dark-500 text-xs mt-4 italic">Every second saves a life.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'How It Works', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="text-white font-semibold mb-4">Emergency Numbers</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li>🚔 Police: <span className="text-white">100</span></li>
              <li>🔥 Fire: <span className="text-white">101</span></li>
              <li>🚑 Ambulance: <span className="text-white">108</span></li>
              <li>🆘 Emergency: <span className="text-white">112</span></li>
              <li>👩 Women Helpline: <span className="text-white">1091</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} ResQ AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-dark-800 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-sm text-dark-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-emergency-500" /> for emergency response
          </p>
        </div>
      </div>
    </footer>
  );
}
