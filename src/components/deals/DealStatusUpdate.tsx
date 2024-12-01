import React from 'react';
import { Trophy, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DealStatusUpdateProps {
  onUpdateStatus: (status: 'Closed Won' | 'Closed Lost') => Promise<void>;
  loading?: boolean;
}

export const DealStatusUpdate: React.FC<DealStatusUpdateProps> = ({
  onUpdateStatus,
  loading
}) => {
  const handleWon = async () => {
    await onUpdateStatus('Closed Won');
    
    // Trigger confetti animation
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <button
        type="button"
        onClick={() => onUpdateStatus('Closed Lost')}
        disabled={loading}
        className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        <XCircle className="w-4 h-4 mr-2" />
        Mark as Lost
      </button>
      <button
        type="button"
        onClick={handleWon}
        disabled={loading}
        className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        <Trophy className="w-4 h-4 mr-2" />
        Mark as Won
      </button>
    </div>
  );
};