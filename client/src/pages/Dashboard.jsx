import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DashboardUI from '../components/DashboardUI';
import api from '../api/axiosConfig';

const Dashboard = () => {
    console.log("1. Component is rendering..."); // Log #1
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            console.log("3. Fetching data..."); // Log #3
            const response = await api.get('/account/dashboard');
            console.log("4. Data received:", response.data); // Log #4
            setData(response.data);
        } catch (error) {
            console.error("5. API call failed:", error); // Log #5
        } finally {
            console.log("6. Fetch complete, setting loading to false."); // Log #6
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("2. Current state:", { loading, data }); // Log #2

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