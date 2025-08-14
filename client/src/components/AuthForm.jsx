import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Find this line at the top:

// And CHANGE it to:
import api from '../api/axiosConfig';

// Then, find the API call inside handleSubmit()
// const { data } = await axios.post(...)
// And CHANGE it to:
const { data } = await api.post(url, payload);
const API_BASE_URL = "http://localhost:3000/api/v1";

const AuthForm = ({ isSignIn }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isSignIn && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        const url = isSignIn ? `${API_BASE_URL}/users/signin` : `${API_BASE_URL}/users/signup`;
        const payload = isSignIn
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const { data } = await axios.post(url, payload);
            localStorage.setItem("token", data.token);
            toast.success(`Successfully ${isSignIn ? 'signed in' : 'signed up'}!`);
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
                <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            )}
            <Input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            {!isSignIn && (
                <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
                {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Sign Up')}
            </button>
            {isSignIn && (
                 <a href="#" className="block text-center text-sm text-blue-600 hover:underline">Forgot Password?</a>
            )}
        </form>
    );
};

// Simple reusable Input component
const Input = (props) => (
    <input
        {...props}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
);

export default AuthForm;