import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, 
  Flame, Clock, CheckCircle2, Users, Radio, BookOpen, Coffee, Headphones, Music
} from 'lucide-react';

export default function VirtualStudyRoom() {
  // Pomodoro Timer State
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  // Active Silent Study Room Selection
  const [activeRoom, setActiveRoom] = useState<'alpha' | 'beta' | 'gamma'>('alpha');

  // Ambient Sound Synth State
  const [activeSound, setActiveSound] = useState<'off' | 'rain' | 'library' | 'lofi'>('off');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Focus Goal State
  const [focusGoal, setFocusGoal] = useState('Study 25 min for DET/IELTS or draft SVT community updates');
  const [goalCompleted, setGoalCompleted] = useState(false);

  // Mode durations in seconds
  const modeDurations = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  // Timer countdown effect
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed current timer session
      if (mode === 'work') {
        const nextCount = completedSessions + 1;
        setCompletedSessions(nextCount);
        if (nextCount % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(modeDurations.longBreak);
        } else {
          setMode('shortBreak');
          setTimeLeft(modeDurations.shortBreak);
        }
      } else {
        setMode('work');
        setTimeLeft(modeDurations.work);
      }
      setIsRunning(false);
      playChime();
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, completedSessions]);

  // Handle Mode Change
  const handleModeChange = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
    setIsRunning(false);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Web Audio Chime Sound
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  // Web Audio Synth for Ambient Sound Generator
  const toggleAmbientSound = (soundType: 'rain' | 'library' | 'lofi') => {
    if (activeSound === soundType) {
      // Turn off
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setActiveSound('off');
      return;
    }

    // Stop existing sound
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (soundType === 'rain' || soundType === 'library') {
        // Pink/White noise generator filtered for rain or library room acoustics
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = soundType === 'rain' ? 800 : 400;

        const gain = ctx.createGain();
        gain.gain.value = 0.08;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
      } else if (soundType === 'lofi') {
        // Relaxing soft synth chords
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.value = 220; // A3
        osc2.frequency.value = 277.18; // C#4

        gain.gain.value = 0.05;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
      }

      setActiveSound(soundType);
    } catch (err) {
      console.error('Ambient sound synth error:', err);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-left relative overflow-hidden">
      
      {/* Background Ambient Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-extrabold border border-indigo-500/30 mb-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Virtual Silent Study Room & Focus Timer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Scholars Deep Focus Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Study silently alongside fellow scholars with customizable Pomodoro intervals and relaxing ambient soundscapes.
          </p>
        </div>

        {/* Room Switcher */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
          <button
            onClick={() => setActiveRoom('alpha')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoom === 'alpha' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Room Alpha (Silent)
          </button>
          <button
            onClick={() => setActiveRoom('beta')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoom === 'beta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Room Beta (DET/IELTS)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Pomodoro Focus Clock */}
        <div className="lg:col-span-7 bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-700/80 text-center flex flex-col items-center justify-center">
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-700/80 mb-6">
            <button
              onClick={() => handleModeChange('work')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                mode === 'work' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              25m Focus Session
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              5m Short Break
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                mode === 'longBreak' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              15m Long Break
            </button>
          </div>

          {/* Clock Display */}
          <div className="my-2">
            <span className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-white drop-shadow-lg">
              {formatTime(timeLeft)}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-medium mb-6 mt-1">
            {mode === 'work' ? '🔥 Focus time in progress' : '☕ Take a quick breath & rest your eyes'}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer flex items-center gap-2 shadow-lg active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause Timer' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(modeDurations[mode]);
              }}
              className="p-3.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-2xl transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Completed Rounds Counter */}
          <div className="mt-8 pt-6 border-t border-slate-700/80 w-full flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Completed Sessions: <strong className="text-white font-mono text-sm">{completedSessions}</strong></span>
            </span>

            <span className="font-medium">
              4 Sessions = 1 Full Cycle
            </span>
          </div>

        </div>

        {/* Right Column: Goal Setting & Ambient Sounds */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Ambient Sounds Synth */}
          <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>Ambient Study Audio Synth</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => toggleAmbientSound('rain')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  activeSound === 'rain'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>🌧️ Rain</span>
                <span className="text-[9px] opacity-70">Gentle storm</span>
              </button>

              <button
                onClick={() => toggleAmbientSound('library')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  activeSound === 'library'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>📚 Library</span>
                <span className="text-[9px] opacity-70">Room acoustics</span>
              </button>

              <button
                onClick={() => toggleAmbientSound('lofi')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  activeSound === 'lofi'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>🎧 Lo-Fi</span>
                <span className="text-[9px] opacity-70">Chill synth</span>
              </button>
            </div>
          </div>

          {/* Group Goal Setting */}
          <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700/80">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Today's Study Goal</span>
              </span>
              {goalCompleted && (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/30">
                  Goal Complete!
                </span>
              )}
            </h3>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={goalCompleted}
                onChange={(e) => setGoalCompleted(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <input
                type="text"
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 ${
                  goalCompleted ? 'line-through text-slate-500' : 'text-white'
                }`}
              />
            </div>

            <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>6 Scholars in Room Alpha</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
