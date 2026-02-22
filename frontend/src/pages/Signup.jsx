import React, { useState } from "react";

export default function Signup({ setActive }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Create an Account</h2>
      <p className="text-sm text-gray-500 mb-8">
        Join us today by entering your details below
      </p>

      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
          <span className="text-3xl text-pink-600">👤</span>
        </div>
      </div>

    <div className="space-y-6">

      <div>
        <label className="block text-sm font-medium mb-2">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Naina"
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="naina@example.com"
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Min 8 Characters"
          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="w-full h-12 bg-black text-white rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800">  
        SIGN UP
      </button>
    </div>
  </div>

  );
}
