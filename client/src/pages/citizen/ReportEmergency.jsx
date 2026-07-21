import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIncidents } from '../../hooks/useIncidents';
import { analyzeIncident } from '../../services/mockAI';
import { INCIDENT_TYPES } from '../../services/mockData';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import {
  AlertTriangle,
  Upload,
  FileText,
  MapPin,
  Phone,
  Image,
  X,
  Sparkles,
} from 'lucide-react';

export default function ReportEmergency() {
  const [form, setForm] = useState({
    title: '',
    type: '',
    description: '',
    location: '',
    contactNumber: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { addIncident } = useIncidents();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 2000));

    // Run AI analysis
    const analysis = analyzeIncident(form.description, form.type, imageFile);

    // Create incident
    const incident = await addIncident({
      title: form.title,
      type: analysis.incidentType,
      description: form.description,
      location: form.location,
      contactNumber: form.contactNumber,
      severity: analysis.severity,
      confidence: analysis.confidence,
      priorityScore: analysis.priorityScore,
      imageUrl: imagePreview,
      analysis: analysis,
    });

    setLoading(false);
    navigate(`/analysis/${incident.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle size={24} className="text-emergency-400" />
          Report Emergency
        </h1>
        <p className="text-dark-400 text-sm mt-1">
          Provide details about the incident. Our AI will analyze and classify it.
        </p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 md:p-8 space-y-6"
      >
        {/* Incident Title */}
        <Input
          label="Incident Title"
          icon={FileText}
          placeholder="Brief title describing the emergency"
          value={form.title}
          onChange={handleChange('title')}
          required
        />

        {/* Incident Type */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-300">
            Incident Type
          </label>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="input-field appearance-none cursor-pointer"
            required
          >
            <option value="">Select incident type</option>
            {INCIDENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-300">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe the incident in detail. Include information about injuries, number of people affected, current situation, any immediate dangers..."
            rows={5}
            className="input-field resize-none"
            required
          />
          <p className="text-xs text-dark-500">
            Detailed descriptions help our AI provide more accurate analysis and first-aid recommendations.
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-dark-300">
            Upload Image
          </label>
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-700 rounded-xl p-8 text-center cursor-pointer hover:border-primary-500/50 transition-colors group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                  <Upload size={24} className="text-dark-400 group-hover:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-dark-300">Click to upload incident image</p>
                  <p className="text-xs text-dark-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Incident preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-dark-900/80 text-white hover:bg-emergency-500 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-dark-900/80 flex items-center gap-1.5">
                <Image size={14} className="text-green-400" />
                <span className="text-xs text-dark-200">{imageFile?.name}</span>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            icon={MapPin}
            placeholder="Incident location"
            value={form.location}
            onChange={handleChange('location')}
            required
          />
          <Input
            label="Contact Number"
            type="tel"
            icon={Phone}
            placeholder="+91 XXXXXXXXXX"
            value={form.contactNumber}
            onChange={handleChange('contactNumber')}
          />
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" variant="danger" loading={loading} className="flex-1">
            {loading ? (
              <>
                <Sparkles size={18} className="animate-spin" />
                AI Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Submit & Analyze
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
