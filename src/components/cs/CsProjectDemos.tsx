import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Calculator, 
  Calendar, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  RotateCcw, 
  ExternalLink,
  BookOpen,
  Award,
  Sparkles,
  Layers,
  Copy
} from 'lucide-react';

// ============================================================================
// 1. INTERACTIVE QUIZ APPLICATION
// ============================================================================
export function InteractiveQuizDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      q: 'Which component is considered the "brain" of the computer that executes binary instructions?',
      options: ['Solid State Drive (SSD)', 'Central Processing Unit (CPU)', 'Random Access Memory (RAM)', 'Graphics Monitor'],
      correct: 1,
      explanation: 'The CPU (Central Processing Unit) fetches, decodes, and executes binary instructions billions of times per second.'
    },
    {
      q: 'What is the purpose of decomposition in computational problem solving?',
      options: [
        'Breaking a large, complex challenge into small, manageable sub-problems',
        'Deleting old files from the hard drive',
        'Converting Python code into machine binary code automatically',
        'Speeding up internet bandwidth'
      ],
      correct: 0,
      explanation: 'Decomposition isolates distinct sub-problems so you can solve and test each component independently.'
    },
    {
      q: 'In Python, what is the output of `type("42")`?',
      options: ['<class \'int\'>', '<class \'str\'>', '<class \'float\'>', '<class \'bool\'>'],
      correct: 1,
      explanation: 'Because "42" is enclosed in quotation marks, Python treats it as a string (`str`), not a number.'
    },
    {
      q: 'Which HTML5 element represents the primary navigation landmark for assistive screen readers?',
      options: ['<div class="menu">', '<nav>', '<section id="links">', '<header>'],
      correct: 1,
      explanation: 'The `<nav>` semantic landmark explicitly informs browsers and screen readers of major navigational links.'
    },
    {
      q: 'According to SVT AI Use Principle #2, which data should NEVER be input into public AI prompts?',
      options: [
        'Questions about historical computer science dates',
        'Private student records, personal identifying details, passwords, or secrets',
        'Requests for Python function explanations',
        'Analogies explaining how CPU registers work'
      ],
      correct: 1,
      explanation: 'Strict privacy protection mandates never pasting confidential, personal, or credential information into AI prompts.'
    }
  ];

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestion] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const score = selectedAnswers.reduce((acc, ans, idx) => {
    return ans === quizQuestions[idx].correct ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / quizQuestions.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-900 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Original Project Sandbox • Interactive Quiz Engine
          </span>
        </div>
        {!showResults && (
          <span className="text-xs font-mono font-semibold text-slate-500">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
        )}
      </div>

      {!showResults ? (
        <div className="space-y-4">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>

          <h4 className="text-base font-bold text-slate-900 leading-snug">
            {quizQuestions[currentQuestion].q}
          </h4>

          <div className="space-y-2.5">
            {quizQuestions[currentQuestion].options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestion] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer min-h-[44px] ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold ring-1 ring-blue-500'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center py-4">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mb-1">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 font-display">
            Quiz Complete! Score: {percentage}% ({score}/{quizQuestions.length})
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {percentage >= 80 
              ? 'Outstanding performance! You have a solid grasp of beginner computer fundamentals and logic.'
              : 'Good effort! Review the lesson key points and try the quiz again to solidify concepts.'}
          </p>

          {/* Detailed Question Review */}
          <div className="mt-4 text-left space-y-3 pt-3 border-t border-slate-100">
            {quizQuestions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correct;
              return (
                <div key={idx} className={`p-3 rounded-xl border text-xs ${
                  isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {isCorrect ? (
                      <span className="text-emerald-700">✓ Question {idx + 1} Correct</span>
                    ) : (
                      <span className="text-red-700">✕ Question {idx + 1} Review Needed</span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium mb-1">{q.q}</p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. VOLUNTEER-HOURS CALCULATOR
// ============================================================================
export function VolunteerHoursCalculatorDemo() {
  interface LogItem {
    id: string;
    activity: string;
    category: 'Peer Tutoring' | 'Study Circles' | 'Resource Bank' | 'Community Outreach';
    hours: number;
    date: string;
  }

  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', activity: 'Math Study Group Facilitation', category: 'Peer Tutoring', hours: 2.5, date: '2026-08-28' },
    { id: '2', activity: 'Digital SAT Vocabulary Guide', category: 'Resource Bank', hours: 3.0, date: '2026-08-30' },
    { id: '3', activity: 'Freshman High School Orientation', category: 'Community Outreach', hours: 4.5, date: '2026-09-01' }
  ]);

  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState<LogItem['category']>('Peer Tutoring');
  const [hours, setHours] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHours = parseFloat(hours);
    if (!activity.trim() || isNaN(parsedHours) || parsedHours <= 0) return;

    const newItem: LogItem = {
      id: Date.now().toString(),
      activity: activity.trim(),
      category,
      hours: parsedHours,
      date: new Date().toISOString().split('T')[0]
    };

    setLogs([newItem, ...logs]);
    setActivity('');
    setHours('');
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(item => item.id !== id));
  };

  const totalHours = logs.reduce((acc, item) => acc + item.hours, 0);
  const targetHours = 20;
  const progressPercent = Math.min(100, Math.round((totalHours / targetHours) * 100));

  const copySummary = () => {
    const summaryText = `SVT Volunteer Service Record Summary\nTotal Hours: ${totalHours.toFixed(1)} hrs / Goal: ${targetHours} hrs (${progressPercent}%)\n\nEntries:\n` +
      logs.map(l => `- [${l.date}] ${l.activity} (${l.category}): ${l.hours} hrs`).join('\n');
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-900 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Calculator className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Original Project Sandbox • Volunteer Service Hours Calculator
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-600">
          Target Goal: {targetHours} Hours
        </span>
      </div>

      {/* Progress & Milestone Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Cumulative Hours</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-0.5">{totalHours.toFixed(1)} <span className="text-xs text-slate-500 font-normal">hrs</span></div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Milestone Progress</span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-0.5">{progressPercent}%</div>
        </div>
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Service Status</span>
          <div className="text-xs font-bold text-slate-800 mt-2 flex items-center gap-1.5">
            {totalHours >= targetHours ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Goal Achieved!
              </span>
            ) : (
              <span className="text-amber-700">
                {(targetHours - totalHours).toFixed(1)} hrs to milestone
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add New Volunteer Entry Form */}
      <form onSubmit={handleAddLog} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Log New Service Session
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Activity description (e.g. Peer Tutoring Session)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="sm:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as LogItem['category'])}
              className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Peer Tutoring">Peer Tutoring</option>
              <option value="Study Circles">Study Circles</option>
              <option value="Resource Bank">Resource Bank</option>
              <option value="Community Outreach">Community Outreach</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <input
              type="number"
              step="0.5"
              min="0.5"
              placeholder="Hours (e.g. 2.0)"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="sm:col-span-1">
            <button
              type="submit"
              className="w-full min-h-[36px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              title="Add Entry"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Log Entries List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
          <span>Recent Activity Entries ({logs.length})</span>
          <button
            type="button"
            onClick={copySummary}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
          {logs.map((item) => (
            <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 flex items-center gap-2">
                  <span>{item.activity}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">{item.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold font-mono text-emerald-700 text-xs">+{item.hours} hrs</span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-red-600 cursor-pointer rounded"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. PERSONAL STUDY PLANNER
// ============================================================================
export function PersonalStudyPlannerDemo() {
  interface Task {
    id: string;
    title: string;
    subject: string;
    minutes: number;
    completed: boolean;
  }

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Review Python List Slicing & Dicts', subject: 'CS & AI', minutes: 30, completed: true },
    { id: '2', title: 'Practice 2 DET Interactive Reading Passages', subject: 'English Prep', minutes: 45, completed: false },
    { id: '3', title: 'Digital SAT Desmos Graphing Drill', subject: 'Math', minutes: 30, completed: false }
  ]);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('CS & AI');
  const [minutes, setMinutes] = useState('30');
  const [filter, setFilter] = useState('All');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      subject,
      minutes: parseInt(minutes) || 30,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.subject === filter);
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const totalPlannedMinutes = tasks.reduce((acc, t) => acc + (t.completed ? 0 : t.minutes), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-900 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Original Project Sandbox • Personal Study Planner
          </span>
        </div>
        <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
          <span>Remaining Focus: <strong className="text-slate-900">{totalPlannedMinutes} mins</strong></span>
          <span>•</span>
          <span>{completedCount}/{tasks.length} Completed ({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {['All', 'CS & AI', 'English Prep', 'Math', 'General'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task Input Form */}
      <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-6">
          <input
            type="text"
            placeholder="Add new study topic or exercise..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-3">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CS & AI">CS & AI</option>
            <option value="English Prep">English Prep</option>
            <option value="Math">Math</option>
            <option value="General">General</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="15">15 mins</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">60 mins</option>
          </select>
        </div>
        <div className="sm:col-span-1">
          <button
            type="submit"
            className="w-full min-h-[36px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow-xs"
            title="Add Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No study tasks found for this filter.</p>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                task.completed ? 'bg-emerald-50/40 border-emerald-200 text-slate-400' : 'bg-slate-50/70 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                    task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div>
                  <span className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                      {task.subject}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {task.minutes}m
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="p-1 text-slate-400 hover:text-red-600 cursor-pointer rounded"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. SIMPLE RESOURCE DIRECTORY & SPECS MAPPER
// ============================================================================
export function ResourceDirectoryDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const resources = [
    { name: 'Python.org Official Documentation', category: 'Python', type: 'Docs', desc: 'Standard library reference and official language tutorial.', url: 'https://docs.python.org/3/' },
    { name: 'MDN Web Docs', category: 'Web Dev', type: 'Reference', desc: 'Authoritative documentation for HTML5, CSS3, and modern JavaScript APIs.', url: 'https://developer.mozilla.org/' },
    { name: 'CS50x OpenCourseWare', category: 'Computer Science', type: 'Course', desc: 'Harvard introductory computer science curriculum with problem sets.', url: 'https://cs50.harvard.edu/x/' },
    { name: 'W3C Web Accessibility Guidelines', category: 'Web Dev', type: 'Standard', desc: 'International WCAG 2.1 standards for accessible web interfaces.', url: 'https://www.w3.org/WAI/' },
    { name: 'Elements of AI', category: 'AI & Ethics', type: 'Course', desc: 'Free Finnish online course covering AI philosophy, neural nets, and ethics.', url: 'https://www.elementsofai.com/' }
  ];

  const filtered = resources.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-900 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Original Project Sandbox • Simple Resource Directory
          </span>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Showing {filtered.length} of {resources.length} verified links
        </span>
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-7 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation, courses, standards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-5 flex items-center gap-1 overflow-x-auto text-xs">
          {['All', 'Python', 'Web Dev', 'AI & Ethics'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {filtered.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {item.category} • {item.type}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 leading-snug">{item.name}</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 pt-1"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. RESPONSIBLE-AI STUDENT VERIFICATION UTILITY
// ============================================================================
export function ResponsibleAiChecklistDemo() {
  const [checkedPrinciples, setCheckedPrinciples] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [aiToolUsed, setAiToolUsed] = useState('Google Gemini');
  const [purposeDescription, setPurposeDescription] = useState('Brainstorming topic outlines and explaining difficult syntax concepts');
  const [copiedBadge, setCopiedBadge] = useState(false);

  const principles = [
    {
      id: 1,
      name: 'Verify Important Information',
      desc: 'I have cross-checked all key factual claims, dates, and formulas against textbooks or primary documentation.'
    },
    {
      id: 2,
      name: 'Protect Personal Information',
      desc: 'I did not enter any private student data, passwords, real names, or secret credentials into the AI prompt.'
    },
    {
      id: 3,
      name: 'Understand Output Completely',
      desc: 'I understand and can explain every single line of code, paragraph, and logic step independently without AI.'
    },
    {
      id: 4,
      name: 'Cite Sources When Required',
      desc: 'I have prepared a transparent disclosure of how AI assisted in drafting, outlining, or debugging this work.'
    },
    {
      id: 5,
      name: 'Support Learning, Not Replace Thinking',
      desc: 'I used AI as an active Socratic sparring partner, rather than copying and pasting ready-made answers.'
    },
    {
      id: 6,
      name: 'Check for Bias & Mistakes',
      desc: 'I audited the generated content for hallucinations, outdated facts, and societal biases.'
    }
  ];

  const togglePrinciple = (id: number) => {
    setCheckedPrinciples({
      ...checkedPrinciples,
      [id]: !checkedPrinciples[id]
    });
  };

  const completedCount = Object.values(checkedPrinciples).filter(Boolean).length;
  const isFullyCompliant = completedCount === 6;

  const generatedCitation = `Academic AI Disclosure Statement:
Project: ${assignmentTitle || 'Student Assignment / Code Project'}
Tool Assisted: ${aiToolUsed}
Scope of Use: ${purposeDescription}
SVT Ethical Verification: Completed 6/6 AI Use Principles on ${new Date().toISOString().split('T')[0]}. All facts independently verified and code logic understood by student.`;

  const copyCitation = () => {
    navigator.clipboard.writeText(generatedCitation);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 text-slate-900 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Original Project Sandbox • Responsible AI Student Verification Audit
          </span>
        </div>
        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
          isFullyCompliant 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {completedCount} of 6 Principles Verified
        </span>
      </div>

      {/* Principle Checkboxes */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Pre-Submission Verification Checklist
        </span>

        {principles.map((p) => {
          const isDone = checkedPrinciples[p.id];
          return (
            <div
              key={p.id}
              onClick={() => togglePrinciple(p.id)}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                  : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
              }`}>
                {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <h6 className={`text-xs font-bold ${isDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {p.id}. {p.name}
                </h6>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statement Generator */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
          Generate Transparent AI Citation / Disclosure Statement
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Assignment / Project Title</label>
            <input
              type="text"
              placeholder="e.g. Python Study Timer Script"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">AI Tool / Model</label>
            <input
              type="text"
              value={aiToolUsed}
              onChange={(e) => setAiToolUsed(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">How AI was Used</label>
          <input
            type="text"
            value={purposeDescription}
            onChange={(e) => setPurposeDescription(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Formatted Citation Block */}
        <div className="p-3 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed relative">
          {generatedCitation}
        </div>

        <button
          type="button"
          onClick={copyCitation}
          disabled={!isFullyCompliant}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
        >
          {copiedBadge ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedBadge ? 'Disclosure Copied to Clipboard!' : 'Copy Ethical Disclosure Statement'}</span>
        </button>
        {!isFullyCompliant && (
          <p className="text-[10px] text-amber-700 text-center font-medium">
            Please verify all 6 principles above before generating your verified ethical compliance statement.
          </p>
        )}
      </div>
    </div>
  );
}
