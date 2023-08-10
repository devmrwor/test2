import withRole from "@/hocs/withRole";
import { uniteApiRoutes, uniteRoutes } from "@/utils/uniteRoute";
import { NextPage } from "next";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ApiRoutes, AuthRoutes, Routes } from "../../../common/enums/api-routes";
import { Roles } from "../../../common/enums/roles";
import { ICategory } from "../../../common/types/category";
import Link from "next/link";
import { useRouter } from "next/router";
import { IUser } from "../../../common/types/user";
import { IProfile } from "../../../common/types/profile";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface AdminPageProps {
  categories: ICategory[];
  profiles: IProfile[];
  session: Session;
}

const AdminPage: NextPage<AdminPageProps> = ({
  categories: serverCategories,
  profiles: serverProfiles,
  session: { user },
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [categories, setCategories] = useState<ICategory[]>(serverCategories);
  const [categoryError, setCategoryError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICategory>();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(uniteApiRoutes([ApiRoutes.USERS]));
    const users = await response.json();
    setUsers(users);
  };

  const deleteUser = async (id: number) => {
    const response = await fetch(uniteApiRoutes([ApiRoutes.USERS, id]), {
      method: "DELETE",
    });
    if (response.ok) {
      setUsers(users.filter((user: IUser) => user.id !== id));
    } else {
      console.error("Error deleting user");
    }
  };

  const onSubmit: SubmitHandler<ICategory> = async (data) => {
    setIsLoading(true);
    setCategoryError("");
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES]), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      reset();
    } catch (error) {
      console.error(error);
      error instanceof Error
        ? setCategoryError(error.message)
        : setCategoryError("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES, id]), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the category.");
      }
      setCategories(categories.filter((category) => category.id !== +id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pb-4">
      <header className="flex justify-between items-center py-4 mb-8 border-b-2 border-gray-200">
        <div>
          <span className="text-xl font-bold">{user.email}</span>
          <span className="ml-4 text-lg font-semibold text-gray-600">{user.role}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: uniteRoutes([Routes.AUTH, AuthRoutes.LOGIN]) })}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded"
        >
          Sign Out
        </button>
      </header>
      <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
      <p className="mb-8">This is a protected admin page.</p>
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      {categories && (
        <ul className="mb-8">
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center mb-4">
              <Link href={uniteRoutes([Routes.CATEGORIES, category.id])}>{category.name}</Link>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded mr-2"
                  onClick={() => router.push(uniteRoutes([Routes.CATEGORIES, category.id]))}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
                  onClick={() => deleteCategory(category.id.toString())}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h2 className="text-2xl font-semibold mb-4">Create a New Category</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("name", { required: true })}
          placeholder="New Category Name"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />
        {errors.name && <p className="text-red-500">Category name is required.</p>}

        <input
          type="number"
          {...register("sort_order", { required: true })}
          placeholder="Sort Order"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />

        <input
          type="text"
          {...register("images", { required: true })}
          placeholder="Images (comma-separated URLs)"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />

        <input
          type="text"
          {...register("status", { required: true })}
          placeholder="Status (visible or not)"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />

        <input
          type="number"
          {...register("parent_id")}
          placeholder="Parent Category ID"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />

        <input
          type="text"
          {...register("meta_tags", { required: true })}
          placeholder="Meta Tags (comma-separated)"
          className="border-2 border-gray-300 px-4 py-2 rounded mb-4 w-full"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded disabled:opacity-50"
        >
          Create Category
        </button>
      </form>
      {categoryError && <p className="text-red-500">{categoryError}</p>}
      <h2 className="text-3xl font-semibold mt-8 mb-4">Users:</h2>
      <ul className="space-y-2">
        {users.map((user: IUser) => (
          <li key={user.id} className="flex justify-between items-center">
            <div>
              <span className="text-xl font-semibold">{user.name}</span> ({user.email}) - Role:
              {user.role}
            </div>

            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
              onClick={() => deleteUser(user.id as number)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-3xl font-semibold mt-8 mb-4">Profiles:</h2>
      <ul className="space-y-2">
        {serverProfiles.map((profile) => (
          <li key={profile.id} className="flex justify-between items-center">
            <div>
              <span className="text-xl font-semibold">{profile.name}</span> ({profile.email})
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded mr-2"
                onClick={() => router.push(uniteRoutes([Routes.PROFILES, profile.id]))}
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const categoriesRes = await fetch(uniteApiRoutes([ApiRoutes.CATEGORIES]));
    const profilesRes = await fetch(uniteApiRoutes([ApiRoutes.PROFILES]));

    if (!categoriesRes.ok || !profilesRes.ok) throw new Error("Error fetching data");

    const categories = await categoriesRes.json();
    const profiles = await profilesRes.json();

    return {
      props: {
        categories,
        profiles,
      },
    };
  } catch (error) {
    console.log(getErrorMessage(error));
    return {
      props: { categories: null, profiles: null },
    };
  }
}

const requiredRoles = [Roles.ADMIN];

export default withRole<AdminPageProps>(AdminPage, requiredRoles);
