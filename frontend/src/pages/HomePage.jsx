import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  
  { href: "/evacuari-sport", name: "Evacuări Sport", imageUrl: "/1.jpeg" },
  { href: "/suspensii-sport", name: "Suspensii Sport", imageUrl: "/2.jpeg" },
  { href: "/frane-performanta", name: "Frâne Performanță", imageUrl: "/3.jpeg" },
  { href: "/admisii-filtre-aer", name: "Admisii & Filtre Aer", imageUrl: "/4.jpeg" },
  { href: "/jante-aliaj", name: "Jante Aliaj", imageUrl: "/5.jpeg" },
  { href: "/kituri-caroserie", name: "Kituri Caroserie", imageUrl: "/6.jpeg" }, 
  { href: "/volane-sport", name: "Volane Sport", imageUrl: "/7.jpeg" },
  { href: "/scaune-sport", name: "Scaune Sport", imageUrl: "/8.jpeg" },
  
  
  { href: "/piese-motor", name: "Componente Motor", imageUrl: "/9.jpeg" }, 
  { href: "/sistem-franare", name: "Sistem Frânare", imageUrl: "/10.jpeg" }, 
  { href: "/suspensie-directie", name: "Suspensie & Direcție", imageUrl: "/11.jpeg" }, 
  { href: "/electrice-auto", name: "Electrice Auto", imageUrl: "/12.jpeg" }, 
  { href: "/uleiuri-fluide", name: "Uleiuri & Fluide", imageUrl: "/13.jpeg" },
  

  { href: "/accesorii-interior", name: "Accesorii Interior", imageUrl: "/14.jpeg" }, 
  { href: "/accesorii-exterior", name: "Accesorii Exterior", imageUrl: "/15.jpeg" }, 
  { href: "/intretinere-curatare", name: "Întreținere & Curățare", imageUrl: "/16.jpeg" }
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Midnight Racers' performance shop
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover our wide range of car parts and accessories, designed to enhance your vehicle's performance and style
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;
