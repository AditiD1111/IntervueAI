import React, { useState } from "react";

export default function Login({ setActive }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  return (
  <div className="w-full">
    <h2 className="text-xl font-semibold mb-2">Welcome Back</h2>
    <p className="text-sm text-gray-500 mb-8">
      Please enter your details to log in
    </p>

    <div className="space-y-6">

      {/* Email */}
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

      {/* Password */}
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
      
      <button className="w-full h-12 bg-black text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800">  
        LOGIN
      </button>
    </div>

    <p className="text-center text-sm mt-6">
      Don't have an account?{" "}
      <span
        className="text-blue-600 font-medium cursor-pointer"
        onClick={() => setActive("signup")}
      >
        Sign Up
      </span>
    </p>
  </div>
);

}
