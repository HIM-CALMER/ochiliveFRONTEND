import { useState } from 'react';
import { completeComedyOnboarding } from '../../api/dashboardApi';

const questions = [
  { key: 'comedyStyle', label: 'What kind of comedy do you perform?', placeholder: 'Stand-up, sketch, satire, storytelling...', hint: 'Tell audiences what energy to expect.' },
  { key: 'experience', label: 'How long have you been making people laugh?', placeholder: 'Open mics, years performing, or just getting started...', hint: 'There is no wrong answer.' },
  { key: 'influences', label: 'Who or what inspires your comedy?', placeholder: 'Comedians, culture, everyday observations...', hint: 'Share the voices that shaped your point of view.' },
  { key: 'motivation', label: 'What do you want to create on Ochi Live?', placeholder: 'Live sets, audience conversations, comedy shows...', hint: 'This helps shape your creator experience.' },
  { key: 'audience', label: 'Who do you want in your room?', placeholder: 'Fans of sharp satire, new comedians, everyone...', hint: 'Describe the people you want to make feel welcome.' },
];

export default function ComedyOnboarding({ onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const question = questions[step];
  const value = answers[question.key] || '';

  const next = async (event) => {
    event.preventDefault();
    if (!value.trim()) {
      setError('Add a short answer before continuing.');
      return;
    }
    setError('');
    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    setSaving(true);
    try {
      const result = await completeComedyOnboarding(answers);
      onComplete(result);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to complete onboarding right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="comedy-onboarding-title">
      <form onSubmit={next} className="w-full max-w-xl border border-slate-700 bg-slate-950 p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-ochi-accent">Try Comedy</p>
            <h2 id="comedy-onboarding-title" className="mt-2 text-2xl font-semibold text-white">Find your funny voice.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">Answer five quick questions. When you finish, your creator profile becomes a comedian profile and live access unlocks.</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-white" aria-label="Close Try Comedy">X</button>
        </div>

        <div className="mt-6 flex items-center gap-2" aria-label={`Question ${step + 1} of ${questions.length}`}>
          {questions.map((item, index) => <span key={item.key} className={`h-1.5 flex-1 ${index <= step ? 'bg-ochi-accent' : 'bg-slate-800'}`} />)}
        </div>

        <div className="mt-7">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Question {step + 1} of {questions.length}</p>
          <label className="mt-3 block text-lg font-medium leading-7 text-white">
            {question.label}
            <textarea autoFocus value={value} onChange={(event) => setAnswers((current) => ({ ...current, [question.key]: event.target.value }))} placeholder={question.placeholder} rows={4} className="mt-4 w-full resize-none border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-normal leading-6 text-white outline-none placeholder:text-slate-500 focus:border-ochi-accent" />
          </label>
          <p className="mt-2 text-xs text-slate-500">{question.hint}</p>
          {error ? <p className="mt-4 text-sm text-rose-300" role="alert">{error}</p> : null}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step > 0 ? setStep((current) => current - 1) : onClose()} className="px-2 py-2 text-sm text-slate-400 hover:text-white">{step > 0 ? 'Back' : 'Not now'}</button>
          <button type="submit" disabled={saving} className="border border-ochi-accent bg-ochi-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Creating comedian profile...' : step === questions.length - 1 ? 'Become a comedian' : 'Continue'}</button>
        </div>
      </form>
    </div>
  );
}