import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[oklch(39.8%_0.07_227.392)] via-[oklch(29.3%_0.066_243.157)] to-[oklch(28.2%_0.091_267.935)]">
      
      <header className="flex items-center justify-between px-8 py-5 bg-transparent">
        <h1 className="text-3xl font-bold text-[oklch(75%_0.105_223.128)]">InterVue</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 border border-[oklch(52%_0.105_223.128)] rounded-md hover:bg-[oklch(52%_0.105_223.128)] hover:text-black transition">
            Login
          </button>
          <button className="px-4 py-2 bg-[oklch(50%_0.134_242.749)] rounded-md hover:bg-[oklch(44.3%_0.11_240.79)] transition">
            Sign Up
          </button>
        </div>
      </header>

     
      <section className="flex flex-col items-center text-center px-6 py-28">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Prepare Smart.&nbsp;Crack Interviews.
        </h2>
        <p className="max-w-3xl mb-6 text-[oklch(65%_0.105_223.128)]">
          Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way.
        </p>
        <p className="max-w-3xl mb-10 text-[oklch(65%_0.105_223.128)]">
          From preparation to mastery — your ultimate interview toolkit is here.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-lg font-medium bg-[oklch(50%_0.134_242.749)] hover:bg-[oklch(44.3%_0.11_240.79)] transition">
            Get Started
          </button>
          
        </div>
      </section>

    
      <section className="max-w-6xl mx-auto px-6 py-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl p-6 text-center bg-[oklch(39.1%_0.09_240.876)] border border-[oklch(45%_0.085_224.283)] backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2"> Structured Prep</h3>
          <p className="text-sm text-[oklch(52%_0.105_223.128)]">
            Follow a guided roadmap covering aptitude, DSA, and CS fundamentals.
          </p>
        </div>
        <div className="rounded-xl p-6 text-center bg-[oklch(39.1%_0.09_240.876)] border border-[oklch(45%_0.085_224.283)] backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2">Coding Practice</h3>
          <p className="text-sm text-[oklch(52%_0.105_223.128)]">
            Solve interview-level coding problems with clear explanations.
          </p>
        </div>
        <div className="rounded-xl p-6 text-center bg-[oklch(39.1%_0.09_240.876)] border border-[oklch(45%_0.085_224.283)] backdrop-blur-sm">
          <h3 className="text-xl font-semibold mb-2"> Interview Ready</h3>
          <p className="text-sm text-[oklch(52%_0.105_223.128)]">
            Get role-specific questions, expand answers, and master concepts with confidence.
          </p>
        </div>
      </section>

      
    </div>
  );
}
