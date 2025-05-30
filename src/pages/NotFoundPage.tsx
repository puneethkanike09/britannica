import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-textColor px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-red">404</h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-4 sm:mb-6">Page Not Found</h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-center">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg  hover:bg-hover   text-sm sm:text-base"
            >
                Go to Home
            </Link>
        </div>
    );
}

export default NotFoundPage;