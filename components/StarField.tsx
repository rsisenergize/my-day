'use client';

import { useEffect, useState } from 'react';

export default function StarField() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number; opacity: number }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            '--delay': `${star.delay}s`,
            '--duration': `${star.duration}s`,
            '--max-opacity': star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
