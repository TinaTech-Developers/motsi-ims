"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/error");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return { isLoading };
};

export default useAuth;
