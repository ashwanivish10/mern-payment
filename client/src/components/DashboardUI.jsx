import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = "http://localhost:3000/api/v1";

const DashboardUI = ({ data, onTransferSuccess }) => {
    const [toUpi, setToUpi] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (parseFloat(amount) <= 0) {
            toast.error("Amount must be positive.");
            setLoading(false);
            return;
        }
        
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_BASE_URL}/account/transfer`,
                { to: toUpi, amount: Number(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Transfer successful!");
            onTransferSuccess(); // Refresh dashboard data
            setToUpi('');
            setAmount('');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Transfer failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Balance & Send Money */}
            <div className="md:col-span-1 space-y-6">
                <InfoCard title="Your UPI ID" content={data.upiId} />
                <InfoCard title="Your Balance" content={`₹ ${data.balance.toFixed(2)}`} isBalance />
                <SendMoneyForm
                    toUpi={toUpi}
                    setToUpi={setToUpi}
                    amount={amount}
                    setAmount={setAmount}
                    handleTransfer={handleTransfer}
                    loading={loading}
                />
            </div>

            {/* Right Column: Transaction History */}
            <div className="md:col-span-2">
                <TransactionHistory history={data.history} currentUserUpi={data.upiId} />
            </div>
        </div>
    );
};

// Sub-components for better organization

const InfoCard = ({ title, content, isBalance = false }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className={`mt-1 font-semibold ${isBalance ? 'text-3xl text-gray-800' : 'text-lg text-blue-600'}`}>{content}</p>
    </div>
);

const SendMoneyForm = ({ toUpi, setToUpi, amount, setAmount, handleTransfer, loading }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Send Money</h3>
        <form onSubmit={handleTransfer} className="space-y-4">
            <input
                type="text"
                placeholder="Recipient UPI ID"
                value={toUpi}
                onChange={(e) => setToUpi(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
            />
            <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg"
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
            >
                {loading ? 'Sending...' : 'Send Money'}
            </button>
        </form>
    </div>
);

const TransactionHistory = ({ history }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((tx, index) => (
                <TransactionItem key={index} tx={tx} />
            ))}
        </div>
    </div>
);

const TransactionItem = ({ tx }) => {
    const isSent = tx.type === 'Sent';
    return (
        <div className="flex justify-between items-center border-b pb-2">
            <div>
                <p className="font-semibold">{isSent ? 'Sent to' : 'Received from'}: {tx.partyUpiId}</p>
                <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className={`font-bold ${isSent ? 'text-red-500' : 'text-green-500'}`}>
                    {isSent ? '-' : '+'} ₹{tx.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Balance: ₹{tx.balanceAfter.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default DashboardUI;