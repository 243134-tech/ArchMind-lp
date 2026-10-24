import React, { useState } from 'react';
import {
  Star,
  CheckCircle,
  MapPin,
  Send,
  Plus,
  X,
  Phone,
  Mail,
  Briefcase,
  ChevronRight,
  Check,
} from 'lucide-react';
import { archMindStore } from '../services/store';
import { Professional } from '../types';
import { formatINR } from '../utils/formatters';

interface ProfessionalsPageProps {
  onNavigate: (route: string) => void;
}

export const ProfessionalsPage: React.FC<ProfessionalsPageProps> = ({ onNavigate }) => {
  const professionals = archMindStore.getProfessionals();
  const activeProject = archMindStore.getActiveProject();

  const [selectedRole, setSelectedRole] = useState('All');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [activeProf, setActiveProf] = useState<Professional | null>(null);

  const [clientName, setClientName] = useState(archMindStore.getUser().name);
  const [clientEmail, setClientEmail] = useState(archMindStore.getUser().email);
  const [clientPhone, setClientPhone] = useState('+60 12-345 6789');
  const [serviceRequested, setServiceRequested] = useState('Interior Architectural Design');
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hi, I would like to consult on my project "${activeProject?.name}" (${activeProject?.builtUpArea} sq ft renovation in ${activeProject?.location}).`
  );
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const roles = ['All', 'Principal Architect', 'Interior Designer', 'General Contractor'];

  const filtered = professionals.filter((p) => {
    if (selectedRole !== 'All' && p.role !== selectedRole) return false;
    return true;
  });

  const openInquiry = (prof: Professional) => {
    setActiveProf(prof);
    setServiceRequested(prof.specializations[0] || 'Design Consultation');
    setInquiryModalOpen(true);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProf) return;

    archMindStore.submitInquiry({
      projectId: activeProject?.id || 'proj_modern_terrace',
      professionalId: activeProf.id,
      clientName,
      clientEmail,
      clientPhone,
      serviceRequested,
      message: inquiryMessage,
    });

    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryModalOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#006B7B] uppercase tracking-wider mb-0.5">
            Professionals Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171C2C] tracking-tight">
            Certified Professionals
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Connect with vetted architects, interior designers, and general contractors for your project.
          </p>
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRole(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedRole === r
                ? 'bg-[#006B7B] text-white font-semibold shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-[#E6E9ED]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Professionals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prof) => (
          <div
            key={prof.id}
            className="p-5 bg-white rounded-2xl border border-[#E6E9ED] shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={prof.avatarUrl}
                  alt={prof.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-600/10 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 text-sm">{prof.name}</h3>
                    {prof.verified && <CheckCircle className="w-3.5 h-3.5 text-[#006B7B] fill-teal-50" />}
                  </div>
                  <div className="text-xs text-[#006B7B] font-semibold">{prof.role}</div>
                  <div className="text-[11px] text-gray-500">{prof.firm}</div>
                </div>
              </div>

              {/* Rating & Location */}
              <div className="flex items-center justify-between text-xs text-gray-600 py-2 border-y border-gray-100 my-3">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{prof.rating}</span>
                  <span className="text-[10px] text-gray-400 font-normal">({prof.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>{prof.location}</span>
                  <span>•</span>
                  <span className="font-semibold text-gray-700">{formatINR(prof.hourlyRate)}/hr</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">
                {prof.bio}
              </p>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1 mb-3">
                {prof.specializations.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium border border-gray-200">
                    {s}
                  </span>
                ))}
              </div>

              {/* Portfolio Thumbnails */}
              {prof.portfolioImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {prof.portfolioImages.slice(0, 2).map((img, i) => (
                    <img key={i} src={img} alt="Portfolio" className="w-full h-16 rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={() => openInquiry(prof)}
                className="w-full py-2.5 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Project Inquiry</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Send Inquiry Modal */}
      {inquiryModalOpen && activeProf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E6E9ED] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm">Send Inquiry to {activeProf.name}</h3>
              <button onClick={() => setInquiryModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Inquiry Dispatched!</h4>
                <p className="text-xs text-gray-500">
                  {activeProf.name} from {activeProf.firm} has been notified and linked to project {activeProject?.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Service Requested</label>
                  <input
                    type="text"
                    value={serviceRequested}
                    onChange={(e) => setServiceRequested(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#006B7B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006B7B] hover:bg-[#004F5C] text-white rounded-xl font-medium shadow-xs"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
