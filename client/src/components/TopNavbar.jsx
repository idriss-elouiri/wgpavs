import { useSelector } from "react-redux";

const TopNavbar = ({ onMenuClick }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md">
      {/* Mobile Menu Button */}
      <button
        className="text-indigo-600 text-xl sm:text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded p-1"
        onClick={onMenuClick}
        aria-label="Open Menu"
      >
        ☰
      </button>
      
      <div className="flex items-center gap-2 sm:gap-5">
        <h1 className="text-sm sm:text-base md:text-lg font-medium truncate max-w-[150px] sm:max-w-none">
          {currentUser.name}
        </h1>
        <div className="relative">
          {currentUser.profilePicture ? (
            <img 
              src={currentUser.profilePicture} 
              alt={currentUser.name} 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;