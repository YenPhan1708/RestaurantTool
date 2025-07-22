export default function HeroSection() {
    return (
        <section className="bg-[url('/assets/hero.jpg')] bg-cover bg-center h-[80vh] flex items-center justify-center text-white">
            <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-4">Welcome to FoodZero</h2>
                <p className="text-lg mb-6">Fresh, healthy, and delicious meals crafted with love.</p>
                <a href="/menu" className="btn bg-[#ff7f50] text-white px-6 py-3 rounded-lg font-semibold">Explore Menu</a>
            </div>
        </section>
    );
}