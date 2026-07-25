import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, deleteDoc, runTransaction, increment, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Task, TaskSignup } from '../types';
import { User } from 'firebase/auth';
import { Calendar, MapPin, Clock, Users, Plus, Trash2, CheckCircle2, AlertCircle, Bookmark, ClipboardCheck, Sparkles, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TasksListProps {
  tasks: Task[];
  user: User | null;
  memberProfile?: any | null;
}

export default function TasksList({ tasks, user, memberProfile }: TasksListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [spotsTotal, setSpotsTotal] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.location.toLowerCase().includes(query)
    );
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !description.trim() || !location.trim() || !date || !time) {
      setErrorMsg("All fields are required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const randomId = doc(collection(db, 'tasks')).id;
    const taskPath = `tasks/${randomId}`;

    try {
      await setDoc(doc(db, 'tasks', randomId), {
        title,
        description,
        location,
        date,
        time,
        spotsTotal: Number(spotsTotal),
        spotsFilled: 0,
        creatorId: user.uid,
        creatorName: memberProfile?.name || user.displayName || user.email?.split('@')[0] || "Volunteer",
        createdAt: serverTimestamp()
      });

      // Reset
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');
      setTime('');
      setSpotsTotal(5);
      setIsOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to create volunteering task. Please try again.");
      try {
        handleFirestoreError(err, OperationType.CREATE, taskPath);
      } catch (logErr) {
        console.error("UI logged Firestore error:", logErr);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLeader = user?.email?.toLowerCase() === 'sallumceeljale@gmail.com';

  const handleDeleteTask = async (taskId: string, creatorId: string) => {
    if (!user) return;
    if (user.uid !== creatorId && !isLeader) return;
    const taskPath = `tasks/${taskId}`;

    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, taskPath);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
        {/* Left: search filter */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search volunteering opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Right: Propose button */}
        <button
          id="btn_open_task_modal"
          onClick={() => {
            if (!user) {
              alert("Please sign in with Google to post volunteering events.");
              return;
            }
            setIsOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-600/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Post Opportunity</span>
        </button>
      </div>

      {/* Grid of Tasks */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white border border-slate-200 rounded-3xl shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-705 mt-4">No opportunities listed</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No jobs match your search keywords.'
              : 'Post a volunteer opportunity to get other helper signups in real-time!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} user={user} memberProfile={memberProfile} onDelete={handleDeleteTask} />
          ))}
        </div>
      )}

      {/* Task Creation Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-205 rounded-3xl shadow-xl max-w-lg w-full p-6 relative z-10"
            >
              <h2 className="text-lg font-black font-display text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <span>Publish Volunteer Opportunity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Post detailed needs (e.g., academic mentorship, community charity, conference hosting, database coordination).
              </p>

              <form onSubmit={handleCreateTask} className="mt-5 space-y-4 text-left">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Garden Cleanup Event"
                    className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Description & Instructions
                  </label>
                  <textarea
                    required
                    rows={3}
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about what volunteers need to do, what to bring, clothing, etc..."
                    className="w-full text-sm border border-slate-200 rounded-2xl p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Time / Hours
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 2:00 PM - 5:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Back Green/Sports Field"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Total Volunteer Slots
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={spotsTotal}
                      onChange={(e) => setSpotsTotal(Math.max(1, Number(e.target.value)))}
                      className="w-full text-sm border border-slate-200 rounded-2xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-slate-205 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Post Opportunity</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Inner Component: Handles individual real-time Signups listener per task Card
interface TaskCardProps {
  task: Task;
  user: User | null;
  memberProfile?: any | null;
  onDelete: (id: string, creator: string) => void | Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, user, memberProfile, onDelete }) => {
  const [signups, setSignups] = useState<TaskSignup[]>([]);
  const [acting, setActing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isSignedUp = user && signups.some(s => s.userId === user.uid);
  const spotsLeft = task.spotsTotal - task.spotsFilled;
  const isFull = spotsLeft <= 0;
  const isLeader = user?.email?.toLowerCase() === 'sallumceeljale@gmail.com';
  const isCreator = user && (task.creatorId === user.uid || isLeader);

  useEffect(() => {
    const q = query(collection(db, `tasks/${task.id}/signups`), orderBy('signedUpAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: TaskSignup[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          userId: doc.id,
          userName: data.userName,
          userEmail: data.userEmail,
          signedUpAt: data.signedUpAt?.toDate() || new Date()
        });
      });
      setSignups(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `tasks/${task.id}/signups`);
    });
    return unsubscribe;
  }, [task.id]);

  const handleSignUpToggle = async () => {
    if (!user) {
      alert("Please sign in first with Google to register for this volunteering job.");
      return;
    }

    setActing(true);
    const taskDocRef = doc(db, 'tasks', task.id);
    const signupDocRef = doc(db, `tasks/${task.id}/signups`, user.uid);

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(taskDocRef);
        if (!sfDoc.exists()) throw new Error("This opportunity has been removed.");

        const currentData = sfDoc.data();
        const currentFilled = currentData.spotsFilled || 0;

        if (isSignedUp) {
          // Remove signup
          transaction.delete(signupDocRef);
          transaction.update(taskDocRef, {
            spotsFilled: Math.max(0, currentFilled - 1)
          });
        } else {
          // Add signup
          if (currentFilled >= task.spotsTotal) {
            throw new Error("Sorry, this opportunity has just filled up!");
          }
          transaction.set(signupDocRef, {
            userId: user.uid,
            userName: memberProfile?.name || user.displayName || user.email?.split('@')[0] || "Volunteer",
            userEmail: user.email || '',
            signedUpAt: serverTimestamp()
          });
          transaction.update(taskDocRef, {
            spotsFilled: currentFilled + 1
          });
        }
      });
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error joining task. Please try again.");
    } finally {
      setActing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-md hover:border-indigo-150 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 text-left">
            <h3 className="font-bold text-base text-slate-800 leading-snug">{task.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 matches-bento">
              <span>By {task.creatorName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isCreator && (
              <div className="flex items-center gap-1">
                {confirmDelete ? (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-100 rounded-lg p-1 animate-none shrink-0">
                    <span className="text-[8px] font-bold text-red-650 px-1 select-none">Sure?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(task.id, task.creatorId);
                        setConfirmDelete(false);
                      }}
                      className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[8px] font-black cursor-pointer uppercase transition-all"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[8px] font-bold cursor-pointer transition-all"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Remove opportunity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm font-medium text-slate-600 mt-4 leading-relaxed whitespace-pre-wrap text-left">
          {task.description}
        </p>

        {/* Event Meta tags */}
        <div className="grid grid-cols-2 gap-3 mt-5 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Date</p>
              <p className="text-xs font-bold text-slate-700 truncate mt-1">{task.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Time Slot</p>
              <p className="text-xs font-bold text-slate-700 truncate mt-1">{task.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600 col-span-2 mt-1 pt-2 border-t border-slate-200/60">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Location</p>
              <p className="text-xs font-bold text-slate-705 truncate mt-1">{task.location}</p>
            </div>
          </div>
        </div>

        {/* Live Volunteer Registrants section */}
        <div className="mt-5 text-left border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Volunteers Registered</span>
            </p>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
              {task.spotsFilled}/{task.spotsTotal} Filled
            </span>
          </div>

          {signups.length === 0 ? (
            <p className="text-xs text-slate-400 italic mt-3 min-h-[36px] flex items-center">
              No signups yet. Be the first to register below!
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-3 min-h-[36px]">
              {signups.map((signup) => (
                <div
                  key={signup.userId}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-205 rounded-full py-1 pl-1.5 pr-3 transition-all text-[11px] font-bold text-slate-600"
                  title={signup.userEmail}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] uppercase">
                    {signup.userName[0]}
                  </div>
                  <span className="truncate max-w-[90px]">{signup.userName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trigger registration button */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        {isSignedUp ? (
          <button
            onClick={handleSignUpToggle}
            disabled={acting}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 hover:border-rose-205 border border-rose-100 text-rose-750 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs animate-none"
          >
            {acting ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span>Withdraw Registry (Cancel signup)</span>
          </button>
        ) : (
          <button
            onClick={handleSignUpToggle}
            disabled={acting || (isFull && !isSignedUp)}
            className={`w-full py-2.5 px-4 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              isFull
                ? 'bg-slate-200 border border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 border border-indigo-700/10 text-white shadow-md shadow-indigo-600/10'
            }`}
          >
            {acting ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <UserCheck className="w-3.5 h-3.5" />
            )}
            <span>{isFull ? 'Opportunity Fully Booked' : 'Register as Volunteer'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
