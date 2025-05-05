import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/button";
import { AdminPinDialog } from "./AdminPinDialog";
import LogoImg from "@/assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useTournament();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Points Table", path: "/points-table" },
    { name: "Result", path: "/matches" },
    { name: "Teams", path: "/teams" },
    { name: "Scorer's Desk", path: "/admin" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAdmin = () => {
    setIsAdmin(!isAdmin);
  };

  const handleAdminClick = () => {
    if (!isAdmin) {
      setShowPinDialog(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={LogoImg} alt="MPL Logo" className="h-14 w-14 mr-2" />
            <div className="font-bold text-2xl text-cricket-primary">
              <span className="text-cricket-accent">MPL</span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-cricket-primary ${
                  location.pathname === link.path
                    ? "text-cricket-primary"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="outline"
              onClick={handleAdminClick}
              className={
                isAdmin
                  ? "bg-cricket-primary text-white hover:bg-cricket-primary/90"
                  : ""
              }
            >
              {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-cricket-primary ${
                    location.pathname === link.path
                      ? "text-cricket-primary"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                variant="outline"
                onClick={handleAdminClick}
                className={
                  isAdmin
                    ? "bg-cricket-primary text-white hover:bg-cricket-primary/90"
                    : ""
                }
              >
                {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
              </Button>
            </div>
          </nav>
        )}
      </div>
      <AdminPinDialog
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onSuccess={() => setIsAdmin(true)}
      />
    </header>
  );
};

export default Navbar;
