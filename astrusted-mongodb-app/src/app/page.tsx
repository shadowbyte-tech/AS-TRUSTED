import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">AS Trusted Consultancy</h1>
          <p className="mt-2 text-lg text-gray-600">Premium Real Estate Services</p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login to Dashboard
          </Link>
          
          <Link
            href="/api/test-db"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Test Database Connection
          </Link>
        </div>

        <div className="text-sm text-gray-500 text-center">
          <p> New MongoDB-Ready Application</p>
          <p> Fixed Authentication System</p>
          <p> Secure Password Storage</p>
        </div>
      </div>
    </div>
  );
}
