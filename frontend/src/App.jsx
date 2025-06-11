import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfileLayout from "./components/ProfileLayout";
import ProfileDashboardPage from "./pages/ProfileDashboardPage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import ProfileAddressesPage from "./pages/ProfileAddressesPage";
import ProfileOrdersPage from "./pages/ProfileOrdersPage";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen flex flex-col bg-[#0B0F17] text-white'>
			{/* Navigation background */}
			<div className='absolute top-0 left-0 right-0 h-32 bg-[#2B4EE6] z-0' />

			{/* Main content */}
			<div className='relative z-10'>
				<Navbar />
				<div className='pt-20'>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/categories' element={<CategoriesPage />} />
						<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
						<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
						<Route path='/product/:id' element={<ProductDetailPage />} />
						
						{/* Profile Routes */}
						<Route path="/profile" element={user ? <ProfileLayout /> : <Navigate to="/login" />}>
							<Route index element={<ProfileDashboardPage />} />
							<Route path="details" element={<ProfileDetailsPage />} />
							<Route path="addresses" element={<ProfileAddressesPage />} />
							<Route path="orders" element={<ProfileOrdersPage />} />
							<Route path="vehicles" element={<div>Vehiculele Mele</div>} />
							<Route path="appointments" element={<div>Programări Service</div>} />
							<Route path="wishlist" element={<div>Favorite</div>} />
						</Route>

						<Route
							path='/secret-dashboard'
							element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
						/>
						<Route path='/category/:category' element={<CategoryPage />} />
						<Route path='/category/:category/:subcategory' element={<SubcategoryPage />} />
						<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
						<Route
							path='/purchase-success'
							element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
						/>
						<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
					</Routes>
				</div>
			</div>

			{/* Footer */}
			<div className='mt-auto'>
				<Footer />
			</div>
			<Toaster />
		</div>
	);
}

export default App;
