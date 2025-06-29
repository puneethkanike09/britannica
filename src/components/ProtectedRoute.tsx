import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
    children,
}: {
    children: React.ReactNode;
    redirectTo?: string;
}) => {
    const {  isInitialized } = useAuth();

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;