import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				setAnalyticsData(response.data.analyticsData);
				setDailySalesData(response.data.dailySalesData);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[400px] text-gray-400">
				Loading analytics...
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
				<AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-[#2B4EE6] to-blue-900'
				/>
				<AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-[#2B4EE6] to-indigo-900'
				/>
				<AnalyticsCard
					title='Total Sales'
					value={analyticsData.totalSales.toLocaleString()}
					icon={ShoppingCart}
					color='from-[#2B4EE6] to-blue-900'
				/>
				<AnalyticsCard
					title='Total Revenue'
					value={`${analyticsData.totalRevenue.toLocaleString()} ron`}
					icon={DollarSign}
					color='from-[#2B4EE6] to-indigo-900'
				/>
			</div>
			<motion.div
				className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
				<ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='name' stroke='#9CA3AF' />
						<YAxis yAxisId='left' stroke='#9CA3AF' />
						<YAxis yAxisId='right' orientation='right' stroke='#9CA3AF' />
						<Tooltip 
							contentStyle={{ 
								backgroundColor: '#1F2937', 
								border: '1px solid #374151',
								borderRadius: '0.5rem'
							}}
							labelStyle={{ color: '#9CA3AF' }}
							itemStyle={{ color: '#E5E7EB' }}
						/>
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#2B4EE6'
							strokeWidth={2}
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#60A5FA'
							strokeWidth={2}
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-lg overflow-hidden relative'
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-[#2B4EE6] text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-white text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
		<div className='absolute -bottom-4 -right-4 text-[#2B4EE6] opacity-20'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
