import { useState, useCallback } from 'react';
import { FILTERS } from '@/lib/constants';

export function useFilters() {
  const [activeFilter, setActiveFilter] = useState('none');

  const applyFilter = useCallback((context: CanvasRenderingContext2D) => {
    const filter = FILTERS.find(f => f.id === activeFilter);
    if (!filter || filter.id === 'none') return;

    const imageData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    const data = imageData.data;

    switch (filter.id) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = (r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = (r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = (r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      case 'bright':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2);
          data[i + 1] = Math.min(255, data[i + 1] * 1.2);
          data[i + 2] = Math.min(255, data[i + 2] * 1.2);
        }
        break;
    }

    context.putImageData(imageData, 0, 0);
  }, [activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    applyFilter
  };
}
