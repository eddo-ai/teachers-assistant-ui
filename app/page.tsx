'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { MyAssistant } from "@/components/MyAssistant";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return (
    <main className="h-dvh flex items-center justify-center">
      <div>Loading...</div>
    </main>
  );

  if (error) return (
    <main className="h-dvh flex items-center justify-center">
      <div>{error.message}</div>
    </main>
  );

  if (user) {
    return (
      <main className="h-dvh">
        <MyAssistant />
      </main>
    );
  }

  return (
    <main className="h-dvh flex items-center justify-center">
      <a href="/api/auth/login" className="text-blue-600 hover:text-blue-800 underline">
        Login
      </a>
    </main>
  );
}
