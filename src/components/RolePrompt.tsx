import React from 'react';

interface RolePromptProps {
  roleId: 'mafia' | 'detective' | 'doctor' | 'innocent';
  title: string;
  subtitle: string;
  instruction: string;
}

export const RolePrompt: React.FC<RolePromptProps> = ({
  roleId,
  title,
  subtitle,
  instruction
}) => {
  const roleIcons = {
    mafia: (
      <div className="w-14 h-14 mx-auto rounded-full bg-[#3d0d15] border-2 border-[#c59b27] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(197,155,39,0.3)]">
        🗡️
      </div>
    ),
    detective: (
      <div className="w-14 h-14 mx-auto rounded-full bg-[#182030] border-2 border-[#c59b27] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(197,155,39,0.3)]">
        🔍
      </div>
    ),
    doctor: (
      <div className="w-14 h-14 mx-auto rounded-full bg-[#132c1c] border-2 border-[#c59b27] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(197,155,39,0.3)]">
        🏺
      </div>
    ),
    innocent: (
      <div className="w-14 h-14 mx-auto rounded-full bg-[#271a12] border-2 border-[#c59b27] flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(197,155,39,0.3)]">
        ⚖️
      </div>
    )
  };

  return (
    <div className="text-center py-2 px-3">
      {roleIcons[roleId]}
      
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#f5d77f] tracking-wide mt-3 mb-1">
        {title}
      </h2>

      <p className="text-xs sm:text-sm text-[#c7b095] italic font-serif max-w-sm mx-auto">
        {subtitle}
      </p>

      <div className="mt-3 py-1.5 px-3 bg-[#1e130c] border border-[#c59b27]/40 rounded-sm inline-block">
        <p className="text-xs sm:text-sm font-semibold text-[#ede3ce] tracking-wide">
          {instruction}
        </p>
      </div>
    </div>
  );
};
