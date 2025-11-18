import React from 'react';

const FirebaseConfigWarning: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl bg-white p-8 rounded-lg shadow-lg border-2 border-red-300">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Firebase Configuration Needed</h1>
        <p className="text-slate-700 mb-4">
          It looks like you haven't configured your Firebase credentials yet. To use this app, you need to add your project's configuration to the <code className="bg-slate-200 p-1 rounded text-sm font-mono">firebaseConfig.ts</code> file.
        </p>
        <div className="bg-slate-100 p-4 rounded-lg text-sm space-y-2 border border-slate-200">
          <p className="font-semibold text-slate-800">Follow these steps:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-600">
            <li>Go to your Firebase project console: <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.firebase.google.com</a></li>
            <li>In your project settings, find the "Your apps" section.</li>
            <li>Under "SDK setup and configuration", select the "Config" option.</li>
            <li>Copy the configuration object.</li>
            <li>Paste it into the <code className="bg-slate-200 p-1 rounded text-sm font-mono">firebaseConfig.ts</code> file in your project, replacing the placeholder values.</li>
          </ol>
        </div>
        <p className="text-xs text-slate-500 mt-4">
          The app will start working automatically once the correct configuration is provided. You may need to refresh the page.
        </p>
      </div>
    </div>
  );
};

export default FirebaseConfigWarning;
