import React from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import SummaryCard from "../components/cards/SummaryCard";
import { LuPlus } from "react-icons/lu";

const Dashboard = () => {

  const sessions = [
    {
      role: "Programmer Analyst",
      topics: "Python, SQL, AWS",
      experience: "3 Years",
      questions: 20,
      updated: "26th Jun 2025",
      color: "#e8b7c0"
    },
    {
      role: "AI Engineer",
      topics: "Python, R, Jupyter, Docker",
      experience: "1 Year",
      questions: 10,
      updated: "26th Jun 2025",
      color: "#8bb3d9"
    },
    {
      role: "Full Stack Developer",
      topics: "MERN Stack",
      experience: "3 Years",
      questions: 10,
      updated: "26th Jun 2025",
      color: "#f2b567"
    },
    {
      role: "Database Administrator",
      topics: "SQL, PostgreSQL, NoSQL",
      experience: "1 Year",
      questions: 20,
      updated: "26th Jun 2025",
      color: "#74b7a5"
    },
    {
      role: "Data Scientist",
      topics: "Python, R, Tensorflow",
      experience: "1 Year",
      questions: 10,
      updated: "26th Jun 2025",
      color: "#c692c2"
    },
    {
      role: "Backend Developer",
      topics: "MongoDB, NodeJS, ExpressJS, SQL",
      experience: "3 Years",
      questions: 10,
      updated: "26th Jun 2025",
      color: "#e57373"
    },
    {
      role: "Frontend Developer",
      topics: "CSS, HTML, JavaScript, React",
      experience: "1 Year",
      questions: 20,
      updated: "26th Jun 2025",
      color: "#7fb9d4"
    }
  ];

  return (
    <DashboardLayout>

      <div className="container mx-auto pt-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {sessions.map((item, index) => (
            <SummaryCard
              key={index}
              role={item.role}
              topics={item.topics}
              experience={item.experience}
              questions={item.questions}
              updated={item.updated}
              color={item.color}
            />
          ))}

        </div>

        <button className="fixed bottom-16 right-10 flex items-center gap-2 bg-pink-800 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-900">
          <LuPlus size={20}/>
          Add New
        </button>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;