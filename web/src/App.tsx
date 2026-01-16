import { Link, Outlet, useNavigate } from "react-router";



const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = (): void => {
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      {/* Logo */}
      <Link to="/" className="text-blue-600 font-semibold text-2xl">
        Logger
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {false ? (
          <>
            {/* User Icon */}
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold cursor-pointer"
              aria-label="User profile"
            >
              U
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-white border-gray-200 text-center text-sm text-gray-500 py-3">
      © {new Date().getFullYear()} Logger. Built with ❤️ and 🧠.
    </footer>
  );
};

export default function App(){
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
