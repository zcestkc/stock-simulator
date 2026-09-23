'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 border rounded-lg shadow-md w-64">
      <h2 className="text-xl font-semibold">Counter: {count}</h2>
      <div className="flex space-x-2">
        <Button onClick={() => setCount(count - 1)}>Decrement</Button>
        <Button onClick={() => setCount(0)} variant="outline">
          Reset
        </Button>
        <Button onClick={() => setCount(count + 1)}>Increment</Button>
      </div>
    </div>
  );
}
