"use client";

export default function TestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    🎉 Deployment Test
                </h1>
                <p className="text-gray-600 mb-6">
                    If you can see this page with proper styling, your Vercel deployment is working!
                </p>
                <div className="space-y-4">
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                        ✅ Next.js: Working
                    </div>
                    <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
                        ✅ Tailwind CSS: Working
                    </div>
                    <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
                        ✅ TypeScript: Working
                    </div>
                </div>
                <button 
                    onClick={() => window.location.href = '/login'}
                    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Go to Login Page
                </button>
            </div>
        </div>
    );
}