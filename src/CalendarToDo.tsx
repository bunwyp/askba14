import React, { useState, useMemo, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Check, Trash2, X, ChevronLeft, ChevronRight, List, Filter } from "lucide-react";

/**
 * Calendar + To-Do — Apple × Swiss blend (Enhanced)
 * - Interactive monthly calendar view
 * - Task management with categories/labels
 * - Color-coded categories
 * - All tasks view + filtered by date view
 * - Visual task indicators on calendar
 * - Dark mode support
 * - Smooth motion graphics
 * - EN/粵 bilingual support
 */

const TRANSLATIONS = {
  EN: {
    title: "Calendar + To-Do",
    subtitle: "Manage your schedule and tasks",
    allTasks: "All Tasks",
    pending: "pending",
    completed: "completed",
    addTask: "Add a new task...",
    add: "Add",
    noTasks: "No tasks for this day",
    noTasksYet: "No tasks yet",
    getStarted: "Add a task to get started",
    createFirst: "Create your first task",
    newCategory: "New"
  },
  粵: {
    title: "行事曆＋待辦",
    subtitle: "管理你嘅日程同任務",
    allTasks: "所有任務",
    pending: "待辦",
    completed: "完成",
    addTask: "新增任務...",
    add: "新增",
    noTasks: "今日冇任務",
    noTasksYet: "未有任務",
    getStarted: "新增任務開始",
    createFirst: "建立你嘅第一個任務",
    newCategory: "新增"
  }
} as const;

type Category = {
  id: string;
  name: string;
  color: string;
};

type Task = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  categoryId?: string;
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "work", name: "Work", color: "#0A84FF" },
  { id: "personal", name: "Personal", color: "#30D158" },
  { id: "study", name: "Study", color: "#FF9F0A" },
  { id: "urgent", name: "Urgent", color: "#FF375F" },
  { id: "other", name: "Other", color: "#5856D6" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Calendar Component
function Calendar({ 
  currentDate, 
  selectedDate, 
  onSelectDate,
  tasks 
}: { 
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: Task[];
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const calendar: (number | null)[] = [];
  
  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendar.push(-(daysInPrevMonth - i));
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push(i);
  }
  
  // Next month days to fill grid
  const remainingCells = 42 - calendar.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendar.push(-(100 + i));
  }

  const getTasksForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day > 0 && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return day > 0 && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  return (
    <div className="space-y-4">
      {/* Days header */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-[#86868B] dark:text-white/60 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendar.map((day, idx) => {
          if (day === null) return <div key={idx} />;
          
          const isCurrentMonth = day > 0;
          const displayDay = Math.abs(day) > 100 ? Math.abs(day) - 100 : Math.abs(day);
          const dayTasks = isCurrentMonth ? getTasksForDate(day) : [];
          const hasPending = dayTasks.some(t => !t.completed);
          const hasCompleted = dayTasks.some(t => t.completed);

          return (
            <button
              key={idx}
              onClick={() => isCurrentMonth && onSelectDate(new Date(year, month, day))}
              disabled={!isCurrentMonth}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all duration-150 relative
                ${!isCurrentMonth ? 'text-[#86868B]/40 dark:text-white/20 cursor-default' : ''}
                ${isCurrentMonth && !isToday(day) && !isSelected(day) ? 'text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5' : ''}
                ${isToday(day) && !isSelected(day) ? 'text-[#FF9F0A] font-bold' : ''}
                ${isSelected(day) ? 'bg-[#0A84FF] text-white font-bold' : ''}
              `}
            >
              {displayDay}
              {isCurrentMonth && dayTasks.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasPending && <div className="w-1 h-1 rounded-full bg-[#FF375F]" />}
                  {hasCompleted && <div className="w-1 h-1 rounded-full bg-[#30D158]" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Task Item Component
function TaskItem({ 
  task, 
  onToggle, 
  onDelete,
  category,
  showDate = false
}: { 
  task: Task; 
  onToggle: () => void; 
  onDelete: () => void;
  category?: Category;
  showDate?: boolean;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="group flex items-start gap-3 p-3 bg-white dark:bg-[#1C1C1E] rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E] transition-all duration-150 animate-slideIn">
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-5 h-5 rounded mt-0.5 border-2 flex items-center justify-center transition-all duration-150"
        style={{
          borderColor: task.completed ? (category?.color || '#86868B') : '#D1D1D6',
          backgroundColor: task.completed ? (category?.color || '#86868B') : 'transparent'
        }}
      >
        {task.completed && <Check size={14} className="text-white" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] ${task.completed ? 'line-through text-[#86868B] dark:text-white/40' : 'text-[#1D1D1F] dark:text-white'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {category && (
            <span 
              className="inline-block px-2 py-0.5 text-xs font-medium rounded"
              style={{ 
                backgroundColor: `${category.color}20`,
                color: category.color 
              }}
            >
              {category.name}
            </span>
          )}
          {showDate && (
            <span className="text-xs text-[#86868B] dark:text-white/60">
              {formatDate(task.date)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onDelete}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1.5 text-[#FF375F] hover:bg-[#FF375F]/10 dark:hover:bg-[#FF375F]/20 rounded transition-all duration-150"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// Main Component
export default function CalendarToDo({ theme, lang: propLang, onClose }: { theme: string; lang: string; onClose: () => void }) {
  // Use language from prop
  const lang = (propLang === "粵" ? "粵" : "EN") as "EN" | "粵";
  const t = TRANSLATIONS[lang];

  // Load tasks and categories from localStorage
  const loadTasks = (): Task[] => {
    try {
      const saved = localStorage.getItem('calendar_tasks');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
    return [];
  };

  const loadCategories = (): Category[] => {
    try {
      const saved = localStorage.getItem('calendar_categories');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
    return DEFAULT_CATEGORIES;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORIES[0].id);
  const [isClosing, setIsClosing] = useState(false);
  const [viewMode, setViewMode] = useState<'date' | 'all'>('date');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#0A84FF");

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('calendar_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, [tasks]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('calendar_categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  }, [categories]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        date: dateStr,
        completed: false,
        categoryId: selectedCategory
      }]);
      setNewTaskTitle("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCat: Category = {
        id: Date.now().toString(),
        name: newCategoryName.trim(),
        color: newCategoryColor
      };
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat.id);
      setNewCategoryName("");
      setNewCategoryColor("#0A84FF");
      setIsAddingCategory(false);
    }
  };

  const deleteCategory = (id: string) => {
    // Don't allow deleting if it's the last category
    if (categories.length <= 1) return;
    
    // Remove category
    setCategories(categories.filter(c => c.id !== id));
    
    // Update tasks that used this category
    setTasks(tasks.map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t));
    
    // Update selected category if needed
    if (selectedCategory === id) {
      setSelectedCategory(categories[0].id);
    }
  };

  const selectedDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const selectedDateTasks = tasks.filter(t => t.date === selectedDateStr);
  
  const displayTasks = viewMode === 'date' ? selectedDateTasks : (
    filterCategory 
      ? tasks.filter(t => t.categoryId === filterCategory)
      : tasks
  );

  const sortedTasks = [...displayTasks].sort((a, b) => {
    if (viewMode === 'all') {
      // Sort by date, then by completion
      if (a.date !== b.date) return a.date.localeCompare(b.date);
    }
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });

  const pendingCount = displayTasks.filter(t => !t.completed).length;
  const completedCount = displayTasks.filter(t => t.completed).length;

  const getCategoryById = (id?: string) => categories.find(c => c.id === id);

  return (
    <div 
      className={`fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-[#0B0B0D] rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden ${
          isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#0B0B0D]/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 bg-[#FF9F0A]/10 dark:bg-[#FF9F0A]/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <CalendarIcon size={20} className="text-[#FF9F0A] sm:w-6 sm:h-6" />
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
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all duration-150 hover:rotate-90 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} className="text-[#86868B] dark:text-white/60 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex flex-col md:flex-row h-[calc(95vh-80px)] sm:h-[calc(90vh-120px)]">
          {/* Left Column - Calendar */}
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all duration-150"
              >
                <ChevronLeft size={20} className="text-[#1D1D1F] dark:text-white" />
              </button>
              <h3 className="text-lg font-bold text-[#1D1D1F] dark:text-white">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all duration-150"
              >
                <ChevronRight size={20} className="text-[#1D1D1F] dark:text-white" />
              </button>
            </div>

            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              tasks={tasks}
            />

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF375F]" />
                <span className="text-[#86868B] dark:text-white/60">Pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#30D158]" />
                <span className="text-[#86868B] dark:text-white/60">Completed</span>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* View Mode Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-b border-black/10 dark:border-white/10 gap-3 sm:gap-0">
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setViewMode('date')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                    viewMode === 'date'
                      ? 'bg-[#0A84FF] text-white'
                      : 'text-[#86868B] dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-2 whitespace-nowrap ${
                    viewMode === 'all'
                      ? 'bg-[#0A84FF] text-white'
                      : 'text-[#86868B] dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <List size={16} />
                  {t.allTasks}
                </button>
              </div>

              {viewMode === 'all' && (
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-[#86868B] dark:text-white/60" />
                  <select
                    value={filterCategory || ''}
                    onChange={(e) => setFilterCategory(e.target.value || null)}
                    className="px-3 py-1.5 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-lg text-sm text-[#1D1D1F] dark:text-white border-none outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="px-8 py-3 bg-[#F5F5F7] dark:bg-[#1C1C1E] flex items-center gap-4 text-sm">
              <span className="text-[#FF375F] font-medium">{pendingCount} {t.pending}</span>
              <span className="text-[#30D158] font-medium">{completedCount} {t.completed}</span>
            </div>

            {/* Add Task Form */}
            {viewMode === 'date' && (
              <div className="px-8 py-4 bg-white dark:bg-[#0B0B0D] border-b border-black/10 dark:border-white/10">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    placeholder={t.addTask}
                    className="flex-1 px-4 py-2.5 bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 rounded-lg text-sm text-[#1D1D1F] dark:text-white placeholder-[#86868B] dark:placeholder-white/40 outline-none focus:ring-2 focus:ring-[#0A84FF]/50 transition-all duration-150"
                  />
                  <button
                    onClick={addTask}
                    disabled={!newTaskTitle.trim()}
                    className="px-6 py-2.5 bg-[#FF9F0A] text-white rounded-lg font-medium hover:bg-[#FF9F0A]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    {t.add}
                  </button>
                </div>
                
                {/* Category Selection */}
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {categories.map(cat => (
                      <div key={cat.id} className="relative group">
                        <button
                          onClick={() => setSelectedCategory(cat.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                          style={{
                            backgroundColor: selectedCategory === cat.id ? `${cat.color}20` : 'transparent',
                            color: selectedCategory === cat.id ? cat.color : '#86868B',
                            border: `1px solid ${selectedCategory === cat.id ? cat.color : '#D1D1D6'}`
                          }}
                        >
                          {cat.name}
                        </button>
                        {/* Delete button (only show if not a default category and more than 1 category exists) */}
                        {!DEFAULT_CATEGORIES.find(dc => dc.id === cat.id) && categories.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCategory(cat.id);
                            }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF375F] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            title="Delete category"
                          >
                            <X size={10} className="text-white" strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Category Button */}
                    {!isAddingCategory ? (
                      <button
                        onClick={() => setIsAddingCategory(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-[#86868B] text-[#86868B] hover:border-[#0A84FF] hover:text-[#0A84FF] transition-all duration-150 flex items-center gap-1"
                      >
                        <Plus size={12} />
                        {t.newCategory}
                      </button>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                          placeholder="Category name"
                          className="px-2 py-1 w-28 bg-white dark:bg-[#2C2C2E] border border-[#D1D1D6] dark:border-white/20 rounded text-xs outline-none focus:ring-1 focus:ring-[#0A84FF]"
                          autoFocus
                        />
                        <input
                          type="color"
                          value={newCategoryColor}
                          onChange={(e) => setNewCategoryColor(e.target.value)}
                          className="w-8 h-6 rounded cursor-pointer"
                          title="Choose color"
                        />
                        <button
                          onClick={addCategory}
                          disabled={!newCategoryName.trim()}
                          className="p-1 bg-[#30D158] text-white rounded hover:bg-[#30D158]/90 disabled:opacity-40"
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingCategory(false);
                            setNewCategoryName("");
                            setNewCategoryColor("#0A84FF");
                          }}
                          className="p-1 bg-[#FF375F] text-white rounded hover:bg-[#FF375F]/90"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              {sortedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded-full mb-4">
                    <CalendarIcon size={32} className="text-[#86868B] dark:text-white/40" />
                  </div>
                  <p className="text-[#86868B] dark:text-white/60 font-medium">
                    {viewMode === 'date' ? t.noTasks : t.noTasksYet}
                  </p>
                  <p className="text-sm text-[#86868B] dark:text-white/40 mt-1">
                    {viewMode === 'date' ? t.getStarted : t.createFirst}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      category={getCategoryById(task.categoryId)}
                      showDate={viewMode === 'all'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
          from { transform: translateY(-10px); opacity: 0; }
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
