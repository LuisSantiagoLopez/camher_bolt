import React from "react";

interface Props {
  title: string;
  toggle: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export default function ToggleButton({ title, toggle, className, onChange }: Props) {
  const handleToggle = () => {
    onChange(!toggle);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <p className="px-10">{title}</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          onChange={handleToggle}
          checked={toggle}
        />
        <div
          className={`w-11 h-6 bg-gray-200 ${
            toggle ? "bg-orange-600 peer-checked:after:translate-x-full" : ""
          } peer-focus:outline-none peer-focus:ring-4  dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600`}
        ></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
      </label>
      {toggle ? <p>Sí</p> : <p>No</p>}
    </div>
  );
};