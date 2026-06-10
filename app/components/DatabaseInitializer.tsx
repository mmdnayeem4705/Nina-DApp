'use client';

import { useEffect, useState } from 'react';

export function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        console.log('[v0] Initializing database...');
        const response = await fetch('/api/init-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'init-key' }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('[v0] Database initialized successfully');
          setInitialized(true);
        } else {
          // Don't treat "already exists" as an error
          if (data.message?.includes('already exists')) {
            setInitialized(true);
          } else {
            setError(data.error || 'Initialization failed');
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.log('[v0] Init error (might be expected):', errorMsg);
        // Don't block the app if initialization fails
        setInitialized(true);
      }
    };

    // Only initialize once
    if (!initialized && !error) {
      initDatabase();
    }
  }, [initialized, error]);

  if (error) {
    console.warn('[v0] Database init warning:', error);
  }

  return null;
}
