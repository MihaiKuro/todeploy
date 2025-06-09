import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Trash, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { useCategoryStore } from "../stores/useCategoryStore";

const CategoriesTab = () => {
	const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useCategoryStore();
	const [newCategory, setNewCategory] = useState({
		name: "",
		image: "",
	});
	const [newSubcategory, setNewSubcategory] = useState({
		name: "",
		image: "",
		parentCategory: "",
	});
	const [editingCategory, setEditingCategory] = useState(null);
	const [editingSubcategory, setEditingSubcategory] = useState(null);
	const [loading, setLoading] = useState(false);
	const [expandedCategories, setExpandedCategories] = useState({});

	// Fetch categories on component mount
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleImageChange = (e, isSubcategory = false) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				if (isSubcategory) {
					if (editingSubcategory) {
						setEditingSubcategory({ ...editingSubcategory, image: reader.result });
					} else {
						setNewSubcategory({ ...newSubcategory, image: reader.result });
					}
				} else {
					if (editingCategory) {
						setEditingCategory({ ...editingCategory, image: reader.result });
					} else {
						setNewCategory({ ...newCategory, image: reader.result });
					}
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e, isSubcategory = false, categoryIdForSub = null) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (isSubcategory) {
				if (editingSubcategory) {
					// Update existing subcategory
					const response = await axios.put(`/categories/${editingSubcategory.parentCategory}/subcategories/${editingSubcategory._id}`, {
						name: editingSubcategory.name,
						image: editingSubcategory.image !== editingSubcategory.imageUrl ? editingSubcategory.image : undefined,
					});
					updateSubcategory(editingSubcategory.parentCategory, response.data);
					setEditingSubcategory(null);
					toast.success("Subcategory updated successfully!");
				} else {
					// Create new subcategory
					const parentCategoryId = categoryIdForSub || newSubcategory.parentCategory;
					if (!parentCategoryId) {
						throw new Error("Parent category ID is missing for subcategory.");
					}
					const response = await axios.post(`/categories/${parentCategoryId}/subcategories`, newSubcategory);
					addSubcategory(parentCategoryId, response.data.subcategories.pop());
					setNewSubcategory({ name: "", image: "", parentCategory: "" });
					toast.success("Subcategory created successfully!");
				}
			} else {
				if (editingCategory) {
					// Update existing category
					const response = await axios.put(`/categories/${editingCategory._id}`, {
						name: editingCategory.name,
						image: editingCategory.image !== editingCategory.imageUrl ? editingCategory.image : undefined,
					});
					updateCategory(response.data);
					setEditingCategory(null);
					toast.success("Category updated successfully!");
				} else {
					// Create new category
					const response = await axios.post("/categories", newCategory);
					addCategory(response.data);
					setNewCategory({ name: "", image: "" });
					toast.success("Category created successfully!");
				}
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (categoryId, subcategoryId = null) => {
		if (!window.confirm("Are you sure you want to delete this item?")) return;
		
		try {
			if (subcategoryId) {
				await axios.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);
				deleteSubcategory(categoryId, subcategoryId);
				toast.success("Subcategory deleted successfully!");
			} else {
				await axios.delete(`/categories/${categoryId}`);
				deleteCategory(categoryId);
				toast.success("Category deleted successfully!");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete item");
		}
	};

	const startEditing = (item, isSubcategory = false) => {
		if (isSubcategory) {
			setEditingSubcategory({
				...item,
				image: item.image,
			});
		} else {
			setEditingCategory({
				...item,
				image: item.image,
			});
		}
	};

	const toggleCategory = (categoryId) => {
		setExpandedCategories(prev => ({
			...prev,
			[categoryId]: !prev[categoryId]
		}));
	};

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				{/* Category Form */}
				<motion.div
					className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className='text-2xl font-semibold mb-6 text-[#2B4EE6]'>
						{editingCategory ? "Edit Category" : "Create New Category"}
					</h2>

					<form onSubmit={(e) => handleSubmit(e, false)} className='space-y-6'>
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
								Category Name
							</label>
							<input
								type='text'
								id='name'
								value={editingCategory ? editingCategory.name : newCategory.name}
								onChange={(e) => {
									if (editingCategory) {
										setEditingCategory({ ...editingCategory, name: e.target.value });
									} else {
										setNewCategory({ ...newCategory, name: e.target.value });
									}
								}}
								className='mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-lg shadow-sm py-2.5
								px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2
								focus:ring-[#2B4EE6] focus:border-[#2B4EE6] transition-colors duration-200'
								required
							/>
						</div>

						<div className='mt-1 flex items-center'>
							<input
								type='file'
								id='image'
								className='sr-only'
								accept='image/*'
								onChange={(e) => handleImageChange(e, false)}
							/>
							<label
								htmlFor='image'
								className='cursor-pointer bg-gray-900/50 py-2.5 px-4 border border-gray-700 rounded-lg 
								shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-800/50 focus:outline-none 
								focus:ring-2 focus:ring-[#2B4EE6] focus:border-[#2B4EE6] transition-colors duration-200'
							>
								<Upload className='h-5 w-5 inline-block mr-2' />
								{editingCategory ? 'Change Image' : 'Upload Image'}
							</label>
							{((editingCategory && editingCategory.image) || newCategory.image) && (
								<span className='ml-3 text-sm text-gray-400 flex items-center'>
									<div className='w-2 h-2 bg-[#2B4EE6] rounded-full mr-2'></div>
									Image uploaded
								</span>
							)}
						</div>

						{/* Preview current image when editing */}
						{editingCategory && editingCategory.image && (
							<div className='mt-4'>
								<p className='text-sm text-gray-400 mb-2'>Current Image:</p>
								<img
									src={editingCategory.image}
									alt='Category preview'
									className='w-32 h-32 rounded-lg object-cover'
								/>
							</div>
						)}

						<div className='flex space-x-4'>
							<motion.button
								type='submit'
								className='flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg 
								shadow-lg text-sm font-medium text-white bg-[#2B4EE6] hover:bg-blue-600 
								focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B4EE6] disabled:opacity-50
								transition-colors duration-200'
								disabled={loading}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{loading ? (
									<>
										<Loader className='mr-2 h-5 w-5 animate-spin' />
										Loading...
									</>
								) : (
									<>
										{editingCategory ? (
											<Edit2 className='mr-2 h-5 w-5' />
										) : (
											<PlusCircle className='mr-2 h-5 w-5' />
										)}
										{editingCategory ? "Update Category" : "Create Category"}
									</>
								)}
							</motion.button>
							{editingCategory && (
								<motion.button
									type='button'
									onClick={() => setEditingCategory(null)}
									className='px-4 py-2.5 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700/50
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									Cancel
								</motion.button>
							)}
						</div>
					</form>
				</motion.div>

				{/* Categories List */}
				<motion.div
					className='bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-lg rounded-lg p-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<h2 className='text-2xl font-semibold mb-6 text-[#2B4EE6]'>Categories</h2>
					<div className='space-y-4'>
						{categories.map((category) => (
							<div key={category._id} className='bg-gray-900/50 rounded-lg p-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-3'>
										<button
											onClick={() => toggleCategory(category._id)}
											className='text-gray-400 hover:text-white'
										>
											{expandedCategories[category._id] ? (
												<ChevronDown className='h-5 w-5' />
											) : (
												<ChevronRight className='h-5 w-5' />
											)}
										</button>
										<img
											src={category.image}
											alt={category.name}
											className='w-12 h-12 rounded-lg object-cover'
										/>
										<span className='text-white font-medium'>{category.name}</span>
									</div>
									<div className='flex space-x-2'>
										<button
											onClick={() => startEditing(category)}
											className='p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg'
										>
											<Edit2 className='h-5 w-5' />
										</button>
										<button
											onClick={() => handleDelete(category._id)}
											className='p-2 text-gray-400 hover:text-red-500 hover:bg-gray-700/50 rounded-lg'
										>
											<Trash className='h-5 w-5' />
										</button>
									</div>
								</div>

								{/* Subcategories Section */}
								{expandedCategories[category._id] && (
									<div className='mt-4 pl-8'>
										{/* Subcategory Form */}
										<form onSubmit={(e) => handleSubmit(e, true, category._id)} className='mb-4'>
											<input type="hidden" name="parentCategory" value={category._id} onChange={(e) => setNewSubcategory({ ...newSubcategory, parentCategory: e.target.value })} />
											<div className='flex space-x-2'>
												<input
													type='text'
													placeholder='New subcategory name'
													value={newSubcategory.name}
													onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value, parentCategory: category._id })}
													className='flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white'
												/>
												<input
													type='file'
													id={`subcategory-image-${category._id}`}
													className='sr-only'
													accept='image/*'
													onChange={(e) => handleImageChange(e, true)}
												/>
												<label
													htmlFor={`subcategory-image-${category._id}`}
													className='cursor-pointer bg-gray-900/50 py-2 px-3 border border-gray-700 rounded-lg 
													text-sm text-gray-300 hover:bg-gray-800/50'
												>
													<Upload className='h-4 w-4 inline-block mr-1' />
													Image
												</label>
												<button
													type='submit'
													className='bg-[#2B4EE6] text-white px-4 py-2 rounded-lg hover:bg-blue-600'
												>
													Add
												</button>
											</div>
										</form>

										{/* Subcategories List */}
										<div className='space-y-2'>
											{category.subcategories?.map((subcategory) => (
												<div key={subcategory._id} className='flex items-center justify-between bg-gray-800/50 p-3 rounded-lg'>
													<div className='flex items-center space-x-3'>
														<img
															src={subcategory.image}
															alt={subcategory.name}
															className='w-10 h-10 rounded-lg object-cover'
														/>
														<span className='text-gray-300'>{subcategory.name}</span>
													</div>
													<div className='flex space-x-2'>
														<button
															onClick={() => startEditing(subcategory, true)}
															className='p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg'
														>
															<Edit2 className='h-4 w-4' />
														</button>
														<button
															onClick={() => handleDelete(category._id, subcategory._id)}
															className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-700/50 rounded-lg'
														>
															<Trash className='h-4 w-4' />
														</button>
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default CategoriesTab; 