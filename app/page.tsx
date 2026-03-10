export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    🎓 Gyan Setu
                </h1>
                <p className="text-gray-600 mb-6">
                    AI-Powered Learning Platform
                </p>
                <div className="space-y-4">
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                        ✅ Deployment: Working
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
                        ✅ Tailwind CSS: Working
                    </div>
                    <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
                        ✅ Next.js: Working
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <a 
                        href="/login"
                        className="block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go to Login
                    </a>
                    <a 
                        href="/dashboard"
                        className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}