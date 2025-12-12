
import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Briefcase, GraduationCap, User, Heart, Star, Languages, Scissors } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

// --- CONFIGURATION ---

const labels = {
  fr: { contact: "Contact", skills: "Compétences", languages: "Langues", experience: "Expérience Professionnelle", education: "Formation", present: "Présent", about: "Profil", hobbies: "Centres d'intérêt" },
  en: { contact: "Contact", skills: "Skills", languages: "Languages", experience: "Work Experience", education: "Education", present: "Present", about: "Profile", hobbies: "Interests" },
  ar: { contact: "اتصال", skills: "مهارات", languages: "لغات", experience: "الخبرة العملية", education: "التعليم", present: "حاضر", about: "الملف الشخصي", hobbies: "الهوايات" },
  nl: { contact: "Contact", skills: "Vaardigheden", languages: "Talen", experience: "Werkervaring", education: "Opleiding", present: "Heden", about: "Profiel", hobbies: "Interesses" },
  es: { contact: "Contacto", skills: "Habilidades", languages: "Idiomas", experience: "Experiencia", education: "Educación", present: "Presente", about: "Perfil", hobbies: "Intereses" },
  pt: { contact: "Contato", skills: "Habilidades", languages: "Idiomas", experience: "Experiência", education: "Educação", present: "Atual", about: "Perfil", hobbies: "Interesses" },
  ru: { contact: "Контакты", skills: "Навыки", languages: "Языки", experience: "Опыт работы", education: "Образование", present: "По наст. время", about: "Обо мне", hobbies: "Хобби" }
};

// --- VISUAL HELPERS ---

// A visual marker to show where the page break will roughly occur (at 297mm)
const PageBreakMarker = () => (
    <div className="absolute left-0 w-full flex items-center pointer-events-none opacity-50" style={{ top: '297mm' }}>
        <div className="flex-1 border-t-2 border-dashed border-red-400"></div>
        <span className="bg-red-100 text-red-500 text-[10px] px-2 font-bold uppercase rounded-full mx-2 border border-red-200 print:hidden">
            Fin Page 1
        </span>
        <div className="flex-1 border-t-2 border-dashed border-red-400"></div>
    </div>
);

const ContactItem = ({ icon: Icon, value, link, className = "" }: { icon: any, value: string, link?: string, className?: string }) => {
  if (!value) return null;
  return (
    <div className={`flex items-center gap-2 text-sm mb-1 ${className}`}>
      <Icon size={14} className="opacity-70 min-w-[14px]" />
      {link ? <a href={link} target="_blank" rel="noreferrer" className="hover:underline truncate">{value}</a> : <span className="truncate">{value}</span>}
    </div>
  );
};

const PhotoComponent = ({ url, config, className = "w-32 h-32 rounded-full" }: { url?: string, config?: { zoom: number, x: number, y: number }, className?: string }) => {
    if (!url) return null;
    const { zoom = 1, x = 0, y = 0 } = config || {};
    return (
        <div className={`overflow-hidden relative ${className} bg-slate-200`}>
            <img 
                src={url} 
                alt="Profile" 
                className="w-full h-full object-cover"
                style={{ 
                    transform: `scale(${zoom}) translate(${x}%, ${y}%)`,
                    transformOrigin: 'center center'
                }} 
            />
        </div>
    );
};

const SkillBar = ({ level, color }: { level: number, color?: string }) => (
    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
        <div className="h-1.5 rounded-full" style={{ width: `${(level / 5) * 100}%`, backgroundColor: color || '#4a5568' }}></div>
    </div>
);

const RatingDots = ({ level }: { level: number }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(v => (
            <div key={v} className={`w-1.5 h-1.5 rounded-full ${v <= level ? 'bg-current opacity-100' : 'bg-current opacity-20'}`} />
        ))}
    </div>
);

// --- LAYOUT ENGINES ---
// Note: min-h-[297mm] ensures at least one page, but allows growth.

const SidebarLeftLayout: React.FC<TemplateProps & { bgHeader?: boolean, squarePhoto?: boolean }> = ({ data, bgHeader, squarePhoto }) => {
  const t = labels[data.language] || labels.fr;
  const isRTL = data.language === 'ar';
  const { personalInfo, theme } = data;

  return (
    <div className="w-full min-h-[297mm] h-auto bg-white flex text-slate-800 relative" style={{ fontFamily: theme.fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
      <PageBreakMarker />
      
      {/* Sidebar */}
      <div className="w-[32%] bg-slate-100 p-6 flex flex-col text-slate-700 relative min-h-full" style={bgHeader ? { backgroundColor: theme.primaryColor, color: 'white' } : {}}>
        <div className="flex justify-center mb-6">
            <PhotoComponent url={personalInfo.photoUrl} config={personalInfo.photoConfig} className={`${squarePhoto ? 'rounded-lg' : 'rounded-full'} w-40 h-40 ${bgHeader ? 'border-white/20' : 'border-white'}`} />
        </div>
        
        <div className={`mb-8 ${bgHeader ? 'border-white/20' : 'border-slate-200'} border-b pb-4`}>
            <h3 className="font-bold uppercase tracking-wider mb-4 opacity-80 text-sm flex items-center gap-2">
                <User size={14}/> {t.contact}
            </h3>
            <div className="space-y-2.5 text-xs font-medium">
                <ContactItem icon={Mail} value={personalInfo.email} />
                <ContactItem icon={Phone} value={personalInfo.phone} />
                <ContactItem icon={MapPin} value={personalInfo.address} />
                <ContactItem icon={Linkedin} value={personalInfo.linkedin} />
                <ContactItem icon={Globe} value={personalInfo.website} />
            </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold uppercase tracking-wider mb-4 opacity-80 text-sm flex items-center gap-2">
              <Star size={14}/> {t.skills}
          </h3>
          <div className="space-y-3">
            {data.skills.map(skill => (
              <div key={skill.id}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{skill.name}</span>
                  </div>
                  <SkillBar level={skill.level} color={bgHeader ? 'white' : theme.primaryColor} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
            <h3 className="font-bold uppercase tracking-wider mb-4 opacity-80 text-sm flex items-center gap-2">
                <Languages size={14}/> {t.languages}
            </h3>
            <div className="space-y-2">
              {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center text-xs">
                      <span className="font-bold">{l.name}</span>
                      <span className="opacity-70">{l.level}</span>
                  </div>
              ))}
            </div>
        </div>

        {data.hobbies.length > 0 && (
            <div>
                <h3 className="font-bold uppercase tracking-wider mb-4 opacity-80 text-sm flex items-center gap-2">
                    <Heart size={14}/> {t.hobbies}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((h, i) => (
                        <span key={i} className={`px-2 py-1 text-xs rounded border ${bgHeader ? 'border-white/30 bg-white/10' : 'border-slate-300 bg-white'}`}>
                            {h}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Main */}
      <div className="w-[68%] p-8 pt-10">
        <div className="mb-8 border-b-2 pb-6" style={{ borderColor: theme.primaryColor }}>
            <h1 className="text-4xl font-bold uppercase mb-2 leading-tight" style={{ color: theme.primaryColor }}>{personalInfo.fullName}</h1>
            <p className="text-xl text-slate-500 font-light mb-4">{personalInfo.jobTitle}</p>
            {personalInfo.summary && (
                <div>
                     <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t.about}</h3>
                     <p className="text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>
            )}
        </div>

        <div className="mb-8">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 uppercase tracking-wide border-b pb-2" style={{ color: theme.primaryColor, borderColor: '#e2e8f0' }}>
                <Briefcase size={18} /> {t.experience}
            </h2>
            <div className="space-y-6">
                {data.experiences.map(exp => (
                    <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base text-slate-800">{exp.title}</h3>
                            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primaryColor }}>
                                {exp.startDate} - {exp.current ? t.present : exp.endDate}
                            </span>
                        </div>
                        <div className="text-xs font-bold uppercase text-slate-500 mb-2">{exp.company}</div>
                        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {data.education.length > 0 && (
            <div>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2 uppercase tracking-wide border-b pb-2" style={{ color: theme.primaryColor, borderColor: '#e2e8f0' }}>
                    <GraduationCap size={18} /> {t.education}
                </h2>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{edu.startDate} - {edu.endDate}</span>
                            </div>
                            <div className="text-sm text-slate-600 mt-1 italic">{edu.school}</div>
                            {edu.description && <p className="text-xs text-slate-500 mt-1">{edu.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const HeaderTopLayout: React.FC<TemplateProps & { center?: boolean, bold?: boolean }> = ({ data, center, bold }) => {
    const t = labels[data.language] || labels.fr;
    const isRTL = data.language === 'ar';
    const { personalInfo, theme } = data;

    return (
        <div className="w-full min-h-[297mm] h-auto bg-white p-10 text-slate-800 flex flex-col relative" style={{ fontFamily: theme.fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
            <PageBreakMarker />
            
            {/* Header */}
            <div className={`flex ${center ? 'flex-col items-center text-center' : 'flex-row items-center'} gap-8 mb-8 border-b-4 pb-8`} style={{ borderColor: theme.primaryColor }}>
                <PhotoComponent url={personalInfo.photoUrl} config={personalInfo.photoConfig} className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-lg" />
                <div className="flex-1">
                    <h1 className={`text-5xl ${bold ? 'font-black uppercase tracking-tight' : 'font-light'} mb-2`} style={{ color: theme.primaryColor }}>{personalInfo.fullName}</h1>
                    <p className="text-2xl text-slate-400 font-light mb-4">{personalInfo.jobTitle}</p>
                    <div className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 ${center ? 'justify-center' : ''}`}>
                         <ContactItem icon={Mail} value={personalInfo.email} />
                         <ContactItem icon={Phone} value={personalInfo.phone} />
                         <ContactItem icon={Linkedin} value={personalInfo.linkedin} />
                         <ContactItem icon={MapPin} value={personalInfo.address} />
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-10 flex-1">
                {/* Left (Main) */}
                <div className="col-span-8 flex flex-col gap-8">
                     {personalInfo.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 pb-1 text-slate-400 flex items-center gap-2">{t.about}</h2>
                            <p className="text-slate-700 leading-relaxed text-sm">{personalInfo.summary}</p>
                        </section>
                     )}

                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b-2 pb-1 text-slate-400 flex items-center gap-2">{t.experience}</h2>
                        <div className="space-y-8">
                            {data.experiences.map(exp => (
                                <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: theme.primaryColor }}>
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white border-2" style={{borderColor: theme.primaryColor}}></div>
                                    <h3 className="font-bold text-lg text-slate-900">{exp.title}</h3>
                                    <div className="flex justify-between items-center text-sm mb-2 mt-1">
                                        <span className="font-bold uppercase text-xs tracking-wider" style={{ color: theme.primaryColor }}>{exp.company}</span>
                                        <span className="text-slate-400 italic text-xs">{exp.startDate} - {exp.current ? t.present : exp.endDate}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                     </section>

                     {data.education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b-2 pb-1 text-slate-400 flex items-center gap-2">{t.education}</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="bg-slate-50 p-4 rounded border-l-4" style={{borderColor: theme.primaryColor}}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-800">{edu.degree}</div>
                                                <div className="text-sm text-slate-600">{edu.school}</div>
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono bg-white px-2 py-1 rounded border">{edu.startDate} - {edu.endDate}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                     )}
                </div>

                {/* Right (Sidebar) */}
                <div className="col-span-4 space-y-8">
                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-slate-400">{t.skills}</h2>
                        <div className="space-y-3">
                            {data.skills.map(skill => (
                                <div key={skill.id}>
                                    <div className="flex justify-between text-xs font-bold mb-1 text-slate-700">
                                        <span>{skill.name}</span>
                                    </div>
                                    <SkillBar level={skill.level} color={theme.primaryColor} />
                                </div>
                            ))}
                        </div>
                     </section>

                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-slate-400">{t.languages}</h2>
                        <ul className="space-y-2">
                             {data.languages.map(l => (
                                 <li key={l.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-1">
                                     <span className="font-medium text-slate-700">{l.name}</span>
                                     <span className="text-xs text-slate-400 uppercase">{l.level}</span>
                                 </li>
                             ))}
                        </ul>
                     </section>
                     
                     {data.hobbies.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-1 text-slate-400">{t.hobbies}</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.hobbies.map((h, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-bold">
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </section>
                     )}
                </div>
            </div>
        </div>
    );
};

const SplitLayout: React.FC<TemplateProps> = ({ data }) => {
    const t = labels[data.language] || labels.fr;
    const isRTL = data.language === 'ar';
    const { personalInfo, theme } = data;
    
    return (
        <div className="w-full min-h-[297mm] h-auto bg-white flex relative" style={{ fontFamily: theme.fontFamily, direction: isRTL ? 'rtl' : 'ltr' }}>
            <PageBreakMarker />
            
            {/* Left Color Panel */}
            <div className="w-[35%] text-white p-8 flex flex-col" style={{ backgroundColor: theme.primaryColor }}>
                <div className="flex justify-center mb-8">
                    <PhotoComponent url={personalInfo.photoUrl} config={personalInfo.photoConfig} className="w-40 h-40 rounded-full border-4 border-white/30" />
                </div>
                
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold mb-2 leading-tight">{personalInfo.fullName}</h1>
                    <p className="text-sm opacity-80 uppercase tracking-widest">{personalInfo.jobTitle}</p>
                </div>

                <div className="space-y-8 flex-1">
                    <div>
                            <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-1 text-xs">{t.contact}</h3>
                            <div className="space-y-3 text-xs opacity-90">
                            <ContactItem icon={Mail} value={personalInfo.email} />
                            <ContactItem icon={Phone} value={personalInfo.phone} />
                            <ContactItem icon={MapPin} value={personalInfo.address} />
                            <ContactItem icon={Linkedin} value={personalInfo.linkedin} />
                            <ContactItem icon={Globe} value={personalInfo.website} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-1 text-xs">{t.skills}</h3>
                        <ul className="space-y-3">
                            {data.skills.map(skill => (
                                <li key={skill.id}>
                                    <div className="flex justify-between items-center text-xs mb-1">
                                        <span>{skill.name}</span>
                                    </div>
                                    <RatingDots level={skill.level} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase tracking-widest mb-4 border-b border-white/30 pb-1 text-xs">{t.languages}</h3>
                        <ul className="space-y-2">
                            {data.languages.map(l => (
                                <li key={l.id} className="flex justify-between text-xs border-b border-white/10 pb-1">
                                    <span>{l.name}</span>
                                    <span className="opacity-70">{l.level}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right White Panel */}
            <div className="w-[65%] p-8 pt-10">
                {personalInfo.summary && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2 border-b-2 pb-2 border-slate-100">
                            <User size={20} className="text-slate-400"/> {t.about}
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm">{personalInfo.summary}</p>
                    </section>
                )}

                <section className="mb-8">
                    <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2 border-b-2 pb-2 border-slate-100">
                        <Briefcase size={20} className="text-slate-400"/> {t.experience}
                    </h2>
                    <div className="space-y-6">
                        {data.experiences.map(exp => (
                            <div key={exp.id} className="group">
                                <h3 className="font-bold text-base text-slate-800">{exp.title}</h3>
                                <div className="text-xs font-bold mb-2 uppercase tracking-wide flex justify-between items-center" style={{ color: theme.primaryColor }}>
                                    <span>{exp.company}</span>
                                    <span className="text-slate-400">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-sm text-slate-600 border-l-2 border-slate-100 pl-3">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2 border-b-2 pb-2 border-slate-100">
                        <GraduationCap size={20} className="text-slate-400"/> {t.education}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{edu.degree}</h3>
                                    <div className="text-xs text-slate-500">{edu.school}</div>
                                </div>
                                <div className="text-xs text-slate-400 font-medium">{edu.startDate} - {edu.endDate}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {data.hobbies.length > 0 && (
                     <section>
                        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2 border-b-2 pb-2 border-slate-100">
                            <Heart size={20} className="text-slate-400"/> {t.hobbies}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {data.hobbies.map((h, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs border border-slate-200 rounded">
                                    {h}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export const ResumePreview: React.FC<TemplateProps> = ({ data }) => {
  switch (data.theme.template) {
    case 'berlin': return <SidebarLeftLayout data={data} bgHeader={true} />;
    case 'oslo': return <SidebarLeftLayout data={{ ...data, theme: { ...data.theme, primaryColor: '#1e293b' } }} bgHeader={true} />;
    case 'stockholm': return <SidebarLeftLayout data={data} bgHeader={false} />;
    
    case 'nyc': return <HeaderTopLayout data={data} bold={true} />;
    case 'london': return <HeaderTopLayout data={data} center={true} />;
    case 'sydney': return <HeaderTopLayout data={data} center={false} />;
    case 'corporate': return <HeaderTopLayout data={data} center={false} bold={true} />;

    case 'paris': return <SplitLayout data={data} />;
    case 'madrid': return <SplitLayout data={data} />;
    case 'rome': return <SplitLayout data={data} />;
    case 'dubai': return <SplitLayout data={data} />;
        
    case 'minimalist': return <HeaderTopLayout data={data} center={true} />;
    case 'modern': return <SidebarLeftLayout data={data} bgHeader={true} squarePhoto={true} />;
    case 'tokyo': return <SidebarLeftLayout data={data} bgHeader={false} squarePhoto={true} />;
    case 'amsterdam': return <HeaderTopLayout data={data} center={true} bold={true} />;
    case 'sf': return <SidebarLeftLayout data={data} bgHeader={true} />;
    
    default: return <SidebarLeftLayout data={data} bgHeader={true} />;
  }
};
