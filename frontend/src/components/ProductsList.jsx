import { motion } from "framer-motion";
import { Trash, Star, ChevronUp, ChevronDown, Search, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const [sortConfig, setSortConfig] = useState({
		key: null,
		direction: 'ascending'
	});
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	// Filter products by search query first
	const filteredProducts = products.filter(product => 
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Then sort the filtered products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		if (!sortConfig.key) return 0;
		
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];

		if (sortConfig.key === 'isFeatured') {
			return sortConfig.direction === 'ascending' 
				? (aValue === bValue ? 0 : aValue ? -1 : 1)
				: (aValue === bValue ? 0 : aValue ? 1 : -1);
		}

		if (typeof aValue === 'string') {
			return sortConfig.direction === 'ascending' 
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}

		return sortConfig.direction === 'ascending' 
			? aValue - bValue
			: bValue - aValue;
	});

	const requestSort = (key) => {
		setSortConfig((prevConfig) => ({
			key,
			direction: 
				prevConfig.key === key && prevConfig.direction === 'ascending'
					? 'descending'
					: 'ascending',
		}));
	};

	const SortIndicator = ({ columnKey }) => {
		if (sortConfig.key !== columnKey) return null;
		return sortConfig.direction === 'ascending' ? (
			<ChevronUp className="inline h-4 w-4 ml-1" />
		) : (
			<ChevronDown className="inline h-4 w-4 ml-1" />
		);
	};

	const renderSortableHeader = (label, key) => (
		<th
			scope='col'
			className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white'
			onClick={() => requestSort(key)}
		>
			<span className="flex items-center">
				{label}
				<SortIndicator columnKey={key} />
			</span>
		</th>
	);

	const handleSearchClick = (e) => {
		e.stopPropagation();
		setIsSearching(true);
	};

	const handleSearchClose = () => {
		setIsSearching(false);
		setSearchQuery('');
	};

	const renderProductHeader = () => (
		<th
			scope='col'
			className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
		>
			{isSearching ? (
				<div className="flex items-center gap-2">
					<Search className="h-4 w-4 text-gray-400" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search products..."
						className="bg-gray-900/50 text-white text-sm rounded-md px-2 py-1 w-48 
						focus:outline-none focus:ring-2 focus:ring-[#2B4EE6] border border-gray-700"
						autoFocus
					/>
					<button
						onClick={handleSearchClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			) : (
				<div 
					className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
					onClick={handleSearchClick}
				>
					<Search className="h-4 w-4" />
					<span>Product</span>
				</div>
			)}
		</th>
	);

	return (
		<motion.div
			className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-900/50'>
						<tr>
							{renderProductHeader()}
							<th
								scope='col'
								className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Price
							</th>
							{renderSortableHeader('Category', 'category')}
							<th
								scope='col'
								className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Subcategory
							</th>
							{renderSortableHeader('Stock', 'stock')}
							{renderSortableHeader('Featured', 'isFeatured')}
							<th
								scope='col'
								className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700 bg-transparent'>
						{sortedProducts?.map((product) => (
							<motion.tr
								key={product._id}
								className='hover:bg-gray-700/30 transition-colors duration-200'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								layout
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='h-12 w-12 flex-shrink-0'>
											<img
												className='h-12 w-12 rounded-lg object-cover'
												src={product.image}
												alt={product.name}
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-white'>{product.name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-[#2B4EE6] font-semibold'>{product.price} ron</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{product.category.name}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>
										{product.subcategory ? product.subcategory.name : 'N/A'}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
										{product.stock}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium
										transition-colors duration-200 ${
											product.isFeatured
												? "bg-[#2B4EE6]/20 text-[#2B4EE6] hover:bg-[#2B4EE6]/30"
												: "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
										}`}
									>
										<Star
											className={`h-4 w-4 mr-1 ${
												product.isFeatured ? "fill-[#2B4EE6]" : "fill-none"
											}`}
										/>
										{product.isFeatured ? "Featured" : "Regular"}
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<motion.button
										onClick={() => deleteProduct(product._id)}
										className='inline-flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium
										bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors duration-200'
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Trash className='h-4 w-4 mr-1' />
										Delete
									</motion.button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default ProductsList;
