import Link from "next/link";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-500">404</h1>
        <p className="text-2xl text-gray-700 mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          href="/"
        >
          Go Back Home
        </Link>
        <div className="mt-10">
          <img
            src="/error-illustration.svg" // Replace this with your image
            alt="Page not found illustration"
            className="w-1/2 mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
