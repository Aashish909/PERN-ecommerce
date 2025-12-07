import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const NavbarDropdown = ({ title, items, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all group"
      >
        {Icon && <Icon size={16} />}
        <span>{title}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-2xl z-50 animate-fade-in-down">
          <div className="p-2">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarDropdown;

