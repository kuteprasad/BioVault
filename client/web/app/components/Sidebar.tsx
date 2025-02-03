import React from "react";
import NavLinkComponent from "./NavLinkComponent";

const Sidebar: React.FC = () => {
  return (
    <nav className="flex flex-col items-start gap-4 p-6 bg-gray-100 dark:bg-gray-800 h-full w-64">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white ">BioVault</h2>
      <ul className="space-y-2">
        <li>
          <NavLinkComponent to="/">View Vaults</NavLinkComponent>
        </li>
        <li>
          <NavLinkComponent to="/update-profile">Update Profile</NavLinkComponent>
        </li>
        <li>
          <NavLinkComponent to="/settings">Settings</NavLinkComponent>
        </li>
        <li>
          <NavLinkComponent to="/import-passwords">Import Passwords</NavLinkComponent>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
