
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Guest } from '../types';
import { Sparkles, Loader2, Send } from 'lucide-react';

interface AIPlannerProps {
  guests: Guest[];
}

const AIPlanner: React.FC<AIPlannerProps> = ({ guests }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [mealIdeas, setMealIdeas] = useState<any | null>(null);

  const handleGenerateLogistics = async () => {
    setLoading(true);
    try {
      const summary = guests.map(g => `${g.name}: ${g.dietaryNote}, ${g.category}`).join('; ');
      const res = await geminiService.suggestLogistics(summary);
      setSuggestion(res || 'No suggestions available.');
    } catch (error) {
      console.error(error);
      setSuggestion("Error connecting to Gemini. Please check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMeals = async () => {
    setLoading(true);
    try {
      const notes = guests.map(g => g.dietaryNote);
      const res = await geminiService.generateMealIdeas(notes);
      setMealIdeas(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 rounded-2xl border border-amber-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-amber-600" />
          <h2 className="text-2xl font-serif font-bold text-amber-900">Gemini Logistics Assistant</h2>
        </div>
        <p className="text-stone-700 mb-6 max-w-2xl">
          Use the power of AI to analyze your guest list and generate perfect logistical batches, 
          meal configurations, and sangeet flow.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleGenerateLogistics}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Generate Logistics Plan
          </button>
          <button
            onClick={handleGenerateMeals}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 border border-stone-300 bg-white text-stone-900 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Suggest Gala Menu
          </button>
        </div>
      </div>

      {suggestion && (
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm prose prose-stone max-w-none">
          <h3 className="text-xl font-serif font-bold mb-4">AI Logistical Strategy</h3>
          <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
            {suggestion}
          </div>
        </div>
      )}

      {mealIdeas && (
        <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xl font-serif font-bold mb-2">{mealIdeas.title}</h3>
          <p className="text-stone-500 mb-6 italic">{mealIdeas.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mealIdeas.courses.map((course: any, idx: number) => (
              <div key={idx} className="p-4 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-amber-600 font-bold text-xs uppercase block mb-1">Course {idx + 1}</span>
                <h4 className="font-bold text-stone-900 mb-2">{course.name}</h4>
                <p className="text-sm text-stone-600">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;
