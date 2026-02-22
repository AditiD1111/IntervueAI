import { useState } from "react";
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export default function AuthModal({ type, onClose }) {
  const [active, setActive] = useState(type);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="relative w-[440px] bg-white text-black rounded-2xl shadow-2xl p-10 transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Dynamic Content */}
        {active === "login" ? (
          <Login setActive={setActive} />
        ) : (
          <Signup setActive={setActive} />
        )}

      </div>
    </div>
  );
}
