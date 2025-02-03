import React from "react";
import { NavLink } from "react-router";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLinkComponent: React.FC<NavLinkProps> = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive, isPending }) => 
        `text-lg ${
          isActive ? "font-bold text-white-700" : "font-extralight text-white-300"
        } ${isPending ? "text-red-500" : ""} transition-colors duration-300`}
    >
      {children}
    </NavLink>
  );
};

export default NavLinkComponent;
