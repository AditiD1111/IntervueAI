import React from "react";

const SummaryCard = ({
  role,
  topics,
  experience,
  questions,
  updated,
  color
}) => {

  const initials = role
    .split(" ")
    .map(word => word[0])
    .join("");

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 shadow hover:shadow-x1 cursor-pointer transition transform hover:scale-[1.02]">

      <div className="rounded-lg p-4 flex items-center gap-4" style={{ background: color }}>

        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center font-bold">
          {initials}
        </div>

        <div>
          <h2 className="font-semibold text-lg">{role}</h2>
          <p className="text-sm text-gray-500">{topics}</p>
        </div>

      </div>

      <div className="flex gap-3 mt-4 text-xs flex-wrap">

        <span className="border px-3 py-1 rounded-full">
          Experience: {experience}
        </span>

        <span className="border px-3 py-1 rounded-full">
          {questions} Q&A
        </span>

        <span className="border px-3 py-1 rounded-full">
          Last Updated: {updated}
        </span>

      </div>

      <p className="text-sm text-gray-500 mt-3">
        Preparing for {role} roles
      </p>

    </div>
  );
};

export default SummaryCard;