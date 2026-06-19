import { Suspense } from 'react';

export default function BrowseLayout({ children }) {
  return <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: '#f6f1ea' }} />}>
    {children}
  </Suspense>;
}