
import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, INITIAL_RESUME, TemplateId, Language, Skill, LanguageSkill } from './types';
import { ResumePreview } from './components/ResumeTemplates';
import { generateResumeContent, improveDescription, parseResumeFromText, parseResumeFromFile, autoSortResume, translateResumeContent } from './services/geminiService';
import { 
  Palette, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Wand2,
  Printer,
  Globe,
  FileText,
  Import,
  MessageSquare,
  Menu,
  X,
  User,
  Image as ImageIcon,
  CheckCircle2,
  Layout,
  Type,
  ArrowLeft,
  GraduationCap,
  Hammer,
  Languages,
  Heart,
  Eye,
  ZoomIn,
  Move,
  Upload,
  FileIcon,
  RefreshCw,
  Check
} from 'lucide-react';

const uiTranslations = {
  fr: { title: "CV Master Pro", startTitle: "Choisissez votre modèle", startSubtitle: "Des designs professionnels, prêts à l'emploi.", tabContent: "Éditeur", tabDesign: "Design", tabImport: "Import IA", generate: "Générer avec IA", download: "Télécharger", save: "Sauvegarder", personalInfo: "Infos Personnelles", experience: "Expérience Pro", education: "Formation", skills: "Compétences", languages: "Langues", hobbies: "Hobbys", addExp: "Ajouter", addEdu: "Ajouter Formation", addSkill: "Ajouter Compétence", addLang: "Ajouter Langue", addHobby: "Ajouter Hobby", improve: "Améliorer (IA)", importTitle: "Import Intelligent", importDesc: "Collez votre ancien CV complet ici. L'IA va tout extraire.", analyzeBtn: "Analyser le CV", analyzing: "Analyse en cours...", preview: "Aperçu A4", openDrawer: "Ouvrir", closeDrawer: "Fermer", photo: "Photo", selectTemplate: "Modèles", backToGallery: "Retour", fonts: "Typographie", colors: "Couleurs", viewPreview: "Voir l'aperçu", uploadTitle: "Scanner un CV (PDF/Image)", uploadDesc: "Glissez votre fichier ici pour une extraction complète.", or: "OU", textMode: "Mode Texte", fileMode: "Mode Fichier", done: "Terminer", translating: "Traduction..." },
  en: { title: "CV Master Pro", startTitle: "Choose your template", startSubtitle: "Professional designs, ready to use.", tabContent: "Editor", tabDesign: "Design", tabImport: "AI Import", generate: "Generate with AI", download: "Download", save: "Save", personalInfo: "Personal Info", experience: "Work Experience", education: "Education", skills: "Skills", languages: "Languages", hobbies: "Hobbies", addExp: "Add Work", addEdu: "Add Education", addSkill: "Add Skill", addLang: "Add Language", addHobby: "Add Hobby", improve: "Improve (AI)", importTitle: "Smart Import", importDesc: "Paste your full CV here. AI will extract everything.", analyzeBtn: "Analyze Resume", analyzing: "Analyzing...", preview: "A4 Preview", openDrawer: "Open", closeDrawer: "Close", photo: "Photo", selectTemplate: "Templates", backToGallery: "Back", fonts: "Typography", colors: "Colors", viewPreview: "View Preview", uploadTitle: "Scan Resume (PDF/Image)", uploadDesc: "Drop your file here for full extraction.", or: "OR", textMode: "Text Mode", fileMode: "File Mode", done: "Done", translating: "Translating..." },
  ar: { title: "صانع السيرة الذاتية", startTitle: "اختر قالبك", startSubtitle: "تصاميم احترافية جاهزة.", tabContent: "محتوى", tabDesign: "تصميم", tabImport: "استيراد", generate: "توليد", download: "تحميل", save: "حفظ", personalInfo: "معلومات شخصية", experience: "الخبرة العملية", education: "التعليم", skills: "المهارات", languages: "اللغات", hobbies: "هوايات", addExp: "إضافة", addEdu: "إضافة تعليم", addSkill: "إضافة مهارة", addLang: "إضافة لغة", addHobby: "إضافة هواية", improve: "تحسين", importTitle: "استيراد", importDesc: "الصق سيرتك الذاتية...", analyzeBtn: "تحليل", analyzing: "...", preview: "معاينة", openDrawer: "فتح", closeDrawer: "إغلاق", photo: "صورة", selectTemplate: "قوالب", backToGallery: "عودة", fonts: "خطوط", colors: "ألوان", viewPreview: "معاينة", uploadTitle: "مسح السيرة الذاتية", uploadDesc: "أفلت ملفك هنا", or: "أو", textMode: "نص", fileMode: "ملف", done: "تم", translating: "يترجم..." },
  nl: { title: "CV Meester", startTitle: "Kies uw sjabloon", startSubtitle: "Professionele ontwerpen.", tabContent: "Editor", tabDesign: "Ontwerp", tabImport: "AI Import", generate: "Genereren", download: "Download", save: "Opslaan", personalInfo: "Persoonlijk", experience: "Werkervaring", education: "Opleiding", skills: "Vaardigheden", languages: "Talen", hobbies: "Hobby's", addExp: "Toevoegen", addEdu: "Opleiding Toev.", addSkill: "Vaardigheid Toev.", addLang: "Taal Toev.", addHobby: "Hobby Toev.", improve: "Verbeteren", importTitle: "Slimme Import", importDesc: "Plak hier uw oude CV...", analyzeBtn: "Analyseren", analyzing: "...", preview: "Voorbeeld", openDrawer: "Open", closeDrawer: "Sluiten", photo: "Foto", selectTemplate: "Sjablonen", backToGallery: "Terug", fonts: "Typografie", colors: "Kleuren", viewPreview: "Bekijk", uploadTitle: "Scan CV", uploadDesc: "Sleep uw bestand hier", or: "OF", textMode: "Tekst", fileMode: "Bestand", done: "Klaar", translating: "Vertalen..." },
  es: { title: "CV Maestro", startTitle: "Elige tu plantilla", startSubtitle: "Diseños profesionales.", tabContent: "Editor", tabDesign: "Diseño", tabImport: "Importar IA", generate: "Generar", download: "Descargar", save: "Guardar", personalInfo: "Información", experience: "Experiencia", education: "Educación", skills: "Habilidades", languages: "Idiomas", hobbies: "Aficiones", addExp: "Añadir", addEdu: "Añadir Edu", addSkill: "Añadir Hab", addLang: "Añadir Idioma", addHobby: "Añadir Afición", improve: "Mejorar", importTitle: "Importar", importDesc: "Pega tu CV antiguo...", analyzeBtn: "Analizar", analyzing: "...", preview: "Vista", openDrawer: "Abrir", closeDrawer: "Cerrar", photo: "Foto", selectTemplate: "Plantillas", backToGallery: "Volver", fonts: "Tipografía", colors: "Colores", viewPreview: "Vista Previa", uploadTitle: "Escanear CV", uploadDesc: "Suelta tu archivo aquí", or: "O", textMode: "Texto", fileMode: "Archivo", done: "Hecho", translating: "Traduciendo..." },
  pt: { title: "CV Mestre", startTitle: "Escolha seu modelo", startSubtitle: "Designs profissionais.", tabContent: "Editor", tabDesign: "Design", tabImport: "Importar IA", generate: "Gerar", download: "Baixar", save: "Salvar", personalInfo: "Pessoal", experience: "Experiência", education: "Educação", skills: "Habilidades", languages: "Idiomas", hobbies: "Hobbies", addExp: "Adicionar", addEdu: "Adicionar Edu", addSkill: "Adicionar Hab", addLang: "Adicionar Língua", addHobby: "Adicionar Hobby", improve: "Melhorar", importTitle: "Importar", importDesc: "Cole seu CV antigo...", analyzeBtn: "Analisar", analyzing: "...", preview: "Visualizar", openDrawer: "Abrir", closeDrawer: "Fechar", photo: "Foto", selectTemplate: "Modelos", backToGallery: "Voltar", fonts: "Tipografia", colors: "Cores", viewPreview: "Visualizar", uploadTitle: "Escanear CV", uploadDesc: "Solte seu arquivo aqui", or: "OU", textMode: "Texto", fileMode: "Arquivo", done: "Concluído", translating: "Traduzindo..." },
  ru: { title: "Мастер Резюме", startTitle: "Выберите шаблон", startSubtitle: "Профессиональные дизайны.", tabContent: "Редактор", tabDesign: "Дизайн", tabImport: "Импорт", generate: "Создать с ИИ", download: "Скачать", save: "Сохранить", personalInfo: "Личные данные", experience: "Опыт работы", education: "Образование", skills: "Навыки", languages: "Языки", hobbies: "Хобби", addExp: "Добавить", addEdu: "Добавить обуч.", addSkill: "Добавить навык", addLang: "Добавить язык", addHobby: "Добавить хобби", improve: "Улучшить", importTitle: "Умный Импорт", importDesc: "Вставьте текст резюме...", analyzeBtn: "Анализ", analyzing: "...", preview: "Просмотр", openDrawer: "Открыть", closeDrawer: "Закрыть", photo: "Фото", selectTemplate: "Шаблоны", backToGallery: "Назад", fonts: "Шрифты", colors: "Цвета", viewPreview: "Просмотр", uploadTitle: "Скан Резюме", uploadDesc: "Перетащите файл сюда", or: "ИЛИ", textMode: "Текст", fileMode: "Файл", done: "Готово", translating: "Перевод..." }
};

const fontOptions = [
  { name: 'Inter (Moderne)', value: 'Inter, sans-serif' },
  { name: 'Roboto (Tech)', value: 'Roboto, sans-serif' },
  { name: 'Lato (Amical)', value: 'Lato, sans-serif' },
  { name: 'Montserrat (Pro)', value: 'Montserrat, sans-serif' },
  { name: 'Merriweather (Sérieux)', value: 'Merriweather, serif' },
  { name: 'Open Sans (Neutre)', value: 'Open Sans, sans-serif' },
];

const templatesList: {id: TemplateId, name: string}[] = [
    { id: 'berlin', name: 'Berlin' },
    { id: 'london', name: 'London' },
    { id: 'paris', name: 'Paris' },
    { id: 'nyc', name: 'New York' },
    { id: 'tokyo', name: 'Tokyo' },
    { id: 'sydney', name: 'Sydney' },
    { id: 'madrid', name: 'Madrid' },
    { id: 'rome', name: 'Rome' },
    { id: 'stockholm', name: 'Stockholm' },
    { id: 'oslo', name: 'Oslo' },
    { id: 'dubai', name: 'Dubai' },
    { id: 'amsterdam', name: 'Amsterdam' },
    { id: 'sf', name: 'San Francisco' },
    { id: 'minimalist', name: 'Minimal' },
    { id: 'corporate', name: 'Corporate' },
];

const colorsList = ['#2563eb', '#059669', '#dc2626', '#7c3aed', '#db2777', '#111827', '#0891b2', '#ea580c'];

const PREVIEW_DATA: ResumeData = {
    ...INITIAL_RESUME,
    personalInfo: {
        fullName: "Alex Martin",
        jobTitle: "Chef de Projet",
        email: "alex.martin@email.com",
        phone: "06 12 34 56 78",
        address: "Paris, France",
        linkedin: "linkedin.com/in/alex",
        website: "alex-portfolio.com",
        summary: "Professionnel passionné avec plus de 5 ans d'expérience dans la gestion de projets numériques innovants. Expert en coordination d'équipes agiles et en livraison de solutions orientées résultats.",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    experiences: [
        { id: '1', title: 'Senior Tech Lead', company: 'Tech Solutions', startDate: '2020', endDate: 'Présent', current: true, description: 'Direction technique et gestion d\'équipe de 10 développeurs.' }
    ],
    skills: [{id: '1', name: 'Gestion de Projet', level: 5}, {id: '2', name: 'Agile/Scrum', level: 4}, {id: '3', name: 'Communication', level: 5}],
    languages: [{id: '1', name: 'Français', level: 'Natif'}, {id: '2', name: 'Anglais', level: 'Courant'}],
    hobbies: ['Photographie', 'Voyages', 'Tech']
};

const InputGroup = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-wider">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px] transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input 
        type={type}
        className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

const RealTemplateCard: React.FC<{ tpl: typeof templatesList[0], onClick: () => void }> = ({ tpl, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group relative flex-shrink-0 cursor-pointer"
            style={{ width: '280px', height: '400px' }}
        >
            <div className="w-full h-full bg-slate-200 rounded-xl overflow-hidden shadow-xl border-2 border-slate-700 group-hover:border-blue-500 group-hover:shadow-2xl transition-all duration-300 relative">
                <div className="origin-top-left transform scale-[0.35] bg-white pointer-events-none" style={{ width: '210mm', height: '297mm' }}>
                    <ResumePreview data={{...PREVIEW_DATA, theme: { ...PREVIEW_DATA.theme, template: tpl.id }}} />
                </div>
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm transform scale-110 shadow-lg">Choisir</span>
                </div>
            </div>
            <div className="text-center mt-3">
                <span className="text-white font-bold text-lg tracking-wide group-hover:text-blue-400 transition-colors">{tpl.name}</span>
            </div>
        </div>
    );
};

export default function App() {
  // Use PREVIEW_DATA by default so the user starts with the French demo data
  const [resume, setResume] = useState<ResumeData>(PREVIEW_DATA);
  const [isSelectionMode, setIsSelectionMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'import'>('content');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [genJobTitle, setGenJobTitle] = useState('');
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<'text' | 'file'>('file');
  const [uiLang, setUiLang] = useState<Language>('fr');
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  
  const [previewScale, setPreviewScale] = useState(0.8); 
  const previewContainerRef = useRef<HTMLDivElement>(null);
  
  const t = uiTranslations[uiLang];

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    hobbies: false
  });

  useEffect(() => {
    const handleResize = () => {
        if (previewContainerRef.current) {
            const containerWidth = previewContainerRef.current.clientWidth;
            
            const a4Width = 794; // approx A4 px width at 96dpi
            const padding = 60; // Padding around preview
            
            // Calculate scale to fit width mainly, as height should scroll
            const scaleX = (containerWidth - padding) / a4Width;
            
            // Allow zoom up to 1.1 or down to 0.4
            setPreviewScale(Math.min(1.1, Math.max(0.4, scaleX)));
        }
    };
    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (previewContainerRef.current) observer.observe(previewContainerRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen, isSelectionMode]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTemplateSelect = (id: TemplateId) => {
      setResume(prev => ({ ...prev, theme: { ...prev.theme, template: id } }));
      setIsSelectionMode(false);
      setActiveTab('content'); 
      setSidebarOpen(true); 
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            updatePersonalInfo('photoUrl', reader.result as string);
            setIsPhotoEditing(true); // Automatically open editor on upload
        };
        reader.readAsDataURL(file);
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    setIsImporting(true);
    try {
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const mimeType = file.type;
            const parsedData = await parseResumeFromFile(base64String, mimeType);
            setResume(prev => ({ ...prev, ...parsedData }));
            setActiveTab('content');
            setIsImporting(false);
        };
        reader.readAsDataURL(file);
    } catch (e) {
        alert("Erreur lecture fichier");
        setIsImporting(false);
    }
  };

  const handleGenerate = async () => {
    if (!genJobTitle) return;
    setIsGenerating(true);
    try {
      const newData = await generateResumeContent(genJobTitle, resume);
      setResume(prev => ({ ...prev, ...newData }));
      setActiveTab('content'); 
    } catch (e) {
      alert("Erreur de génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportText = async () => {
    if(!importText) return;
    setIsImporting(true);
    try {
        const parsedData = await parseResumeFromText(importText);
        setResume(prev => ({ ...prev, ...parsedData }));
        setActiveTab('content');
        setImportText('');
    } catch (e) {
        alert("Erreur import: " + e);
    } finally {
        setIsImporting(false);
    }
  };

  const handleImproveText = async (id: string, text: string) => {
    if (!text) return;
    const newText = await improveDescription(text);
    setResume(prev => ({
        ...prev,
        experiences: prev.experiences.map(e => e.id === id ? { ...e, description: newText } : e)
    }));
  };

  const handleAutoSort = () => {
    const sorted = autoSortResume(resume);
    setResume(sorted as ResumeData);
  };

  const changeLanguage = async (lang: Language) => {
      setUiLang(lang);
      
      // Automatic Translation of Resume Content
      setIsTranslating(true);
      try {
          const translatedData = await translateResumeContent(resume, lang);
          setResume(prev => ({...prev, ...translatedData, language: lang}));
      } catch (e) {
          console.error("Auto translate failed", e);
      } finally {
          setIsTranslating(false);
      }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updatePhotoConfig = (field: string, value: number) => {
    setResume(prev => ({
        ...prev,
        personalInfo: {
            ...prev.personalInfo,
            photoConfig: {
                ...prev.personalInfo.photoConfig,
                [field]: value
            } as any
        }
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResume(prev => ({ ...prev, experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  };
  const addExperience = () => {
    setResume(prev => ({ ...prev, experiences: [...prev.experiences, { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', current: false, description: '' }] }));
  };
  const removeExperience = (id: string) => {
    setResume(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  const updateEducation = (id: string, field: string, value: any) => {
    setResume(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  };
  const addEducation = () => {
    setResume(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', startDate: '', endDate: '', description: '' }] }));
  };
  const removeEducation = (id: string) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const updateSkill = (id: string, field: string, value: any) => {
      setResume(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  };
  const addSkill = () => {
      setResume(prev => ({ ...prev, skills: [...prev.skills, { id: Date.now().toString(), name: '', level: 3 }] }));
  };
  const removeSkill = (id: string) => {
      setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
      setResume(prev => ({ ...prev, languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l) }));
  };
  const addLanguage = () => {
      setResume(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now().toString(), name: '', level: 'B2' }] }));
  };
  const removeLanguage = (id: string) => {
      setResume(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };

  const updateHobby = (index: number, value: string) => {
      const newHobbies = [...resume.hobbies];
      newHobbies[index] = value;
      setResume(prev => ({ ...prev, hobbies: newHobbies }));
  };
  const addHobby = () => {
      setResume(prev => ({ ...prev, hobbies: [...prev.hobbies, ''] }));
  };
  const removeHobby = (index: number) => {
      setResume(prev => ({ ...prev, hobbies: prev.hobbies.filter((_, i) => i !== index) }));
  };


  if (isSelectionMode) {
      return (
          <div className="h-screen bg-slate-950 flex flex-col font-sans text-white overflow-hidden relative">
              <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                  <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Sparkles size={18} fill="white"/></div>
                      {t.title}
                  </div>
                  <div className="relative group">
                        <button className="flex items-center gap-1 text-xs bg-slate-800 px-3 py-1.5 rounded-full text-slate-300 hover:text-white uppercase font-bold border border-slate-700">
                            <Globe size={14} /> {uiLang}
                        </button>
                        <div className="absolute right-0 mt-1 w-24 bg-slate-800 rounded shadow-xl hidden group-hover:block border border-slate-700 z-50">
                            {['fr', 'en', 'ar', 'nl', 'es', 'pt', 'ru'].map(l => (
                                <button key={l} onClick={() => changeLanguage(l as Language)} className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white uppercase">
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                  <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 px-4">
                      <h1 className="text-3xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent pb-2">
                          {t.startTitle}
                      </h1>
                      <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto">{t.startSubtitle}</p>
                  </div>

                  <div className="w-full overflow-x-auto pb-12 px-8 snap-x snap-mandatory scrollbar-hide">
                      <div className="flex gap-8 w-max mx-auto">
                          {templatesList.map(tpl => (
                              <RealTemplateCard key={tpl.id} tpl={tpl} onClick={() => handleTemplateSelect(tpl.id)} />
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-900 font-sans relative flex">
      <div className={`fixed inset-y-0 left-0 h-full bg-slate-950 shadow-2xl z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 flex flex-col w-full md:w-[400px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950 shrink-0">
                 <button onClick={() => setIsSelectionMode(true)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                     <ArrowLeft size={16} /> <span className="inline md:hidden lg:inline">{t.backToGallery}</span>
                 </button>
                 
                 <button 
                    onClick={() => setSidebarOpen(false)} 
                    className="md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-900/50"
                 >
                     <Eye size={14} /> {t.viewPreview}
                 </button>

                 <button onClick={() => setSidebarOpen(false)} className="hidden md:block p-2 text-slate-400 bg-slate-900 rounded-full border border-slate-800">
                     <X size={20} />
                 </button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-900 shrink-0">
                <button onClick={() => setActiveTab('content')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'content' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                    <FileText size={14} /> {t.tabContent}
                </button>
                <button onClick={() => setActiveTab('design')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'design' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                    <Palette size={14} /> {t.tabDesign}
                </button>
                <button onClick={() => setActiveTab('import')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-1.5 ${activeTab === 'import' ? 'border-blue-500 text-blue-400 bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                    <Import size={14} /> {t.tabImport}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 pb-20 scrollbar-hide bg-slate-950 w-full">
                
                {activeTab === 'content' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        <div className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30">
                            <label className="text-xs text-indigo-300 font-bold mb-2 flex items-center gap-2"><Sparkles size={12}/> {t.generate}</label>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 px-3 py-2 rounded text-sm bg-slate-900 text-white border border-indigo-500/50 outline-none w-full min-w-0" placeholder="Ex: Développeur" value={genJobTitle} onChange={(e) => setGenJobTitle(e.target.value)} />
                                <button onClick={handleGenerate} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-500 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded text-white disabled:opacity-50">{isGenerating ? <Sparkles className="animate-spin" size={18}/> : <Sparkles size={18}/>}</button>
                            </div>
                        </div>

                        {/* PERSONAL INFO */}
                        <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('personal')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><User size={16} className="text-blue-500"/> {t.personalInfo}</span>
                                {expandedSections.personal ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>
                            {expandedSections.personal && (
                                <div className="p-4 pt-0 space-y-3 border-t border-slate-800 mt-2">
                                    <div className="flex items-center gap-4 py-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-slate-700 relative group">
                                            {resume.personalInfo.photoUrl ? (
                                                <div className="w-full h-full relative overflow-hidden">
                                                    <img 
                                                        src={resume.personalInfo.photoUrl} 
                                                        className="w-full h-full object-cover transition-transform duration-100 ease-out" 
                                                        style={{ 
                                                            transform: `scale(${resume.personalInfo.photoConfig?.zoom || 1}) translate(${resume.personalInfo.photoConfig?.x || 0}%, ${resume.personalInfo.photoConfig?.y || 0}%)` 
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <User className="text-slate-600" size={24}/>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded border border-slate-700 inline-flex items-center gap-2 transition-colors">
                                                <ImageIcon size={14} /> {t.photo}
                                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                            </label>
                                            
                                            {resume.personalInfo.photoUrl && !isPhotoEditing && (
                                                 <button onClick={() => setIsPhotoEditing(true)} className="text-xs bg-blue-900/50 text-blue-300 px-3 py-1 rounded border border-blue-800 hover:bg-blue-800">
                                                     Régler
                                                 </button>
                                            )}

                                            {resume.personalInfo.photoUrl && (
                                                <button onClick={() => updatePersonalInfo('photoUrl', '')} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                                                    <Trash2 size={12}/> Supprimer
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* PHOTO ADJUSTMENT CONTROLS */}
                                    {resume.personalInfo.photoUrl && isPhotoEditing && (
                                        <div className="p-3 bg-slate-950 rounded border border-slate-700 space-y-3 mb-4 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                                                <span>Recadrage</span>
                                                <button onClick={() => setIsPhotoEditing(false)} className="bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-1 hover:bg-green-500"><Check size={10}/> {t.done}</button>
                                            </div>
                                            
                                            {/* Zoom */}
                                            <div className="flex items-center gap-3">
                                                <ZoomIn size={14} className="text-slate-500"/>
                                                <input 
                                                    type="range" min="1" max="3" step="0.1"
                                                    value={resume.personalInfo.photoConfig?.zoom || 1}
                                                    onChange={(e) => updatePhotoConfig('zoom', parseFloat(e.target.value))}
                                                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                            </div>

                                            {/* X Axis */}
                                            <div className="flex items-center gap-3">
                                                <Move size={14} className="text-slate-500 rotate-90"/>
                                                <input 
                                                    type="range" min="-50" max="50" step="1"
                                                    value={resume.personalInfo.photoConfig?.x || 0}
                                                    onChange={(e) => updatePhotoConfig('x', parseInt(e.target.value))}
                                                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                            </div>

                                            {/* Y Axis */}
                                            <div className="flex items-center gap-3">
                                                <Move size={14} className="text-slate-500"/>
                                                <input 
                                                    type="range" min="-50" max="50" step="1"
                                                    value={resume.personalInfo.photoConfig?.y || 0}
                                                    onChange={(e) => updatePhotoConfig('y', parseInt(e.target.value))}
                                                    className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <InputGroup label="Nom" value={resume.personalInfo.fullName} onChange={(v: string) => updatePersonalInfo('fullName', v)} placeholder="Ex: Jean Dupont" />
                                    <InputGroup label="Titre" value={resume.personalInfo.jobTitle} onChange={(v: string) => updatePersonalInfo('jobTitle', v)} placeholder="Ex: Chef de Projet" />
                                    <InputGroup label="Email" value={resume.personalInfo.email} onChange={(v: string) => updatePersonalInfo('email', v)} />
                                    <InputGroup label="Tél" value={resume.personalInfo.phone} onChange={(v: string) => updatePersonalInfo('phone', v)} />
                                    <InputGroup label="Adresse" value={resume.personalInfo.address} onChange={(v: string) => updatePersonalInfo('address', v)} />
                                    <InputGroup label="Résumé" type="textarea" value={resume.personalInfo.summary} onChange={(v: string) => updatePersonalInfo('summary', v)} />
                                </div>
                            )}
                        </div>

                        {/* EXPERIENCE */}
                        <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('experience')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><FileText size={16} className="text-green-500"/> {t.experience}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleAutoSort(); }} title="Trier chronologiquement" className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-blue-400"><RefreshCw size={14}/></button>
                                    {expandedSections.experience ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                </div>
                            </button>
                            {expandedSections.experience && (
                            <div className="p-4 pt-0 border-t border-slate-800 mt-2">
                                {resume.experiences.map((exp) => (
                                <div key={exp.id} className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-lg relative">
                                    <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-500 bg-slate-900 rounded-full border border-slate-800 p-1"><Trash2 size={14} /></button>
                                    <InputGroup label="Poste" value={exp.title} onChange={(v: string) => updateExperience(exp.id, 'title', v)} />
                                    <InputGroup label="Entreprise" value={exp.company} onChange={(v: string) => updateExperience(exp.id, 'company', v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Début" value={exp.startDate} onChange={(v: string) => updateExperience(exp.id, 'startDate', v)} />
                                        <InputGroup label="Fin" value={exp.endDate} onChange={(v: string) => updateExperience(exp.id, 'endDate', v)} />
                                    </div>
                                    <InputGroup label="Description" type="textarea" value={exp.description} onChange={(v: string) => updateExperience(exp.id, 'description', v)} />
                                    <button onClick={() => handleImproveText(exp.id, exp.description)} className="text-xs bg-indigo-900/50 text-indigo-200 px-3 py-1 rounded flex items-center gap-1 mt-2 w-full justify-center"><Wand2 size={12}/> {t.improve}</button>
                                </div>
                                ))}
                                <button onClick={addExperience} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-500 flex justify-center items-center gap-2 font-bold text-xs uppercase"><Plus size={16} /> {t.addExp}</button>
                            </div>
                            )}
                        </div>

                        {/* EDUCATION */}
                        <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('education')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><GraduationCap size={16} className="text-yellow-500"/> {t.education}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleAutoSort(); }} title="Trier chronologiquement" className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-blue-400"><RefreshCw size={14}/></button>
                                    {expandedSections.education ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                                </div>
                            </button>
                            {expandedSections.education && (
                            <div className="p-4 pt-0 border-t border-slate-800 mt-2">
                                {resume.education.map((edu) => (
                                <div key={edu.id} className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-lg relative">
                                    <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-500 bg-slate-900 rounded-full border border-slate-800 p-1"><Trash2 size={14} /></button>
                                    <InputGroup label="Diplôme" value={edu.degree} onChange={(v: string) => updateEducation(edu.id, 'degree', v)} />
                                    <InputGroup label="École" value={edu.school} onChange={(v: string) => updateEducation(edu.id, 'school', v)} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Début" value={edu.startDate} onChange={(v: string) => updateEducation(edu.id, 'startDate', v)} />
                                        <InputGroup label="Fin" value={edu.endDate} onChange={(v: string) => updateEducation(edu.id, 'endDate', v)} />
                                    </div>
                                </div>
                                ))}
                                <button onClick={addEducation} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-yellow-500 hover:text-yellow-500 flex justify-center items-center gap-2 font-bold text-xs uppercase"><Plus size={16} /> {t.addEdu}</button>
                            </div>
                            )}
                        </div>

                         {/* SKILLS */}
                         <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('skills')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><Hammer size={16} className="text-purple-500"/> {t.skills}</span>
                                {expandedSections.skills ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>
                            {expandedSections.skills && (
                            <div className="p-4 pt-0 border-t border-slate-800 mt-2">
                                {resume.skills.map((skill) => (
                                <div key={skill.id} className="mb-3 flex gap-2 items-center">
                                    <input type="text" className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} placeholder="Ex: React" />
                                    <input type="range" min="1" max="5" value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} className="w-20" />
                                    <button onClick={() => removeSkill(skill.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                ))}
                                <button onClick={addSkill} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-purple-500 hover:text-purple-500 flex justify-center items-center gap-2 font-bold text-xs uppercase"><Plus size={16} /> {t.addSkill}</button>
                            </div>
                            )}
                        </div>

                         {/* LANGUAGES */}
                         <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('languages')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><Languages size={16} className="text-pink-500"/> {t.languages}</span>
                                {expandedSections.languages ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>
                            {expandedSections.languages && (
                            <div className="p-4 pt-0 border-t border-slate-800 mt-2">
                                {resume.languages.map((l) => (
                                <div key={l.id} className="mb-3 flex gap-2 items-center">
                                    <input type="text" className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={l.name} onChange={(e) => updateLanguage(l.id, 'name', e.target.value)} placeholder="Langue" />
                                    <select className="bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white w-28" value={l.level} onChange={(e) => updateLanguage(l.id, 'level', e.target.value)}>
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                        <option value="Native">Native</option>
                                        <option value="Fluent">Fluent</option>
                                    </select>
                                    <button onClick={() => removeLanguage(l.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                ))}
                                <button onClick={addLanguage} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-pink-500 hover:text-pink-500 flex justify-center items-center gap-2 font-bold text-xs uppercase"><Plus size={16} /> {t.addLang}</button>
                            </div>
                            )}
                        </div>

                        {/* HOBBIES */}
                        <div className="border border-slate-800 rounded-lg bg-slate-900 overflow-hidden">
                            <button onClick={() => toggleSection('hobbies')} className="w-full flex justify-between items-center p-4 bg-slate-900 hover:bg-slate-800 transition-colors">
                                <span className="font-bold text-sm text-slate-200 flex items-center gap-2"><Heart size={16} className="text-red-500"/> {t.hobbies}</span>
                                {expandedSections.hobbies ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                            </button>
                            {expandedSections.hobbies && (
                            <div className="p-4 pt-0 border-t border-slate-800 mt-2">
                                {resume.hobbies.map((h, i) => (
                                <div key={i} className="mb-3 flex gap-2 items-center">
                                    <input type="text" className="flex-1 bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={h} onChange={(e) => updateHobby(i, e.target.value)} placeholder="Ex: Tennis" />
                                    <button onClick={() => removeHobby(i)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button>
                                </div>
                                ))}
                                <button onClick={addHobby} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-red-500 hover:text-red-500 flex justify-center items-center gap-2 font-bold text-xs uppercase"><Plus size={16} /> {t.addHobby}</button>
                            </div>
                            )}
                        </div>

                    </div>
                )}

                {activeTab === 'design' && (
                  <div className="animate-in fade-in duration-300">
                     <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wider">{t.selectTemplate}</label>
                        <div className="grid grid-cols-2 gap-3">
                            {templatesList.map(tpl => (
                                <button 
                                    key={tpl.id}
                                    onClick={() => setResume(prev => ({ ...prev, theme: { ...prev.theme, template: tpl.id } }))}
                                    className={`p-3 rounded-lg border-2 text-left transition-all ${resume.theme.template === tpl.id ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}
                                >
                                    <span className="font-bold text-sm block">{tpl.name}</span>
                                </button>
                            ))}
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wider">{t.colors}</label>
                        <div className="flex flex-wrap gap-3">
                            {colorsList.map(c => (
                                <button 
                                    key={c}
                                    onClick={() => setResume(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: c } }))}
                                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${resume.theme.primaryColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : ''}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {resume.theme.primaryColor === c && <CheckCircle2 size={16} className="text-white drop-shadow-md"/>}
                                </button>
                            ))}
                        </div>
                     </div>

                     <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-3 block tracking-wider">{t.fonts}</label>
                        <div className="space-y-2">
                            {fontOptions.map(f => (
                                <button 
                                    key={f.value}
                                    onClick={() => setResume(prev => ({ ...prev, theme: { ...prev.theme, fontFamily: f.value } }))}
                                    className={`w-full p-3 rounded-lg border text-left transition-all ${resume.theme.fontFamily === f.value ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'}`}
                                    style={{ fontFamily: f.value }}
                                >
                                    <span className="text-sm">{f.name}</span>
                                </button>
                            ))}
                        </div>
                     </div>
                  </div>
                )}

                {activeTab === 'import' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                            <h3 className="text-white font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wide"><MessageSquare size={16} className="text-green-400"/> {t.importTitle}</h3>
                            
                            <div className="flex gap-2 mb-4">
                                <button onClick={() => setImportMode('file')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${importMode === 'file' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-700 hover:bg-slate-900'}`}>
                                    {t.fileMode}
                                </button>
                                <button onClick={() => setImportMode('text')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg border transition-all ${importMode === 'text' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-700 hover:bg-slate-900'}`}>
                                    {t.textMode}
                                </button>
                            </div>

                            {importMode === 'file' ? (
                                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-950/50 hover:bg-slate-950 hover:border-blue-500 transition-colors relative">
                                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleResumeFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isImporting} />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
                                            {isImporting ? <Sparkles className="animate-spin" size={24}/> : <Upload size={24} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">{isImporting ? t.analyzing : t.uploadTitle}</p>
                                            <p className="text-xs text-slate-500">{t.uploadDesc}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <textarea className="w-full h-64 p-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-4" placeholder={t.importDesc} value={importText} onChange={(e) => setImportText(e.target.value)} />
                                    <button onClick={handleImportText} disabled={isImporting || !importText} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold text-sm disabled:opacity-50 transition-colors flex justify-center items-center gap-2">
                                        {isImporting ? <Sparkles className="animate-spin" size={18}/> : <Import size={18}/>}
                                        {isImporting ? t.analyzing : t.analyzeBtn}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {!sidebarOpen && (
         <button onClick={() => setSidebarOpen(true)} className="absolute top-6 left-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-500 transition-transform hover:scale-110">
             <Menu size={24} />
         </button>
      )}

      <div className={`bg-slate-800 h-full flex flex-col transition-all duration-300 relative ${sidebarOpen ? 'md:ml-[400px]' : 'ml-0'} w-full`}>
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none"></div>
        <div className="w-full max-w-4xl mt-4 mb-2 flex justify-between items-center z-10 px-6 shrink-0 mx-auto">
            <div className="flex items-center gap-3">
                {isTranslating && (
                    <span className="text-blue-400 flex items-center gap-2 text-sm font-bold bg-blue-900/50 px-3 py-1 rounded-full animate-pulse border border-blue-800">
                        <Sparkles size={14}/> {t.translating}
                    </span>
                )}
            </div>
            
            <div className="flex gap-2">
                 <div className="relative group">
                    <button className="flex items-center gap-2 bg-slate-900/80 backdrop-blur px-3 py-2 rounded-full border border-slate-700 text-slate-300 text-xs font-bold hover:text-white hover:border-slate-500 transition-all">
                        <Globe size={14} /> {uiLang}
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 rounded-lg shadow-xl hidden group-hover:block border border-slate-700 z-50 overflow-hidden">
                        {['fr', 'en', 'ar', 'nl', 'es', 'pt', 'ru'].map(l => (
                            <button key={l} onClick={() => changeLanguage(l as Language)} className="block w-full text-left px-4 py-3 text-xs text-slate-300 hover:bg-blue-600 hover:text-white uppercase font-bold">
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-900/50 flex items-center gap-2 text-xs font-bold transition-all hover:-translate-y-0.5">
                <Printer size={14} /> {t.download}
                </button>
            </div>
        </div>

        <div ref={previewContainerRef} className="flex-1 w-full overflow-y-auto overflow-x-hidden flex justify-center p-8 bg-slate-800 relative">
             <div className="transition-transform duration-300 ease-out origin-top shadow-2xl" style={{ transform: `scale(${previewScale})`, width: '210mm', minHeight: '297mm', height: 'fit-content' }}>
                <ResumePreview data={resume} />
             </div>
        </div>
      </div>
    </div>
  );
}
