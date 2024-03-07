import { useAuth } from "../contexts/AuthContext";

const hasAuthToken = () => {
  const { auth } = useAuth();
  return !!auth.token;
};

export default hasAuthToken;
