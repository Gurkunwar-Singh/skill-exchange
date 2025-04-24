import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/mainNavbar";

const ProfileCreation = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const availableSkills = [
        "Web Development",
        "Graphic Design",
        "Writing",
        "Marketing",
        "Data Analysis",
    ];

    const handleSkillToggle = (skill) => {
        setSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

    const sendOtp = async () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await axios.post("http://localhost:5000/api/send-otp", { email });
            setOtpSent(true);
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndCreateProfile = async () => {
        if (!otp) {
            setError("Please enter the OTP.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post("/api/verify-otp", { email, otp });
            await axios.post("/api/create-profile", {
                name,
                email,
                bio,
                skills,
            });
            navigate("/dashboard");
        } catch (err) {
            setError("Profile creation failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainNavbar />
            <main className="bg-white min-h-screen py-8 px-4 max-w-md mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Profile</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            required
                        />
                        <textarea
                            placeholder="Short Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                            rows="3"
                            required
                        />
                    </div>

                    <h2 className="text-sm font-semibold mt-5 mb-2">Select Skills</h2>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {availableSkills.map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => handleSkillToggle(skill)}
                                className={`p-2 text-xs font-medium rounded border transition ${
                                    skills.includes(skill)
                                        ? "bg-orange-500 text-white border-orange-500"
                                        : "bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>

                    {!otpSent ? (
                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-70"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    ) : (
                        <div className="mt-4 space-y-2">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                required
                            />
                            <button
                                onClick={verifyOtpAndCreateProfile}
                                disabled={loading}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-70"
                            >
                                {loading ? "Creating..." : "Create Profile"}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default ProfileCreation;