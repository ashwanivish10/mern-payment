import { useNavigate } from "react-router-dom";

const Header = ({ name }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Payments App</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Hello, {name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;