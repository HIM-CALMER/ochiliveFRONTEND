import { useEffect, useState } from 'react';

const commentPool = [
  { author: '@lagos_nights', message: 'This is insane ðŸ˜‚ðŸ˜‚ðŸ˜‚', type: 'reaction' },
  { author: '@tokyo_mic', message: 'She just cooked!! ðŸ”¥', type: 'comment' },
  { author: '@brooklyn_b', message: 'sent a $50 gift ðŸŽ', type: 'gift' },
  { author: '@london_late', message: 'Can you replay this? Dying ðŸ’€', type: 'question' },
  { author: '@paris_stand', message: 'Fire performance yo ðŸ”¥ðŸ”¥', type: 'reaction' },
  { author: '@berlin_comedy', message: 'Absolute genius lmaoo ðŸ˜­', type: 'comment' },
  { author: '@mumbai_laugh', message: 'Best comedian on the platform!! ðŸŽ‰', type: 'compliment' },
  { author: '@nairobi_live', message: 'This is the best stream ever', type: 'comment' },
  { author: '@dubai_nights', message: 'Yo how is this so good?? ðŸ¤”', type: 'question' },
  { author: '@toronto_stand', message: 'Coming back to Lagos to book you!!', type: 'comment' },
  { author: '@sydney_live', message: 'ðŸ˜†ðŸ˜†ðŸ˜† cant breathe', type: 'reaction' },
  { author: '@mexico_city', message: 'Tipping $100! You deserve it', type: 'gift' },
  { author: '@istanbul_mic', message: 'Literally world class material ðŸ‘ðŸ‘', type: 'compliment' },
  { author: '@bangkok_nights', message: 'When are you live next?? Addicted ðŸ’¯', type: 'question' },
  { author: '@buenos_aires', message: 'Never laughed this hard bruh ðŸ’€ðŸ’€ðŸ’€', type: 'reaction' },
  { author: '@singapore_stand', message: 'Sending $200 gift from SG', type: 'gift' },
  { author: '@rio_live', message: 'Os melhores! ðŸ™ŒðŸ™Œ', type: 'compliment' },
  { author: '@vancouver_mic', message: 'How do you come up with this?? Genius ðŸ§ ', type: 'question' },
  { author: '@johannesburg', message: 'Standing ovation!! ðŸ‘ðŸ”¥ðŸ‘', type: 'compliment' },
  { author: '@hong_kong_fun', message: 'My sides hurt from laughing ðŸ˜‚ðŸ˜‚ðŸ˜‚', type: 'reaction' },
  { author: '@lisbon_night', message: 'Portugal loves you!! Book a show here ðŸ‡µðŸ‡¹', type: 'comment' },
  { author: '@dubai_vip', message: '$500 gift - worth every penny!! ðŸ’Ž', type: 'gift' },
];

const reactionEmojis = ['ðŸ˜‚', 'ðŸ”¥', 'ðŸŽ‰', 'â¤ï¸', 'ðŸ’€', 'ðŸ‘', 'ðŸ¤£', 'âœ¨', 'ðŸ’¯', 'ðŸ™Œ'];

export default function LiveChatPanel() {
  const [visibleComments, setVisibleComments] = useState([
    commentPool[0],
    commentPool[1],
    commentPool[2],
    commentPool[3],
  ]);
  const [audienceCount, setAudienceCount] = useState(12480);
  const [reactions, setReactions] = useState([]);
  const [commentIndex, setCommentIndex] = useState(4);

  // Animate comments cycling - FASTER (2.5s instead of 3.5s)
  useEffect(() => {
    const commentInterval = setInterval(() => {
      setVisibleComments((prev) => {
        const newComments = [...prev.slice(1), commentPool[commentIndex % commentPool.length]];
        return newComments;
      });
      setCommentIndex((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(commentInterval);
  }, [commentIndex]);

  // Increment audience count
  useEffect(() => {
    const audienceInterval = setInterval(() => {
      setAudienceCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);

    return () => clearInterval(audienceInterval);
  }, []);

  // Add random reactions
  useEffect(() => {
    const reactionInterval = setInterval(() => {
      const newReaction = {
        id: Math.random(),
        emoji: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
        position: Math.random() * 80 + 10,
      };
      setReactions((prev) => [...prev, newReaction]);

      // Remove reaction after animation completes
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2000);
    }, 1500);

    return () => clearInterval(reactionInterval);
  }, []);

  return (
    <div className="relative flex w-[42%] flex-col justify-between bg-slate-950/60 p-4 text-xs text-slate-400 overflow-hidden">
      {/* Animated Reactions Background */}
      <div className="absolute inset-0 pointer-events-none">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute animate-float-up text-2xl opacity-0"
            style={{
              left: `${reaction.position}%`,
              bottom: '10%',
              animation: `float-up 2s ease-out forwards`,
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>

      {/* Audience Counter */}
      <div className="relative z-10">
        <span className="rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-300 inline-block">
          ðŸ”´ Live Â· {audienceCount.toLocaleString()}
        </span>
      </div>

      {/* Animated Comments */}
      <ul className="relative z-10 space-y-1.5 flex-1 overflow-hidden">
        {visibleComments.map((comment, idx) => (
          <li
            key={`${comment.author}-${idx}`}
            className={`transition-all duration-300 text-xs leading-relaxed ${
              idx === visibleComments.length - 1
                ? 'opacity-100 translate-y-0 scale-100'
                : idx === visibleComments.length - 2
                ? 'opacity-80 translate-y-0'
                : 'opacity-50'
            } animate-pulse-subtle`}
            style={{
              animation: idx === visibleComments.length - 1 
                ? 'slideInComment 0.3s ease-out forwards' 
                : 'none',
            }}
          >
            <span className="text-rose-300 font-semibold text-[11px]">{comment.author}</span>
            <span className="text-slate-300 ml-1">{comment.message}</span>
          </li>
        ))}
      </ul>

      {/* Laughter Meter */}
      <div className="relative z-10">
        <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-slate-500">
          <span>Laughter meter</span>
          <span className="text-rose-300 font-semibold">92%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-950">
          <div className="h-full w-[92%] bg-gradient-to-r from-[var(--ochi-accent)] to-rose-400 transition-all duration-500" />
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(0.8);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInComment {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }

        li {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

