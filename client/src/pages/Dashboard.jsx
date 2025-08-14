import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import DashboardUI from '../components/DashboardUI';

const API_BASE_URL = "http://localhost:3000/api/v1";

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE_URL}/account/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div>
            <Header name={data?.name} />
            <main className="p-4 md:p-8">
                {data && <DashboardUI data={data} onTransferSuccess={fetchData} />}
            </main>
        </div>
    );
};

export default Dashboard;