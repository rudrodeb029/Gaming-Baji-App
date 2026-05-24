import { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
}

export const AnimatedCounter = ({ value, duration = 1000 }: AnimatedCounterProps) => {
  const { formatCurrency } = useCurrency();
  const [displayValue, setDisplayValue] = useState(0);

  // Parse the target number, stripping out non-numeric characters if it's a string
  const targetNumber = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0
    : value;

  useEffect(() => {
    let start = 0;
    const end = targetNumber;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo function: t => 1 - 2^(-10t)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentVal = start + (end - start) * easeProgress;
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [targetNumber, duration]);

  return <>{formatCurrency(displayValue)}</>;
};

export default AnimatedCounter;
