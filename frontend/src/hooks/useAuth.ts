import { useGetMeQuery } from "@/services/customer/getMe";

export const useAuth = () => {
  const { data, isLoading } = useGetMeQuery();

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
  };
};
