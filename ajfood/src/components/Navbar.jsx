import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";
import { showSuccessToast } from "../utils/toastMessage";
import { useRole } from "../utils/useRole";
import useCart from "../utils/useCart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { role, setRole, setUserEmail, username, userId, setUserId, setUsername } = useRole();
  const { cartItemCount } = useCart(userId);
  const navigate = useNavigate();

  const checkAdmin = () => {
    setIsAdmin(role === "admin");
  };

  const user = () => {
    if (localStorage.getItem("token")) {
      setIsUserLogin(true);
      setLoginUser(username);
    } else {
      setIsUserLogin(false);
      setLoginUser("");
    }
  };

  useEffect(() => {
    user();
    checkAdmin();
  }, [role, username]);

  const handleLogoutButton = () => {
    localStorage.clear();
    setRole(null);
    setUsername(null);
    setUserId(null);
    setUserEmail(null);
    showSuccessToast("Logout Successfully");
    setIsUserLogin(false);
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
   navigate(`/search?query=${searchQuery}`)
   setIsOpen(false)
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <Link
          to="/"
          className="flex items-center text-2xl font-bold text-red-500"
        >
          <MdOutlineFastfood className="mr-2 text-3xl" /> AJFood
        </Link>

        {/* Search Bar - Hidden on mobile, visible on md+ */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 mx-4 max-w-md"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded-r-lg hover:bg-red-600"
          >
            <FaSearch />
          </button>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 text-lg font-medium">
            <li>
              <Link to="/" className="hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:text-red-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-red-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:text-red-500">
                FAQs
              </Link>
            </li>
          </ul>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-red-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isUserLogin ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="focus:outline-none hover:text-red-500 flex items-center gap-1"
              >
                <FaUserCircle className="text-2xl text-inherit" />
                <span className="text-inherit font-serif">{loginUser}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/order"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/order-manager"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Order Manager
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/add-product"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Add Product
                    </Link>
                  )}
                  <button
                    onClick={handleLogoutButton}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 text-gray-700 hover:text-red-500"
            >
              <FaUserCircle className="text-2xl" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white w-full py-4 border-t">
          <form
            onSubmit={handleSearch}
            className="flex items-center px-4 mb-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-500 text-white p-2 rounded-r-lg hover:bg-red-600"
            >
              <FaSearch />
            </button>
          </form>

          <ul className="text-center space-y-4">
            <li>
              <Link to="/" className="block py-2 hover:text-red-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="block py-2 hover:text-red-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="block py-2 hover:text-red-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="block py-2 hover:text-red-500">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/cart" className="block py-2 hover:text-red-500">
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </li>
            <li>
              <Link to="/profile" className="block py-2 hover:text-red-500">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/order" className="block py-2 hover:text-red-500">
                Orders
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/order-manager"
                  className="block py-2 hover:text-red-500"
                >
                  Order Manager
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/add-product"
                  className="block py-2 hover:text-red-500"
                >
                  Add Product
                </Link>
              </li>
            )}
            {isUserLogin && (
              <li>
                <button
                  onClick={handleLogoutButton}
                  className="block w-full py-2 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            )}
            {!isUserLogin && (
              <li>
                <Link to="/login" className="block py-2 hover:text-red-500">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;