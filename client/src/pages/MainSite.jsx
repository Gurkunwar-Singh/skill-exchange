import { useState, useEffect } from "react";
import axios from "axios";
import MainNavbar from "../components/mainNavbar";

const MainSite = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseUrl =  import.meta.env.VITE_PROD_BASE_URL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${baseUrl}/api/user`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                setUser(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <p className="text-gray-600 text-lg">Loading user data...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );

    return (
        <>
            <MainNavbar />
            <main className="bg-slate-50 text-gray-800 min-h-screen py-20 px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
                {/* Welcome Section */}
                <section className="mb-16">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-orange-600">
                        Welcome, {user?.name || "Guest"}!
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-700 max-w-3xl">
                        This platform empowers freelancers to exchange skills, collaborate on meaningful projects,
                        and grow their professional network. Whether you're here to offer your expertise or learn something
                        new — this is the place to connect and grow.
                    </p>
                </section>

                {/* Why Use This Platform */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-orange-500 mb-4">Why Use This Platform?</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-base">
                        <li>Collaborate with professionals across industries.</li>
                        <li>Skill exchange system — no money involved.</li>
                        <li>Build your portfolio with real-world impact.</li>
                        <li>Secure, transparent, and community-driven environment.</li>
                    </ul>
                </section>

                {/* How It Works */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-orange-500 mb-4">How It Works</h2>
                    <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
                        Create a profile showcasing your skills, browse opportunities posted by other freelancers, and start
                        collaborating. You can offer your services in exchange for others’ time or expertise, building
                        valuable experience along the way.
                    </p>
                </section>

                {/* Help Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-orange-500 mb-4">Need Help?</h2>
                    <p className="text-base text-gray-700 mb-4">
                        Have questions or facing issues? Our support team is here to assist you.
                    </p>
                    <button className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 font-medium">
                        Contact Support
                    </button>
                </section>
            </main>
        </>
    );
};

export default MainSite;
