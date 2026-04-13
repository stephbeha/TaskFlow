import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { 
  DndContext, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors,
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { 
  Plus, 
  Trash2, 
  Zap, 
  GripVertical,
  X,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ListTodo,
} from "lucide-react";

import "./App.css";
import { useTheme } from "./ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

// --- SORTABLE TASK COMPONENT (Jira-like) ---
function TaskCard({ task, onDelete, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id,
    data: { type: 'Task', task }
  });
  const { theme, isDark } = useTheme();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Priority colors
  const getPriorityClass = () => {
    const baseClasses = 'border-l-4 transition-all';
    const priorityMap = {
      critical: {
        dark: `${baseClasses} border-l-red-500 bg-red-900/20 hover:bg-red-900/30`,
        light: `${baseClasses} border-l-red-500 bg-red-50 hover:bg-red-100`
      },
      high: {
        dark: `${baseClasses} border-l-orange-500 bg-orange-900/20 hover:bg-orange-900/30`,
        light: `${baseClasses} border-l-orange-500 bg-orange-50 hover:bg-orange-100`
      },
      normal: {
        dark: theme === 'green' 
          ? `${baseClasses} border-l-green-500 bg-slate-900/30 hover:bg-slate-900/50`
          : `${baseClasses} border-l-blue-500 bg-dark-card hover:bg-dark-border`,
        light: `${baseClasses} border-l-blue-400 bg-white hover:bg-gray-50`
      },
      low: {
        dark: `${baseClasses} border-l-gray-500 bg-gray-900/20 hover:bg-gray-900/30`,
        light: `${baseClasses} border-l-gray-400 bg-gray-50 hover:bg-gray-100`
      }
    };
    const priority = task.priority || 'normal';
    return priorityMap[priority]?.[isDark ? 'dark' : 'light'] || priorityMap.normal.light;
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      onClick={() => onClick(task)}
      className={`group relative p-3.5 mb-2.5 rounded-lg cursor-pointer ${getPriorityClass()} ${
        isDark ? 'border border-dark-border shadow-lg' : 'border border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Task ID and drag handle */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div 
            {...attributes} 
            {...listeners} 
            className={`cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
              isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-300 hover:text-gray-500'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </div>
          <span className={`text-xs font-bold flex-shrink-0 opacity-70 ${
            theme === 'green' && isDark ? 'text-green-light' : 'text-blue-400'
          }`}>
            #{task.id}
          </span>
          <h4 className={`font-semibold text-sm leading-tight flex-1 truncate ${
            isDark ? 'text-gray-200' : 'text-gray-800'
          }`} title={task.title}>{task.title}</h4>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all flex-shrink-0 ${
            isDark 
              ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' 
              : 'text-gray-300 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Description Preview */}
      {task.description && (
        <p className={`text-xs mb-2 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description}
        </p>
      )}
      
      {/* Bottom Info Bar */}
      <div className={`flex items-center gap-2 justify-between mt-3 pt-2 ${
        isDark ? 'border-t border-dark-border' : 'border-t border-gray-100'
      }`}>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Points */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
            theme === 'green' && isDark
              ? 'bg-green-primary/20 text-green-light'
              : isDark
              ? 'bg-blue-900/30 text-blue-300'
              : 'bg-blue-100 text-blue-700'
          }`}>
            <Zap size={12} /> {task.points}
          </span>

          {/* Priority Badge */}
          {task.priority && task.priority !== 'normal' && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
              task.priority === 'critical'
                ? isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'
                : task.priority === 'high'
                ? isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-700'
                : isDark ? 'bg-gray-900/30 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <AlertCircle size={12} /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="flex gap-1">
              {task.labels.slice(0, 2).map((label) => (
                <span key={label} className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isDark 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {label}
                </span>
              ))}
              {task.labels.length > 2 && (
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  +{task.labels.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee && (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            theme === 'green' && isDark ? 'bg-green-primary' : 'bg-blue-500'
          }`} title={task.assignee}>
            {task.assignee.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

// --- COLUMN COMPONENT ---
function TaskColumn({ id, title, icon: Icon, tasks, onDelete, onTaskClick }) {
  const { setNodeRef } = useDroppable({ id, data: { type: 'Column', status: id } });
  const { isDark, theme } = useTheme();

  const headerBg = theme === 'green' && isDark
    ? 'bg-green-900/40'
    : isDark
    ? 'bg-dark-card'
    : 'bg-white/50';

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[320px] flex flex-col rounded-xl overflow-hidden ${
      isDark 
        ? 'bg-dark-card border border-dark-border shadow-lg' 
        : 'bg-white border border-gray-200/50 shadow-sm'
    }`}>
      <div className={`px-4 py-3 border-b ${
        isDark ? 'border-dark-border' : 'border-gray-200/50'
      } ${headerBg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              theme === 'green' && isDark
                ? 'bg-green-primary'
                : isDark
                ? 'bg-blue-600'
                : 'bg-blue-500'
            }`}>
              <Icon size={16} className={theme === 'green' && isDark ? 'text-black' : 'text-white'} />
            </div>
            <h2 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{title}</h2>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            isDark
              ? 'bg-dark-border text-gray-400'
              : 'bg-gray-100 text-gray-500'
          }`}>{tasks.length}</span>
        </div>
      </div>
      
      <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className={`flex-1 overflow-y-auto min-h-[300px] p-3 space-y-1 ${
          isDark ? 'bg-dark-bg' : 'bg-white'
        }`}>
          {tasks.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-full py-8 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <Icon size={32} className="mb-2 opacity-50" />
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs mt-1">Drag tasks here or create new ones</p>
            </div>
          ) : (
            tasks.map(t => <TaskCard key={t.id} task={t} onDelete={onDelete} onClick={onTaskClick} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// --- ENHANCED MODAL WITH JIRA FEATURES ---
function TaskModal({ task, onClose, onUpdate, isLoading }) {
  const [formData, setFormData] = useState(task);
  const [loadingAI, setLoadingAI] = useState(false);
  const { isDark, theme } = useTheme();
  const [labelInput, setLabelInput] = useState('');

  const handleAISuggest = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title })
      });
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        points: data.suggested_points,
        priority: data.suggested_priority,
        description: data.description
      }));
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAddLabel = () => {
    if (labelInput.trim()) {
      setFormData(prev => ({
        ...prev,
        labels: [...(prev.labels || []), labelInput.trim()]
      }));
      setLabelInput('');
    }
  };

  const handleRemoveLabel = (index) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-dark-card' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b ${
          isDark
            ? `border-dark-border ${theme === 'green' ? 'bg-green-900/20' : 'bg-slate-800/80'}`
            : 'border-gray-200 bg-blue-50'
        } flex justify-between items-center`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            Task #{task.id} - Edit Details
          </h2>
          <button onClick={onClose} className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Title
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className={`w-full px-4 py-2 rounded-lg outline-none ${
                isDark
                  ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                  : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <button
                onClick={handleAISuggest}
                disabled={loadingAI || !formData.title}
                className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors ${
                  theme === 'green' && isDark
                    ? 'bg-green-primary text-black hover:bg-green-dark disabled:opacity-50'
                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                }`}
              >
                <Sparkles size={14} /> AI Suggest
              </button>
            </div>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg outline-none h-24 resize-none ${
                isDark
                  ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                  : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Main Fields Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg outline-none ${
                  isDark
                    ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                    : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <option value="backlog">TO DO</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg outline-none ${
                  isDark
                    ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                    : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Story Points
              </label>
              <input 
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                min="1"
                className={`w-full px-3 py-2 rounded-lg outline-none ${
                  isDark
                    ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                    : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Assignee
              </label>
              <input 
                type="text"
                value={formData.assignee || ''}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                placeholder="Name or email"
                className={`w-full px-3 py-2 rounded-lg outline-none ${
                  isDark
                    ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                    : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Labels
            </label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddLabel()}
                placeholder="Add a label..."
                className={`flex-1 px-3 py-2 rounded-lg outline-none ${
                  isDark
                    ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                    : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              <button
                onClick={handleAddLabel}
                className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                  theme === 'green' && isDark
                    ? 'bg-green-primary text-black hover:bg-green-dark'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.labels || []).map((label, idx) => (
                <span key={idx} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                  isDark
                    ? 'bg-purple-900/30 text-purple-300'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {label}
                  <button
                    onClick={() => handleRemoveLabel(idx)}
                    className="ml-1 hover:opacity-70"
                  >
                    Ã—
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.description && (
            <div className={`p-4 rounded-lg border ${
              isDark
                ? 'bg-dark-bg border-dark-border'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Preview</p>
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <ReactMarkdown>{formData.description}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 border-t px-6 py-4 flex gap-3 justify-end ${
          isDark ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-gray-50'
        }`}>
          <button 
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              isDark
                ? 'text-gray-300 hover:bg-dark-border'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
              theme === 'green' && isDark
                ? 'bg-green-primary text-black hover:bg-green-dark disabled:opacity-50'
                : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTask, setModalTask] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("backlog");
  const { isDark, theme } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, { distance: 8 })
  );

  // --- FETCH TASKS ---
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      setTasks(await response.json());
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CREATE TASK ---
  const createTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: newTaskTitle,
          status: selectedColumn
        })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // --- DELETE TASK ---
  const deleteTask = async (taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- UPDATE TASK ---
  const updateTask = async (updatedTask) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      });
      const updated = await response.json();
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setUpdating(false);
    }
  };

  // --- DRAG & DROP ---
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    if (draggedTask.status !== over.id) {
      updateTask({ ...draggedTask, status: over.id });
    }
  };

  const backlogTasks = tasks.filter(t => t.status === "backlog");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const completedPoints = completedTasks.reduce((sum, t) => sum + t.points, 0);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${
        isDark && theme === 'green'
          ? 'bg-slate-900'
          : isDark
          ? 'bg-dark-bg'
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'
      }`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
              theme === 'green' && isDark
                ? 'border-green-primary/30 border-t-green-primary'
                : isDark
                ? 'border-blue-600/30 border-t-blue-600'
                : 'border-blue-200 border-t-blue-500'
            }`}></div>
          </div>
          <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading TaskFlow...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-8 ${
      isDark && theme === 'green'
        ? 'bg-slate-900'
        : isDark
        ? 'bg-dark-bg'
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
    }`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 ${
        isDark
          ? `border-dark-border ${theme === 'green' ? 'bg-slate-900/80' : 'bg-dark-card/80'}`
          : 'bg-white/80 border-gray-200/50'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Top Row - Logo and Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                theme === 'green' && isDark
                  ? 'bg-green-primary'
                  : 'bg-blue-500'
              }`}>
                <ListTodo size={24} className={theme === 'green' && isDark ? 'text-black' : 'text-white'} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>TaskFlow</h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Intelligent Task Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className={`text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="text-sm font-semibold">Progress</p>
                <p className={`text-2xl font-bold ${
                  theme === 'green' && isDark ? 'text-green-primary' : 'text-blue-500'
                }`}>
                  {totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0}%
                </p>
              </div>
              <div className={`text-right ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="text-sm font-semibold">Total Points</p>
                <p className={`text-2xl font-bold ${
                  theme === 'green' && isDark ? 'text-green-primary' : 'text-blue-500'
                }`}>{totalPoints}</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Create */}
          <form onSubmit={createTask} className="flex gap-2">
            <select 
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg outline-none ${
                isDark
                  ? 'bg-dark-bg border border-dark-border text-gray-200 focus:ring-2 focus:ring-blue-500'
                  : 'bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <option value="backlog">TO DO</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <input 
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add new task..."
              className={`flex-1 px-4 py-2 rounded-lg outline-none ${
                isDark
                  ? 'bg-dark-bg border border-dark-border text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500'
                  : 'border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500'
              }`}
            />
            <button 
              type="submit"
              className={`text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                theme === 'green' && isDark
                  ? 'bg-green-primary hover:bg-green-dark text-black'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              <Plus size={18} /> Add
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            <TaskColumn 
              id="backlog" 
              title="TO DO" 
              icon={ListTodo}
              tasks={backlogTasks} 
              onDelete={deleteTask} 
              onTaskClick={setModalTask}
            />
            <TaskColumn 
              id="in_progress" 
              title="In Progress" 
              icon={ChevronRight}
              tasks={inProgressTasks} 
              onDelete={deleteTask} 
              onTaskClick={setModalTask}
            />
            <TaskColumn 
              id="completed" 
              title="Completed" 
              icon={CheckCircle}
              tasks={completedTasks} 
              onDelete={deleteTask} 
              onTaskClick={setModalTask}
            />
          </div>
        </DndContext>
      </main>

      {/* Modal */}
      {modalTask && (
        <TaskModal 
          task={modalTask} 
          onClose={() => setModalTask(null)} 
          onUpdate={updateTask}
          isLoading={updating}
        />
      )}

      {/* Signature Footer */}
      <footer className={`max-w-7xl mx-auto px-6 py-4 mt-6 text-center rounded-t-3xl ${
        isDark ? 'bg-dark-card border-t border-dark-border text-gray-400' : 'bg-white border-t border-gray-200 text-gray-500'
      }`}>
        <p className="text-sm font-semibold mb-2">Signé par</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-wider">
          <span>Stephane</span>
          <span>Patrick</span>
          <span>Gilles</span>
          <span>Maeva</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

