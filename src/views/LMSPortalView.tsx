import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LMSCourse, LMSLesson, LMSQuizQuestion } from '../types';
import BrandLogo from '../components/BrandLogo';
import { FrontPhotoImportSection } from '../components/FrontPhotoImportSection';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  PlusCircle,
  Clock,
  Users,
  ShieldCheck,
  FileText,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Layers,
  HelpCircle,
  ExternalLink,
  Download,
  AlertTriangle,
  PenTool,
  Bookmark
} from 'lucide-react';

export const LMSPortalView: React.FC = () => {
  const {
    courses,
    userProgress,
    enrollCourse,
    completeLesson,
    addCourse,
    updateCourse,
    currentUser,
    role,
    setIsAuthModalOpen,
    navigateTo,
    activeDetailId
  } = useApp();

  // Mode: Reader Learning, Author Studio, Admin Governance
  const [activePortalTab, setActivePortalTab] = useState<'reader' | 'author' | 'admin'>(() => {
    if (role === 'administrator') return 'admin';
    if (role === 'author') return 'author';
    return 'reader';
  });

  // Selected Course for Reading/Taking Lesson
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(activeDetailId || courses[0]?.id || null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  // Author Course Creation State
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState('');
  const [newCourseDiscipline, setNewCourseDiscipline] = useState('Geopolitics & Grand Strategy');
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<'Foundational' | 'Advanced' | 'Executive'>('Executive');
  const [newCourseEstimatedHours, setNewCourseEstimatedHours] = useState(6);
  const [newCourseCoverImage, setNewCourseCoverImage] = useState('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState(25);
  const [newLessonContent, setNewLessonContent] = useState('');
  const [createdLessons, setCreatedLessons] = useState<LMSLesson[]>([]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const currentProgress = selectedCourse ? userProgress[selectedCourse.id] : undefined;
  const isEnrolled = !!currentProgress;
  const currentLesson = selectedCourse?.lessons[selectedLessonIndex] || selectedCourse?.lessons[0];

  const handleEnroll = () => {
    if (role === 'visitor') {
      setIsAuthModalOpen(true);
      return;
    }
    if (selectedCourse) {
      enrollCourse(selectedCourse.id);
    }
  };

  const handleSelectLesson = (index: number) => {
    setSelectedLessonIndex(index);
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return;
    const questions = currentLesson.quiz;
    let correctCount = 0;
    questions.forEach((q, idx) => {
      const correctIdx = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctOptionIndex;
      if (selectedQuizAnswers[idx] === correctIdx) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    if (selectedCourse) {
      completeLesson(selectedCourse.id, currentLesson.id, calculatedScore);
    }
  };

  const handleCompleteCurrentLesson = () => {
    if (selectedCourse && currentLesson) {
      completeLesson(selectedCourse.id, currentLesson.id);
      // Advance to next lesson if available
      if (selectedLessonIndex < selectedCourse.lessons.length - 1) {
        handleSelectLesson(selectedLessonIndex + 1);
      }
    }
  };

  const handleAddLessonDraft = () => {
    if (!newLessonTitle.trim() || !newLessonContent.trim()) return;
    const lesson: LMSLesson = {
      id: `ls-${Date.now()}-${createdLessons.length + 1}`,
      title: newLessonTitle.trim(),
      durationMinutes: newLessonDuration,
      type: 'briefing',
      content: newLessonContent.trim(),
    };
    setCreatedLessons(prev => [...prev, lesson]);
    setNewLessonTitle('');
    setNewLessonContent('');
  };

  const handlePublishCourseByAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const lessonsToUse: LMSLesson[] = createdLessons.length > 0 ? createdLessons : [
      {
        id: `ls-${Date.now()}-1`,
        title: 'Executive Orientation & Doctrine Framework',
        durationMinutes: 30,
        type: 'briefing',
        content: 'This executive orientation unpacks the core institutional doctrine and empirical research base required for statecraft.',
      }
    ];

    const course: LMSCourse = {
      id: `crs-${Date.now()}`,
      title: newCourseTitle.trim(),
      subtitle: newCourseSubtitle.trim() || 'Executive Masterclass Series',
      discipline: newCourseDiscipline,
      instructorName: currentUser?.name || 'Dr. Tariq Al-Mansoor',
      instructorTitle: currentUser?.affiliation || 'Author Fellow, The Patriot Bureau',
      instructorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      coverImage: newCourseCoverImage,
      difficulty: newCourseDifficulty,
      estimatedHours: newCourseEstimatedHours,
      enrolledStudentsCount: 1,
      rating: 5.0,
      status: role === 'administrator' ? 'published' : 'published',
      lessons: lessonsToUse,
    };

    addCourse(course);
    setIsCreatingCourse(false);
    setSelectedCourseId(course.id);
    setActivePortalTab('reader');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-slate-900 dark:text-stone-100 pb-20">
      {/* Academy Masthead */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-amber-900/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-amber-400">
                <GraduationCap className="w-4 h-4" />
                <span>The Patriot Academy & Diplomatic College</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  LMS Portal
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-50">
                Sovereign Strategy & Scholarly Masterclasses
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Empirical curriculum in grand strategy, quantum physical defense, monetary architecture, and statecraft.
                Designed for scholars, authors, and sovereign policymakers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch Portal Credentials</span>
              </button>
            </div>
          </div>

          {/* Portal Switcher Tabs: Reader, Author Studio, Admin Bureau */}
          <div className="mt-8 flex items-center gap-2 border-t border-slate-800 pt-4 overflow-x-auto">
            <button
              onClick={() => setActivePortalTab('reader')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activePortalTab === 'reader'
                  ? 'bg-amber-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Reader Learning Room ({courses.length})</span>
            </button>

            <button
              onClick={() => {
                if (role !== 'author' && role !== 'administrator') {
                  setIsAuthModalOpen(true);
                  return;
                }
                setActivePortalTab('author');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activePortalTab === 'author'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/40 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4 text-amber-400" />
              <span>Author Masterclass Studio</span>
              {role !== 'author' && role !== 'administrator' && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Author Req</span>
              )}
            </button>

            <button
              onClick={() => {
                if (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') {
                  setIsAuthModalOpen(true);
                  return;
                }
                setActivePortalTab('admin');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activePortalTab === 'admin'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sovereign Curriculum Bureau</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-mono">
                Wahab Ali Khiva
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Body depending on Active Tab */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ============================================================= */}
        {/* TAB 1: READER LEARNING ROOM */}
        {/* ============================================================= */}
        {activePortalTab === 'reader' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Course Selector & List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-slate-800">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Available Masterclasses
                </h3>
                <span className="text-xs font-mono text-slate-500">{courses.length} Modules</span>
              </div>

              <div className="space-y-3">
                {courses.map(course => {
                  const progress = userProgress[course.id];
                  const completedLessons = progress?.completedLessonIds?.length || 0;
                  const totalLessons = course.lessons.length;
                  const pct = Math.round((completedLessons / totalLessons) * 100);
                  const isSelected = course.id === selectedCourseId;

                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setSelectedLessonIndex(0);
                        setSelectedQuizAnswers({});
                        setQuizSubmitted(false);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-slate-900 border-amber-500/80 shadow-md ring-2 ring-amber-500/20'
                          : 'bg-white dark:bg-slate-900/60 border-stone-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                            {course.discipline}
                          </span>
                          <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                            {course.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            By {course.instructorName}
                          </p>
                        </div>
                      </div>

                      {/* Course Metadata pills */}
                      <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {course.estimatedHours}h
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {course.lessons.length} Lessons
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-slate-800 text-[10px] font-mono">
                          {course.difficulty}
                        </span>
                      </div>

                      {/* Progress Bar if enrolled */}
                      {progress && (
                        <div className="mt-3 pt-2 border-t border-stone-200 dark:border-slate-800">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">Progress</span>
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                              {pct}% ({completedLessons}/{totalLessons})
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-600 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {progress.isCompleted && (
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Certified Completed</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Selected Course Syllabus & Active Lesson / Quiz */}
            <div className="lg:col-span-8">
              {selectedCourse ? (
                <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  {/* Course Header Banner */}
                  <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-950 to-slate-900 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-amber-400">
                          <span>{selectedCourse.discipline}</span>
                          <span>•</span>
                          <span>{selectedCourse.difficulty} Level</span>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {selectedCourse.title}
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                          {selectedCourse.subtitle}
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <img
                            src={selectedCourse.instructorAvatar}
                            alt={selectedCourse.instructorName}
                            className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{selectedCourse.instructorName}</p>
                            <p className="text-[11px] text-slate-400">{selectedCourse.instructorTitle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end justify-center">
                        {!isEnrolled ? (
                          <button
                            onClick={handleEnroll}
                            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                          >
                            <GraduationCap className="w-4 h-4" />
                            <span>Enroll in Masterclass</span>
                          </button>
                        ) : (
                          <div className="text-right bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300">
                              Status
                            </span>
                            <div className="font-bold text-sm text-white flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Active Enrolled</span>
                            </div>
                            {currentProgress?.isCompleted && (
                              <div className="text-[10px] text-emerald-300 font-mono mt-1">
                                Cert: {currentProgress.certificateId}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Navigation Strip */}
                  <div className="p-4 bg-stone-50 dark:bg-slate-800/50 border-b border-stone-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
                    {selectedCourse.lessons.map((lesson, idx) => {
                      const isCompleted = currentProgress?.completedLessonIds?.includes(lesson.id);
                      const isCurrent = idx === selectedLessonIndex;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(idx)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                            isCurrent
                              ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-sm font-bold'
                              : isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-stone-100'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                          )}
                          <span>{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Lesson Content */}
                  {currentLesson && (
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800 gap-2">
                        <div>
                          <div className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-wider font-semibold">
                            Lesson {selectedLessonIndex + 1} of {selectedCourse.lessons.length}
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {currentLesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            ~{currentLesson.durationMinutes} min read
                          </span>
                        </div>
                      </div>

                      {/* Briefing Text */}
                      <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                        {(currentLesson.content || currentLesson.briefingNotes || currentLesson.summary || 'Policy briefing in progress.')
                          .split('\n\n')
                          .map((paragraph: string, i: number) => (
                            <p key={i} className="mb-4">
                              {paragraph}
                            </p>
                          ))}
                      </div>

                      {/* Interactive Knowledge Assessment / Quiz */}
                      {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                        <div className="mt-8 p-6 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                              Policy & Strategy Knowledge Assessment
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                            Answer the assessment questions below to certify your strategic mastery of this module.
                          </p>

                          <div className="space-y-6">
                            {currentLesson.quiz.map((q, qIdx) => (
                              <div key={qIdx} className="space-y-2">
                                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                  {qIdx + 1}. {q.question}
                                </p>
                                <div className="space-y-1.5 pl-2">
                                  {q.options.map((opt, optIdx) => {
                                    const isChosen = selectedQuizAnswers[qIdx] === optIdx;
                                    const correctIdx = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctOptionIndex;
                                    const isCorrect = correctIdx === optIdx;

                                    let optionStyle =
                                      'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                                    if (quizSubmitted) {
                                      if (isCorrect) {
                                        optionStyle =
                                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
                                      } else if (isChosen && !isCorrect) {
                                        optionStyle =
                                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                                      }
                                    } else if (isChosen) {
                                      optionStyle =
                                        'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 font-medium';
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={quizSubmitted}
                                        onClick={() => handleQuizAnswer(qIdx, optIdx)}
                                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${optionStyle}`}
                                      >
                                        <span>{opt}</span>
                                        {quizSubmitted && isCorrect && (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                                {quizSubmitted && q.explanation && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400 pl-2 pt-1 italic">
                                    💡 {q.explanation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Submit / Score Action */}
                          <div className="mt-6 pt-4 border-t border-stone-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {!quizSubmitted ? (
                              <button
                                onClick={handleQuizSubmit}
                                disabled={Object.keys(selectedQuizAnswers).length < currentLesson.quiz.length}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-50 transition-all dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950"
                              >
                                Submit Assessment for Grading
                              </button>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="text-xs font-mono">
                                  Score: <span className="font-bold text-sm text-amber-600 dark:text-amber-400">{quizScore}%</span>
                                </div>
                                {quizScore && quizScore >= 70 ? (
                                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Passed Module Benchmark
                                  </span>
                                ) : (
                                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                    Review briefing concepts and retry
                                  </span>
                                )}
                              </div>
                            )}

                            <button
                              onClick={handleCompleteCurrentLesson}
                              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center gap-2"
                            >
                              <span>Complete Lesson & Advance</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Course Completion & Sovereign Certificate */}
                      {currentProgress?.isCompleted && (
                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-950 to-slate-950 text-white border border-amber-500/40 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                                <Award className="w-6 h-6" />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                                  Official Accreditation
                                </span>
                                <h4 className="font-serif text-xl font-bold text-white">
                                  Masterclass Certificate Issued
                                </h4>
                                <p className="text-xs text-slate-300 mt-1">
                                  Certified by The Patriot Editorial Board & Platform Sovereign Wahab Ali Khiva.
                                </p>
                                <p className="text-[10px] text-amber-300/80 font-mono mt-2">
                                  Credential ID: {currentProgress.certificateId} • Issued {new Date(currentProgress.certificateIssuedDate || '').toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.print()}
                              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <Download className="w-4 h-4" />
                              <span>Print / Download Certificate</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold">Select a masterclass to begin your learning curriculum.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: AUTHOR MASTERCLASS STUDIO */}
        {/* ============================================================= */}
        {activePortalTab === 'author' && (
          role !== 'author' && role !== 'administrator' ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Author Mandate Required</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                Only Author Fellows appointed and authorized by Sovereign Master <strong>Wahab Ali Khiva</strong> can publish and curate masterclasses in this studio.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-6 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Sign In With Appointed Author Credentials
              </button>
            </div>
          ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  Author Fellow Bureau
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Course & Masterclass Authoring Studio
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Design executive learning modules, compose policy briefings, and construct interactive knowledge assessments.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingCourse(!isCreatingCourse)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isCreatingCourse ? 'Cancel Authoring' : '+ Create New Masterclass'}</span>
              </button>
            </div>

            {/* Authoring Form */}
            {isCreatingCourse ? (
              <form onSubmit={handlePublishCourseByAuthor} className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="border-b border-stone-200 dark:border-slate-800 pb-4">
                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    Masterclass Metadata & Curriculum Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Once drafted, your course will be registered and submitted for Wahab Ali Khiva's accreditation seal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourseTitle}
                      onChange={e => setNewCourseTitle(e.target.value)}
                      placeholder="e.g. Rare Earth Geopolitics & Critical Supply Chains"
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Academic Discipline *
                    </label>
                    <select
                      value={newCourseDiscipline}
                      onChange={e => setNewCourseDiscipline(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm"
                    >
                      <option value="Geopolitics & Grand Strategy">Geopolitics & Grand Strategy</option>
                      <option value="Monetary Economics & Central Banking">Monetary Economics & Central Banking</option>
                      <option value="Quantum Physics & Advanced Computing">Quantum Physics & Advanced Computing</option>
                      <option value="Statecraft & Defense Doctrine">Statecraft & Defense Doctrine</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Course Subtitle / Executive Overview
                    </label>
                    <input
                      type="text"
                      value={newCourseSubtitle}
                      onChange={e => setNewCourseSubtitle(e.target.value)}
                      placeholder="A comprehensive study into sovereign vulnerability, processing monopolies, and bilateral bilateral agreements."
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={newCourseDifficulty}
                      onChange={e => setNewCourseDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm"
                    >
                      <option value="Foundational">Foundational</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Estimated Duration (Hours)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={newCourseEstimatedHours}
                      onChange={e => setNewCourseEstimatedHours(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 rounded-xl text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FrontPhotoImportSection
                      publicationType="article"
                      currentPhotoUrl={newCourseCoverImage}
                      currentCaption={newCourseTitle ? `Masterclass: ${newCourseTitle}` : 'Executive Masterclass Artwork'}
                      currentCredit={currentUser?.name || 'Patriot Academy Directorate'}
                      isFrontPageFeatured={false}
                      onPhotoChanged={(data) => {
                        setNewCourseCoverImage(data.url);
                      }}
                    />
                  </div>
                </div>

                {/* Lessons Section */}
                <div className="pt-4 border-t border-stone-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                      Curriculum Lessons & Policy Briefings ({createdLessons.length})
                    </h4>
                  </div>

                  {createdLessons.length > 0 && (
                    <div className="space-y-2">
                      {createdLessons.map((l, i) => (
                        <div key={l.id} className="p-3 bg-stone-50 dark:bg-slate-800 rounded-xl border border-stone-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">Lesson {i + 1}: {l.title}</span>
                            <span className="ml-2 text-slate-500 font-mono">({l.durationMinutes} mins)</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">Ready</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Lesson mini-box */}
                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200 dark:border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newLessonTitle}
                          onChange={e => setNewLessonTitle(e.target.value)}
                          placeholder="Lesson Title (e.g. Doctrine of Chokepoint Deterrence)"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={newLessonDuration}
                          onChange={e => setNewLessonDuration(Number(e.target.value))}
                          placeholder="Duration (mins)"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        value={newLessonContent}
                        onChange={e => setNewLessonContent(e.target.value)}
                        placeholder="Write or paste comprehensive policy briefing text..."
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-stone-300 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLessonDraft}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold text-xs"
                    >
                      + Add Lesson to Masterclass
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreatingCourse(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    Discard Draft
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md"
                  >
                    Publish Masterclass to The Patriot Academy
                  </button>
                </div>
              </form>
            ) : (
              /* Author Existing Courses Overview */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-5">
                        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                          {course.discipline}
                        </span>
                        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white mt-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          {course.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Users className="w-3.5 h-3.5" />
                        {course.enrolledStudentsCount} Scholars Enrolled
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setActivePortalTab('reader');
                        }}
                        className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                      >
                        Preview as Learner →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          )
        )}

        {/* ============================================================= */}
        {/* TAB 3: SOVEREIGN CURRICULUM BUREAU (Wahab Ali Khiva) */}
        {/* ============================================================= */}
        {activePortalTab === 'admin' && (
          (role !== 'administrator' && currentUser?.email !== 'wahabalikhiva@gmail.com') ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">Supreme Accreditation Bureau</h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                This supreme curriculum accreditation bureau is strictly under the sovereign authority of <strong>Wahab Ali Khiva</strong>.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-6 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Sign In as Master Administrator
              </button>
            </div>
          ) : (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white border border-amber-900/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                    Supreme Accreditation Bureau
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    Sovereign Governance & Accreditation: Wahab Ali Khiva
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    Exclusive master oversight over curriculum standards, instructor mandates, diplomatic accreditation badges, and institutional certificate keys.
                  </p>
                </div>
              </div>
            </div>

            {/* Courses Management Table */}
            <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-200 dark:border-slate-800 flex items-center justify-between">
                <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Accredited Masterclasses Directory ({courses.length})
                </h4>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  All Modules Certified by Wahab Ali Khiva
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-stone-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Masterclass</th>
                      <th className="py-3 px-4">Lead Instructor</th>
                      <th className="py-3 px-4">Discipline</th>
                      <th className="py-3 px-4">Enrolled</th>
                      <th className="py-3 px-4">Accreditation</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-slate-800">
                    {courses.map(course => (
                      <tr key={course.id} className="hover:bg-stone-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={course.coverImage}
                              alt=""
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div>
                              <div className="font-bold">{course.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{course.lessons.length} Lessons • {course.estimatedHours}h</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {course.instructorName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 font-mono text-[10px]">
                            {course.discipline}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {course.enrolledStudentsCount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-[10px] font-bold">
                            Certified Live
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setActivePortalTab('reader');
                            }}
                            className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                          >
                            Inspect Curriculum
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )
        )}

      </div>
    </div>
  );
};

export default LMSPortalView;
