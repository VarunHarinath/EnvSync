import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/Toast';

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-5 py-7 lg:px-10 lg:py-9">
          <div className="mx-auto w-full max-w-6xl"><Outlet /></div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
