import { getProfile } from "@/services/profiles";
import { getUser } from "@/services/users";
import { useRouter } from "next/router";
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext } from "react";
import { useQuery } from "react-query";
import { IProfile } from "../../common/types/profile";
import { IUser } from "../../common/types/user";

interface UsersContextValue {
  user: IUser | undefined;
  userError: Error | null;
  isUserLoading: boolean;
  username: string;
}

const UsersContext = createContext<UsersContextValue | undefined>(undefined);

export const UsersProvider = ({ children }) => {
  const router = useRouter();
  const { userRole, userId } = router.query;

  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery<IUser, Error>(["userData"], () => getUser((userId as string) || "1"), {
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const username = !user ? "Loading..." : user.name;

  const contextValue = {
    user,
    userError,
    isUserLoading,
    username,
  };

  return <UsersContext.Provider value={contextValue}>{children}</UsersContext.Provider>;
};

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }

  return context;
};
