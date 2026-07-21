import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeIncident } from '../../services/mockAI';
import {
  Brain,
  Cpu,
  Sparkles,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle,
  Truck,
  Heart,
} from 'lucide-react';

const TEMPLATES = [
  {
    title: '🚗 Highway Crash',
    text: 'A major collision occurred on Highway-8 involving a truck and two cars. One passenger is unconscious and bleeding, traffic is completely blocked.',
  },
  {
    title: '🔥 Kitchen Fire',
    text: 'A kitchen stove fire is spreading rapidly to the wooden cabinets. Heavy black smoke is filling the hallway, residents are evacuating.',
  },
  {
    title: '💨 Gas Smell',
    text: 'Strong rotten egg chemical smell near the LPG cylinder in the basement of the complex. People are complaining of headaches and dizziness.',
  },
  {
    title: '🏥 Cardiac Arrest',
    text: 'An elderly man suddenly collapsed in the central park. He is unresponsive, clutching his chest, and his breathing is extremely shallow.',
  },
];

export default function TriageSimulator() {
  const [description, setDescription] = useState(TEMPLATES[0].text);
  const [status, setStatus] = useState('idle'); // idle | scanning | completed
  const [results, setResults] = useState(null);

  const runSimulation = async () => {
    if (!description.trim()) return;
    setStatus('scanning');
    
    // Simulate AI pipeline delay
    await new Promise((resolve) => setTimeout(resolve, 1800));
    
    const analysis = analyzeIncident(description, 'Other', null);
    setResults(analysis);
    setStatus('completed');
  };

  const loadTemplate = (text) => {
    setDescription(text);
    setStatus('idle');
    setResults(null);
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'High':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'Medium':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-green-500/10 border-green-500/30 text-green-400';
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/40">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-xs font-semibold text-primary-400 mb-4">
            <Cpu size={12} className="animate-spin-slow" />
            TELEMETRY SANDBOX
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-6">
            Neural Triage <br/>
            <span className="text-dark-400">Sandbox Simulator.</span>
          </h2>
          <p className="text-dark-400 text-sm md:text-base leading-relaxed">
            Test our deterministic natural language triage engine. Type an emergency description or select a template to witness severity prediction, bystander action mapping, and service dispatch routing.
          </p>
        </div>

        {/* Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-6 flex flex-col justify-between glass-card p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-white flex items-center gap-2">
                <Brain size={16} className="text-primary-400" />
                Describe the Emergency Situation:
              </label>

              {/* Template Buttons */}
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => loadTemplate(t.text)}
                    className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 text-dark-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    {t.title}
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setStatus('idle');
                  setResults(null);
                }}
                placeholder="Type details about injured casualties, gas odor, spread of flames, water logs..."
                rows={6}
                className="w-full bg-slate-950/60 border border-white/10 focus:border-primary-500/50 rounded-xl p-4 text-sm text-dark-200 focus:outline-none focus:ring-1 focus:ring-primary-500/30 resize-none transition-all"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={status === 'scanning'}
              className="btn-danger w-full py-4 rounded-xl flex items-center justify-center gap-2.5 font-bold tracking-wide transition-all active:scale-[0.98]"
            >
              <Play size={16} className="fill-current" />
              {status === 'scanning' ? 'Executing AI Triage...' : 'Simulate Triage Telemetry'}
            </button>
          </div>

          {/* Right Panel: Output HUD */}
          <div className="lg:col-span-6 glass-card p-6 md:p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden bg-slate-950/60">
            
            <AnimatePresence mode="wait">
              {/* Idle State */}
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col items-center justify-center text-center my-auto py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-dark-500 relative">
                    <Activity size={28} className="text-dark-500" />
                    <div className="absolute inset-0 rounded-2xl border border-primary-500/20 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Diagnostics Standby</h4>
                    <p className="text-xs text-dark-400 mt-1 max-w-xs mx-auto">
                      Click the simulate button to execute classification analysis on your text input.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Scanning State */}
              {status === 'scanning' && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center my-auto py-12 space-y-6"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin" />
                    <Cpu size={32} className="text-primary-400 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold tracking-wider text-primary-400 uppercase animate-pulse">Running Neural Classifiers</h4>
                    <p className="text-[10px] font-mono text-dark-500">
                      Tokenizing stream • matching severity weight • compiling first-aid matrices
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Completed Results State */}
              {status === 'completed' && results && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-5 h-full flex flex-col justify-between"
                >
                  {/* Results Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-accent-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Triage Output</span>
                    </div>
                    <span className="text-[10px] font-mono text-dark-500">
                      ID: RESQ-{Math.floor(1000 + Math.random() * 9000)}
                    </span>
                  </div>

                  {/* Primary Grid Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <p className="text-[10px] text-dark-500 uppercase font-semibold">Incident Category</p>
                      <p className="text-sm font-bold text-white">
                        {results.incidentType === 'Road Accident' && '🚗 Road Accident'}
                        {results.incidentType === 'Fire' && '🔥 Fire Emergency'}
                        {results.incidentType === 'Flood' && '🌊 Flood Incident'}
                        {results.incidentType === 'Medical Emergency' && '🏥 Medical Crisis'}
                        {results.incidentType === 'Earthquake' && '🌍 Earthquake'}
                        {results.incidentType === 'Building Collapse' && '🏚️ Collapse'}
                        {results.incidentType === 'Gas Leak' && '💨 Gas Leak'}
                        {results.incidentType === 'Chemical Spill' && '☣️ Hazmat Spill'}
                        {!['Road Accident', 'Fire', 'Flood', 'Medical Emergency', 'Earthquake', 'Building Collapse', 'Gas Leak', 'Chemical Spill'].includes(results.incidentType) && `🆘 ${results.incidentType}`}
                      </p>
                    </div>

                    <div className={`p-3.5 rounded-xl border space-y-1 ${getSeverityBadgeColor(results.severity)}`}>
                      <p className="text-[10px] uppercase font-semibold opacity-80">Estimated Severity</p>
                      <p className="text-sm font-bold">{results.severity}</p>
                    </div>
                  </div>

                  {/* Confidence metrics */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-400">Triage Classification Confidence:</span>
                      <span className="font-bold text-accent-400">{results.confidencePercent}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${results.confidencePercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Dispatch targets */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[10px] text-primary-400 uppercase font-bold flex items-center gap-1.5">
                      <Truck size={12} />
                      Automated Route Dispatch Target:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {results.emergencyServices.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-dark-300 font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* First aid snippet */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <p className="text-[10px] text-green-400 uppercase font-bold flex items-center gap-1.5">
                      <Heart size={12} />
                      Bystander First-Aid checklist:
                    </p>
                    <div className="space-y-1">
                      {results.firstAid.slice(0, 2).map((aid, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-dark-300">
                          <CheckCircle size={10} className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="line-clamp-1">{aid}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
