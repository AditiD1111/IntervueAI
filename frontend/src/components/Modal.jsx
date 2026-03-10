import React from "react";

const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[400px] relative">

        <button
          className="absolute right-4 top-3"
          onClick={onClose}
        >
          ✕
        </button>

        {children}

      </div>

    </div>
  );
};

export default Modal;