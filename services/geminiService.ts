
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, Experience, Education } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- DATE SORTING UTILS ---

const parseDateValue = (dateStr: string): number => {
  if (!dateStr) return -1;
  const lower = dateStr.toLowerCase();
  if (lower.includes('present') || lower.includes('présent') || lower.includes('huden') || lower.includes('current') || lower.includes('aujourd') || lower.includes('now')) {
    return Infinity; // Future/Now
  }

  // Extract year (4 digits)
  const yearMatch = dateStr.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : 0;

  // Try to detect month roughly
  let month = 0;
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const monthsFr = ['jan', 'fev', 'mar', 'avr', 'mai', 'jui', 'jui', 'aou', 'sep', 'oct', 'nov', 'dec'];
  
  for (let i = 0; i < 12; i++) {
    if (lower.includes(months[i]) || lower.includes(monthsFr[i]) || lower.includes(`0${i+1}`.slice(-2))) {
      month = i;
      break;
    }
  }

  return year * 12 + month;
};

const sortExperiences = (exps: Experience[]): Experience[] => {
  return [...exps].sort((a, b) => {
    const valA = parseDateValue(a.endDate || a.startDate);
    const valB = parseDateValue(b.endDate || b.startDate);
    return valB - valA; // Descending (Newest first)
  });
};

const sortEducation = (edu: Education[]): Education[] => {
  return [...edu].sort((a, b) => {
    const valA = parseDateValue(a.endDate || a.startDate);
    const valB = parseDateValue(b.endDate || b.startDate);
    return valB - valA;
  });
};

export const autoSortResume = (data: Partial<ResumeData>): Partial<ResumeData> => {
  return {
    ...data,
    experiences: data.experiences ? sortExperiences(data.experiences) : [],
    education: data.education ? sortEducation(data.education) : []
  };
};

// --- API CALLS ---

export const generateResumeContent = async (jobTitle: string, currentData: ResumeData): Promise<Partial<ResumeData>> => {
  try {
    const model = 'gemini-2.5-flash';
    const lang = currentData.language || 'fr';
    
    const prompt = `
      Tu es un expert CV. Crée un contenu complet et détaillé pour un poste de "${jobTitle}" en langue "${lang}".
      Ne sois pas paresseux. Remplis les expériences avec des descriptions denses et professionnelles.
      
      Génère :
      1. Résumé (summary): Accrocheur, 3-4 phrases.
      2. 3 expériences (experiences): Rôles pertinents, descriptions avec résultats chiffrés.
      3. 2 formations (education): Diplômes réalistes.
      4. 6 compétences (skills): Mix techniques et soft skills, niveaux variés (3-5).
      5. 2 langues (languages).
      6. 3 centres d'intérêt (hobbies).
      
      Retourne du JSON strict conforme au schéma.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            experiences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  degree: { type: Type.STRING },
                  school: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.INTEGER }
                }
              }
            },
            languages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING }
                }
              }
            },
            hobbies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (!response.text) throw new Error("Aucune réponse de l'IA");
    const generated = JSON.parse(response.text);

    const unsortedData = {
      personalInfo: {
        ...currentData.personalInfo,
        jobTitle: jobTitle,
        summary: generated.summary
      },
      experiences: generated.experiences?.map((exp: any, index: number) => ({
        ...exp,
        id: `gen-exp-${Date.now()}-${index}`,
        current: false
      })) || [],
      education: generated.education?.map((edu: any, index: number) => ({
        ...edu,
        id: `gen-edu-${Date.now()}-${index}`
      })) || [],
      skills: generated.skills?.map((skill: any, index: number) => ({
        id: `gen-skill-${Date.now()}-${index}`,
        name: skill.name,
        level: skill.level || 4
      })) || [],
      languages: generated.languages?.map((l: any, index: number) => ({
        id: `gen-lang-${Date.now()}-${index}`,
        name: l.name,
        level: l.level
      })) || [],
      hobbies: generated.hobbies || []
    };

    return autoSortResume(unsortedData);

  } catch (error) {
    console.error("Erreur de génération IA:", error);
    throw error;
  }
};

const COMMON_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      personalInfo: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          address: { type: Type.STRING },
          linkedin: { type: Type.STRING },
          website: { type: Type.STRING },
          summary: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
        }
      },
      experiences: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            company: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            degree: { type: Type.STRING },
            school: { type: Type.STRING },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        }
      },
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            level: { type: Type.INTEGER }
          }
        }
      },
      languages: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                level: { type: Type.STRING }
            }
        }
      },
      hobbies: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
      }
    }
};

const processExtractedData = (data: any): Partial<ResumeData> => {
     // Add IDs and defaults to ensure the UI renders them
     if(data.experiences) data.experiences = data.experiences.map((e:any, i:number) => ({ ...e, id: `imp-exp-${i}`, current: false }));
     if(data.education) data.education = data.education.map((e:any, i:number) => ({ ...e, id: `imp-edu-${i}` }));
     if(data.skills) data.skills = data.skills.map((e:any, i:number) => ({ ...e, id: `imp-skill-${i}`, level: e.level || 3 }));
     if(data.languages) data.languages = data.languages.map((e:any, i:number) => ({ ...e, id: `imp-lang-${i}`, level: e.level || 'B2' }));
     
     return autoSortResume(data);
};

export const parseResumeFromText = async (text: string): Promise<Partial<ResumeData>> => {
  try {
    const prompt = `
      EXTREMELY IMPORTANT: You are a data extraction engine. 
      Your goal is to extract EVERY SINGLE detail from the provided Resume Text into the JSON structure.
      DO NOT SUMMARIZE. DO NOT SKIP EXPERIENCES. 
      
      Resume Text to Analyze:
      """
      ${text.substring(0, 15000)}
      """
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: COMMON_SCHEMA
      }
    });

    if (!response.text) throw new Error("Erreur d'analyse");
    const data = JSON.parse(response.text);
    return processExtractedData(data);
  } catch (error) {
    console.error("Import error:", error);
    throw error;
  }
}

export const parseResumeFromFile = async (base64Data: string, mimeType: string): Promise<Partial<ResumeData>> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: "Extract ALL data from this resume image/pdf. Be exhaustive. Do not summarize. Return strict JSON." }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: COMMON_SCHEMA
            }
        });

        if (!response.text) throw new Error("Erreur d'analyse fichier");
        const data = JSON.parse(response.text);
        return processExtractedData(data);
    } catch (error) {
        console.error("File import error:", error);
        throw error;
    }
};

export const improveDescription = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Réécris cette expérience professionnelle pour un CV afin de la rendre plus percutante, orientée résultats et professionnelle. Garde le même sens, mais améliore le style: "${text}"`,
        });
        return response.text || text;
      } catch (error) {
        return text;
      }
};

export const translateResumeContent = async (data: ResumeData, targetLang: string): Promise<Partial<ResumeData>> => {
  try {
    const prompt = `
      You are a professional translator. Translate the content of this resume into ${targetLang}.
      Translate: job titles, summaries, experience descriptions, education degrees, skill names, and hobbies.
      Adapt tone to be culturally appropriate for a CV in ${targetLang}.
      
      Source Data:
      ${JSON.stringify({
        personalInfo: { jobTitle: data.personalInfo.jobTitle, summary: data.personalInfo.summary },
        experiences: data.experiences.map(e => ({ id: e.id, title: e.title, description: e.description })),
        education: data.education.map(e => ({ id: e.id, degree: e.degree, description: e.description })),
        skills: data.skills.map(s => ({ id: s.id, name: s.name })),
        hobbies: data.hobbies
      })}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             personalInfo: {
                type: Type.OBJECT,
                properties: {
                  jobTitle: { type: Type.STRING },
                  summary: { type: Type.STRING }
                }
             },
             experiences: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                   }
                }
             },
             education: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      id: { type: Type.STRING },
                      degree: { type: Type.STRING },
                      description: { type: Type.STRING }
                   }
                }
             },
             skills: {
                type: Type.ARRAY,
                items: {
                   type: Type.OBJECT,
                   properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING }
                   }
                }
             },
             hobbies: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
             }
          }
        }
      }
    });

    if(!response.text) return {};
    const translated = JSON.parse(response.text);
    
    // Merge translated data back into original structure
    const newData: Partial<ResumeData> = {
        personalInfo: { ...data.personalInfo, ...translated.personalInfo },
        hobbies: translated.hobbies || data.hobbies,
        experiences: data.experiences.map(exp => {
            const tExp = translated.experiences?.find((t:any) => t.id === exp.id);
            return tExp ? { ...exp, title: tExp.title, description: tExp.description } : exp;
        }),
        education: data.education.map(edu => {
            const tEdu = translated.education?.find((t:any) => t.id === edu.id);
            return tEdu ? { ...edu, degree: tEdu.degree, description: tEdu.description } : edu;
        }),
        skills: data.skills.map(skill => {
            const tSkill = translated.skills?.find((t:any) => t.id === skill.id);
            return tSkill ? { ...skill, name: tSkill.name } : skill;
        }),
        language: targetLang as any
    };
    
    return newData;

  } catch (e) {
      console.error("Translation error", e);
      return {};
  }
};
