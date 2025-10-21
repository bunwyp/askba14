import React, { useState, useMemo, useEffect } from "react";
import { Calculator, Plus, Trash2, X, Moon, Sun } from "lucide-react";

/**
 * GPA Calculator — Apple × Swiss blend
 * - 4.0 / 4.3 scale switcher
 * - Course entry with grade & credits
 * - Live GPA calculation with circular visualization
 * - Smooth motion graphics & transitions
 * - Dark mode support
 * - EN/粵 bilingual support
 */

const TRANSLATIONS = {
  EN: {
    title: "GPA Calculator",
    subtitle: "Calculate and track your academic performance",
    scale: "Scale",
    addCourse: "Add Course",
    courseName: "Course name...",
    grade: "Grade",
    credits: "Credits",
    targetGPA: "Target GPA",
    totalCreditsRequired: "Total Credits Required",
    completedCredits: "Completed Credits",
    remainingCredits: "Remaining Credits",
    targetAnalysis: "Target GPA Analysis",
    toAchieve: "To achieve",
    youNeed: "you need",
    inRemaining: "in remaining",
    possible: "Possible",
    impossible: "Impossible",
    wouldNeed: "would need",
    whichIsImpossible: "which is impossible",
    noCourses: "No courses added yet",
    startAdding: "Add courses to calculate your GPA"
  },
  粵: {
    title: "GPA計算器",
    subtitle: "計算同追蹤你嘅學業成績",
    scale: "分數級別",
    addCourse: "新增科目",
    courseName: "科目名稱...",
    grade: "成績",
    credits: "學分",
    targetGPA: "目標GPA",
    totalCreditsRequired: "總學分要求",
    completedCredits: "已完成學分",
    remainingCredits: "剩餘學分",
    targetAnalysis: "目標GPA分析",
    toAchieve: "要達到",
    youNeed: "你需要",
    inRemaining: "喺剩餘嘅",
    possible: "可能",
    impossible: "唔可能",
    wouldNeed: "需要",
    whichIsImpossible: "係唔可能嘅",
    noCourses: "未有科目",
    startAdding: "新增科目嚟計算你嘅GPA"
  }
} as const;

type Course = {
  id: string;
  name: string;
  grade: string;
  credits: number;
};

type GPAScale = "4.0" | "4.3";

const GRADE_VALUES_4_0: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

const GRADE_VALUES_4_3: Record<string, number> = {
  "A+": 4.3, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

const GRADES_4_0 = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];
const GRADES_4_3 = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"];

// Circular GPA Visualization
function GPACircle({ gpa, scale, theme }: { gpa: number; scale: GPAScale; theme: string }) {
  const maxGPA = scale === "4.0" ? 4.0 : 4.3;
  const percentage = (gpa / maxGPA) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Color based on GPA
  const getColor = () => {
    if (gpa >= maxGPA * 0.9) return "#30D158"; // Green
    if (gpa >= maxGPA * 0.75) return "#0A84FF"; // Blue
    if (gpa >= maxGPA * 0.6) return "#FF9F0A"; // Orange
    return "#FF375F"; // Pink/Red
  };

  const isDark = theme === "dark" || (theme === "system" && document.documentElement.classList.contains("dark"));

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="240" height="240" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}
          strokeWidth="16"
        />
        {/* Progress circle */}
        <circle
          cx="120"
          cy="120"
          r="90"
          fill="none"
          stroke={getColor()}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease",
          }}
        />
      </svg>
      
      {/* GPA value in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold tracking-tight text-[#1D1D1F] dark:text-white transition-all duration-300">
          {gpa.toFixed(2)}
        </div>
        <div className="text-sm font-medium text-[#86868B] dark:text-white/60 mt-1">
          / {maxGPA.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

// Course Row Component
function CourseRow({
  course,
  scale,
  onUpdate,
  onDelete,
  t,
}: {
  course: Course;
  scale: GPAScale;
  onUpdate: (id: string, updates: Partial<Course>) => void;
  onDelete: (id: string) => void;
  t: any;
}) {
  const grades = scale === "4.0" ? GRADES_4_0 : GRADES_4_3;

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-black/[0.06] dark:border-white/10 transition-all duration-200 hover:border-black/10 dark:hover:border-white/15 animate-slideIn">
      {/* Course Name */}
      <input
        type="text"
        value={course.name}
        onChange={(e) => onUpdate(course.id, { name: e.target.value })}
        placeholder={t.courseName}
        className="px-4 py-2.5 bg-transparent border-none outline-none text-[15px] text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 focus:ring-0"
      />

      {/* Grade Selector */}
      <select
        value={course.grade}
        onChange={(e) => onUpdate(course.id, { grade: e.target.value })}
        className="px-4 py-2.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border-none rounded-lg text-[15px] font-medium text-[#1D1D1F] dark:text-white outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 cursor-pointer transition-all duration-150 hover:bg-[#E8E8ED] dark:hover:bg-[#3A3A3C]"
      >
        <option value="">{t.grade}</option>
        {grades.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      {/* Credits Input */}
      <input
        type="number"
        value={course.credits || ""}
        onChange={(e) => onUpdate(course.id, { credits: parseFloat(e.target.value) || 0 })}
        placeholder={t.credits}
        min="0"
        max="10"
        step="0.5"
        className="w-24 px-4 py-2.5 bg-[#F5F5F7] dark:bg-[#2C2C2E] border-none rounded-lg text-[15px] font-medium text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 transition-all duration-150"
      />

      {/* Delete Button */}
      <button
        onClick={() => onDelete(course.id)}
        className="p-2.5 text-[#FF375F] hover:bg-[#FF375F]/10 dark:hover:bg-[#FF375F]/20 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF375F]/30"
        aria-label="Delete course"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// Main Component
export default function GPACalculator({ theme, lang: propLang, onClose }: { theme: string; lang: string; onClose: () => void }) {
  // Use language from prop
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  // Load saved data from localStorage
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem('gpa_calculator_data');
      if (saved) {
        const data = JSON.parse(saved);
        return {
          scale: data.scale || "4.0",
          courses: data.courses || [
            { id: "1", name: "Course 1", grade: "", credits: 3 },
            { id: "2", name: "Course 2", grade: "", credits: 3 },
            { id: "3", name: "Course 3", grade: "", credits: 3 },
            { id: "4", name: "Course 4", grade: "", credits: 3 },
            { id: "5", name: "Course 5", grade: "", credits: 3 },
            { id: "6", name: "Course 6", grade: "", credits: 3 },
          ],
          totalCreditsRequired: data.totalCreditsRequired || 120,
          targetGPA: data.targetGPA || ""
        };
      }
    } catch (error) {
      console.error('Failed to load GPA data:', error);
    }
    return {
      scale: "4.0" as GPAScale,
      courses: [
        { id: "1", name: "Course 1", grade: "", credits: 3 },
        { id: "2", name: "Course 2", grade: "", credits: 3 },
        { id: "3", name: "Course 3", grade: "", credits: 3 },
        { id: "4", name: "Course 4", grade: "", credits: 3 },
        { id: "5", name: "Course 5", grade: "", credits: 3 },
        { id: "6", name: "Course 6", grade: "", credits: 3 },
      ],
      totalCreditsRequired: 120,
      targetGPA: ""
    };
  };

  const savedData = loadSavedData();
  const [scale, setScale] = useState<GPAScale>(savedData.scale);
  const [isClosing, setIsClosing] = useState(false);
  const [courses, setCourses] = useState<Course[]>(savedData.courses);
  const [totalCreditsRequired, setTotalCreditsRequired] = useState(savedData.totalCreditsRequired);
  const [targetGPA, setTargetGPA] = useState(savedData.targetGPA);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('gpa_calculator_data', JSON.stringify({
        scale,
        courses,
        totalCreditsRequired,
        targetGPA
      }));
    } catch (error) {
      console.error('Failed to save GPA data:', error);
    }
  }, [scale, courses, totalCreditsRequired, targetGPA]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  const gpa = useMemo(() => {
    const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits > 0) {
        totalPoints += gradeValues[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [courses, scale]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: "", grade: "", credits: 0 }]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const completedCredits = courses.reduce((sum, c) => (c.grade ? sum + (c.credits || 0) : sum), 0);
  const remainingCredits = totalCreditsRequired - completedCredits;

  const targetGPAAnalysis = useMemo(() => {
    if (!targetGPA || isNaN(parseFloat(targetGPA))) return null;
    
    const target = parseFloat(targetGPA);
    const maxGPA = scale === "4.0" ? 4.0 : 4.3;
    
    if (target > maxGPA) return { possible: false, message: `Target exceeds maximum GPA of ${maxGPA.toFixed(1)}` };
    
    const gradeValues = scale === "4.0" ? GRADE_VALUES_4_0 : GRADE_VALUES_4_3;
    let currentTotalPoints = 0;
    let currentCredits = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits > 0) {
        currentTotalPoints += gradeValues[course.grade] * course.credits;
        currentCredits += course.credits;
      }
    });

    const remainingCreditsNeeded = totalCreditsRequired - currentCredits;
    if (remainingCreditsNeeded <= 0) {
      return { 
        possible: gpa >= target, 
        message: gpa >= target ? "Target achieved!" : "Target not achievable with current grades",
        requiredGPA: null
      };
    }

    const requiredTotalPoints = target * totalCreditsRequired;
    const requiredRemainingPoints = requiredTotalPoints - currentTotalPoints;
    const requiredGPAForRemaining = requiredRemainingPoints / remainingCreditsNeeded;

    if (requiredGPAForRemaining > maxGPA) {
      return { 
        possible: false, 
        message: `Impossible - would need ${requiredGPAForRemaining.toFixed(2)} GPA in remaining courses`,
        requiredGPA: requiredGPAForRemaining
      };
    }

    if (requiredGPAForRemaining < 0) {
      return { 
        possible: true, 
        message: "Target already exceeded!",
        requiredGPA: 0
      };
    }

    return { 
      possible: true, 
      message: `Need ${requiredGPAForRemaining.toFixed(2)} GPA in remaining ${remainingCreditsNeeded.toFixed(0)} credits`,
      requiredGPA: requiredGPAForRemaining
    };
  }, [targetGPA, scale, courses, gpa, totalCreditsRequired]);

  return (
    <div 
      className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-[#0B0B0D] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${
          isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-[#0A84FF]/10 dark:bg-[#0A84FF]/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <Calculator size={20} className="text-[#0A84FF] sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white truncate">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] dark:text-white/60 mt-0.5 truncate hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all duration-150 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} className="text-[#86868B] dark:text-white/60 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          {/* GPA Visualization & Scale Selector */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <GPACircle gpa={gpa} scale={scale} theme={theme} />

            {/* Scale Toggle */}
            <div className="inline-flex items-center gap-1 p-1 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-lg sm:rounded-xl">
              <button
                onClick={() => setScale("4.0")}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-[15px] font-semibold transition-all duration-200 ${
                  scale === "4.0"
                    ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-sm"
                    : "text-[#86868B] dark:text-white/60 hover:text-[#1D1D1F] dark:hover:text-white"
                }`}
              >
                {t.scale} 4.0
              </button>
              <button
                onClick={() => setScale("4.3")}
                className={`px-6 py-2.5 rounded-lg text-[15px] font-semibold transition-all duration-200 ${
                  scale === "4.3"
                    ? "bg-white dark:bg-[#2C2C2E] text-[#1D1D1F] dark:text-white shadow-sm"
                    : "text-[#86868B] dark:text-white/60 hover:text-[#1D1D1F] dark:hover:text-white"
                }`}
              >
                {t.scale} 4.3
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#1D1D1F] dark:text-white">
                  {courses.filter((c) => c.grade).length}
                </div>
                <div className="text-sm text-[#86868B] dark:text-white/60 mt-1">Completed</div>
              </div>
              <div className="w-px h-12 bg-black/10 dark:bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-[#1D1D1F] dark:text-white">
                  {completedCredits.toFixed(0)}
                </div>
                <div className="text-sm text-[#86868B] dark:text-white/60 mt-1">Credits Taken</div>
              </div>
              <div className="w-px h-12 bg-black/10 dark:bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-[#1D1D1F] dark:text-white">
                  {remainingCredits.toFixed(0)}
                </div>
                <div className="text-sm text-[#86868B] dark:text-white/60 mt-1">Remaining</div>
              </div>
            </div>
          </div>

          {/* Target GPA & Credits Tracker */}
          <div className="mb-8 p-6 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.06] dark:border-white/10">
            <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-white mb-4">{t.targetAnalysis}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#86868B] dark:text-white/60 mb-2">
                  {t.totalCreditsRequired}
                </label>
                <input
                  type="number"
                  value={totalCreditsRequired}
                  onChange={(e) => setTotalCreditsRequired(parseFloat(e.target.value) || 120)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-lg text-[15px] font-medium text-[#1D1D1F] dark:text-white outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 transition-all duration-150"
                  min="0"
                  step="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#86868B] dark:text-white/60 mb-2">
                  {t.targetGPA}
                </label>
                <input
                  type="number"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  placeholder={`0.00 - ${scale === "4.0" ? "4.00" : "4.30"}`}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-lg text-[15px] font-medium text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30 transition-all duration-150"
                  min="0"
                  max={scale === "4.0" ? "4.0" : "4.3"}
                  step="0.01"
                />
              </div>
            </div>

            {targetGPAAnalysis && (
              <div className={`p-4 rounded-xl ${
                targetGPAAnalysis.possible 
                  ? 'bg-[#30D158]/10 dark:bg-[#30D158]/20 border border-[#30D158]/20 dark:border-[#30D158]/30' 
                  : 'bg-[#FF375F]/10 dark:bg-[#FF375F]/20 border border-[#FF375F]/20 dark:border-[#FF375F]/30'
              } animate-slideIn`}>
                <div className={`text-sm font-semibold ${
                  targetGPAAnalysis.possible ? 'text-[#30D158]' : 'text-[#FF375F]'
                }`}>
                  {targetGPAAnalysis.possible ? '✓ Possible' : '✗ Impossible'}
                </div>
                <div className="text-[15px] text-[#1D1D1F] dark:text-white mt-1">
                  {targetGPAAnalysis.message}
                </div>
              </div>
            )}
          </div>

          {/* Courses List */}
          <div className="space-y-3 mb-6">
            {courses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                scale={scale}
                onUpdate={updateCourse}
                onDelete={deleteCourse}
                t={t}
              />
            ))}
          </div>

          {/* Add Course Button */}
          <button
            onClick={addCourse}
            className="w-full py-4 px-6 bg-[#F5F5F7] dark:bg-[#1C1C1E] hover:bg-[#E8E8ED] dark:hover:bg-[#2C2C2E] border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl text-[15px] font-semibold text-[#1D1D1F] dark:text-white transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
          >
            <Plus size={20} />
            {t.addCourse}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes scaleOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0.95); opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-fadeOut {
          animation: fadeOut 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-scaleOut {
          animation: scaleOut 0.2s cubic-bezier(0.4, 0, 1, 1);
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
