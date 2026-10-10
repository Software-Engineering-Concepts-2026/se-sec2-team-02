'use client';

import React from 'react';
import Header from '@/components/Header';
import ProfileView from '@/components/ProfileView';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-zinc-900">
      <Header currentView="profile" />

      <main className="flex-1 pb-16">
        <ProfileView />
      </main>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}
