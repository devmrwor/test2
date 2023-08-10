import { clientAuth } from '@/services/clientAuth';
import { uniteRoutes, uniteApiRoutes } from '@/utils/uniteRoute';
import { useRouter } from 'next/router';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ClientRoutes, ApiRoutes } from '../../common/enums/api-routes';
import { IUser } from '../../common/types/user';
import { IProfile } from '../../common/types/profile';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { ProfileLanguages } from '../../common/enums/profile-languages';
import { SortOrders } from '../../common/enums/sort-order';
import { ICategory } from '../../common/types/category';
import { IPaginationResponse } from '../../common/types/pagination-response';
import { CategoryFilter } from '../../common/enums/category-filter';
import { Roles } from '../../common/enums/roles';
interface ClientContextValue {
  showSocialMedia: boolean;
  setShowSocialMedia: Dispatch<SetStateAction<boolean>>;
  isEmailVerificationOpen: boolean;
  setIsEmailVerificationOpen: Dispatch<SetStateAction<boolean>>;
  showProfilePreview: boolean;
  setShowProfilePreview: Dispatch<SetStateAction<boolean>>;
  userData: any;
  setUserData: Dispatch<SetStateAction<any>>;
  refetchUserData: () => Promise<void>;
  orderData: any;
  setOrderData: Dispatch<SetStateAction<any>>;
  isEmailVerified: boolean;
  serverUserData: any;
  setServerUserData: Dispatch<SetStateAction<any>>;
  confirmDocuments: boolean;
  setConfirmDocuments: Dispatch<SetStateAction<boolean>>;
  fillProfile: boolean;
  setFillProfile: Dispatch<SetStateAction<boolean>>;
  createProfile: (data: IProfile) => Promise<void>;
  updateProfile: (data: IProfile) => Promise<void>;
  getAllCategories: (page: string, limit: string) => Promise<IPaginationResponse<ICategory>>;
  getUserById: (id: string) => Promise<void>;
  getUserTypeFromLocalStorage: () => void;
  userType: string;
  setUserType: Dispatch<SetStateAction<string>>;
  filters: any;
  setFilters: Dispatch<SetStateAction<any>>;
  isFiltersLoaded: boolean;
  setIsFiltersLoaded: Dispatch<SetStateAction<boolean>>;
  emailToVerify: string;
  setEmailToVerify: Dispatch<SetStateAction<string>>;
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined);

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider = ({ children }: ClientProviderProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [showSocialMedia, setShowSocialMedia] = useState<boolean>(false);
  const [isEmailVerificationOpen, setIsEmailVerificationOpen] = useState<boolean>(false);
  const [showProfilePreview, setShowProfilePreview] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({});
  const [serverUserData, setServerUserData] = useState<any>({});
  const [orderData, setOrderData] = useState<any>({});
  const [confirmDocuments, setConfirmDocuments] = useState<boolean>(false);
  const [fillProfile, setFillProfile] = useState<boolean>(false);
  const [userType, setUserType] = useState<string>(Roles.CUSTOMER);
  const [filters, setFilters] = useState(null);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState<boolean>(false);
  const [emailToVerify, setEmailToVerify] = useState<string>('');
  const { t } = useTranslation();

  const isEmailVerified = useMemo(() => userData.is_email_verified, [userData]);

  const refetchUserData = async () => {
    try {
      const data = await clientAuth();
      if (data) {
        setUserData(data);
        setServerUserData(data);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        router.replace(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.LOGIN]));
        return;
      }
      if (error instanceof Error) {
        console.error('An error occurred:', error.message);
        return;
      }
    }
  };

  const createProfile = async (data: IProfile) => {
    try {
      const body = JSON.stringify({
        ...data,
        profile_language: (data.language as string) || ProfileLanguages.ENGLISH,
      });

      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiRoutes.MY]), {
        method: 'POST',
        body,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Error creating profile');
      }
      toast.success(t('profile_created_successfully'));
      refetchUserData();
    } catch (error) {
      toast.error(t('error_creating_profile'));
      console.error('Error creating profile:', error);
    }
  };

  const updateProfile = async (data: IProfile) => {
    try {
      const body = JSON.stringify(data);

      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiRoutes.MY, id as string]), {
        method: 'PUT',
        body,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Error updating profile');
      }
      toast.success(t('profile_updated_successfully'));
      router.push(uniteRoutes([ClientRoutes.CLIENT, ClientRoutes.EXECUTOR]));
      refetchUserData();
    } catch (error) {
      toast.error(t('error_updating_profile'));
      console.error('Error updating profile:', error);
    }
  };

  const getAllCategories = async (
    page: number,
    limit: number,
    filter: CategoryFilter,
    searchText: string = '',
    folderView: boolean = true,
    sortField: string,
    sortOrder?: SortOrders
  ): Promise<IPaginationResponse<ICategory>> => {
    const url = new URL(uniteApiRoutes([ApiRoutes.CATEGORIES, ApiRoutes.PUBLIC]));

    const params: Record<string, string | undefined> = {
      page: page.toString(),
      limit: limit.toString(),
      filter,
      searchText,
      folderView: folderView.toString(),
      sortOrder,
      sortField,
    };

    Object.keys(params).forEach((key) => params[key] && url.searchParams.append(key, params[key]));

    const categoriesRes = await fetch(url.toString());

    if (!categoriesRes.ok) throw new Error('Error fetching data');

    const categoriesData = await categoriesRes.json();

    return categoriesData;
  };

  const getUserById = async (id: string) => {
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.PROFILES, ApiRoutes.PUBLIC, id]));
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Something went wrong with getting user data');
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserTypeFromLocalStorage = () => {
    try {
      const storedUserType = localStorage.getItem('userType');
      setUserType(storedUserType ?? Roles.CUSTOMER);
    } catch (error) {
      console.error('Error retrieving user type from local storage:', error);
    }
  };

  useEffect(() => {
    getUserTypeFromLocalStorage();
  }, []);

  // const OnlineStatus = () => {
  //   const [isOnline, setIsOnline] = useState(false);
  // socket.on('user_status', (data) => {
  //   setIsOnline(data.isOnline);
  // });

  // useEffect(() => {
  //   if (!serverUserData) return;

  //   const socketInitializer = async () => {
  //     await fetch(uniteApiRoutes([ApiRoutes.SOCKET]));
  //     socket = io();

  //     console.log('serverUserData');

  //     socket.on('connect', () => {
  //       console.log('connected');
  //     });

  //     socket.emit('user_online', { userId: serverUserData.id });

  //     socket.emit('user_status', {
  //       userId: serverUserData.id,
  //     });

  //     socket.on('is_online', (data) => {
  //       console.log('sockets', data);
  //     });
  //   };

  //   socketInitializer();

  //   return () => {
  //     // socket.emit('user_offline', { userId: serverUserData.id });
  //   };
  // }, [serverUserData]);

  const contextValue = {
    showSocialMedia,
    setShowSocialMedia,
    isEmailVerificationOpen,
    setIsEmailVerificationOpen,
    showProfilePreview,
    setShowProfilePreview,
    userData,
    setUserData,
    refetchUserData,
    orderData,
    setOrderData,
    isEmailVerified,
    serverUserData,
    setServerUserData,
    confirmDocuments,
    setConfirmDocuments,
    fillProfile,
    setFillProfile,
    createProfile,
    getAllCategories,
    updateProfile,
    getUserById,
    getUserTypeFromLocalStorage,
    userType,
    setUserType,
    filters,
    setFilters,
    isFiltersLoaded,
    setIsFiltersLoaded,
    emailToVerify,
    setEmailToVerify,
    // confirmEmail,
    // setConfirmEmail,
  };

  return <ClientContext.Provider value={contextValue}>{children}</ClientContext.Provider>;
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }

  return context;
};
