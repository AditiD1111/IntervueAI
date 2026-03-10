import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen 
      bg-gradient-to-b 
      from-[oklch(39.8%_0.07_227.392)] 
      via-[oklch(29.3%_0.066_243.157)] 
      to-[oklch(28.2%_0.091_267.935)]">
    
      
      <div className="flex justify-between items-center px-8 py-4 bg-transparent">
        
        <h1 className="text-3xl font-bold tracking-wide text-[oklch(75%_0.105_223.128)]"> InterVue </h1>

        <div className="flex items-center gap-3 cursor-pointer">

          
          <img
            src={`https://randomuser.me/api/portraits/women/${Math.floor(Math.random()*90)}.jpg`}
            alt="profile"
            className="w-10 h-10 rounded-full"
          />

          <div className="text-sm leading-tight">
            <p className="text-xl font-semibold text-white">
              Aarchi
            </p>
            
            <button className="text-red-500 text-sm font-medium hover:text-red-400 transition cursor-pointer">
              Logout
            </button>

          </div>

        </div>

      </div>

      
      <div>{children}</div>

    </div>
  );
};

export default DashboardLayout;

