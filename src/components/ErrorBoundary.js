import React from 'react';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (e) => {
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-red-600 mb-6">We're sorry, but an unexpected error occurred.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );  
  }

  return children;
}
