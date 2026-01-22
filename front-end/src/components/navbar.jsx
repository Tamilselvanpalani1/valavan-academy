import React, { useState } from "react";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navOptions = [
    {
      Courses: ["Web Development", "Data Science", "UI/UX Design"],
    },
    {
      Resources: ["Student Works", "Student Testimonials", "Blog"],
    },
    "About",
    "Community",
    "Contact Us",
  ];

  const toggleDropdown = (title) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  return (
    <nav className="mx-auto max-w-7xl p-6 lg:px-8 md:flex justify-between items-center">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <img src="/src/assets/logo.png" alt="website logo" />

        {/* Mobile toggle */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Nav Options */}
      <ul
        className={`
          flex flex-col gap-3 mt-6
          md:flex-row md:justify-around md:mt-0
          ${menuOpen ? "block" : "hidden"} md:flex w-full lg:w-[60%]
        `}
      >
        {navOptions.map((option, index) => {
          if (typeof option === "string") {
            return (
              <li
                key={index}
                className="cursor-pointer hover:text-blue-600 pb-1 md:pb-0 border-b-1 md:border-0"
              >
                <a href="#">{option}</a>
              </li>
            );
          }

          const [title, items] = Object.entries(option)[0];
          const isOpen = openDropdown === title;

          return (
            <li key={index} className="relative group">
              {/* Title */}
              <div
                className="flex justify-between items-center cursor-pointer hover:text-blue-600 pb-1 md:pb-0 border-b-1 md:border-0"
                onClick={() => toggleDropdown(title)}
              >
                {title}
                <FaChevronDown
                  className={`ml-2 transition-transform duration-300
                    ${isOpen ? "rotate-180" : ""}
                    md:group-hover:rotate-180
                  `}
                />
              </div>

              {/* Dropdown */}
              <ul
                className={`
                  md:bg-white md:shadow-lg md:rounded-md mt-2
                  md:absolute md:top-full md:left-0 md:w-48
                  ${isOpen ? "block" : "hidden"}
                  md:group-hover:block
                `}
              >
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="p-2 hover:bg-gray-100 "
                  >
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      {/* Admin Button */}
      <div className="mt-6 md:mt-0">
        { menuOpen && <button className="btn btn-primary w-full md:w-auto md:hidden">
          Admin
        </button>}
         <button className="btn btn-primary w-full md:w-auto hidden md:block">
          Admin
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
