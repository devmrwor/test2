import privateRoute from "@/hocs/privateRoute";
import { uniteApiRoutes, uniteRoutes } from "@/utils/uniteRoute";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ApiRoutes, ApiUsersRoutes, Routes } from "../../../common/enums/api-routes";
import { Roles } from "../../../common/enums/roles";
import { IUser } from "../../../common/types/user";

interface UpdateUserProps {
  session: Session;
}

const UpdateUser = ({
  session: {
    user: { id },
  },
}: UpdateUserProps) => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUser>();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const response = await fetch(uniteApiRoutes([ApiRoutes.USERS, ApiUsersRoutes.ME]));
        if (!response.ok) {
          throw new Error("Error fetching user");
        }
        const data = await response.json();
        setUser(data);
        setValue("role", data.role);
        setValue("name", data.name);
        setValue("phone", data.phone);
        setValue("photo", data.photo);
        setValue("email", data.email);
        setValue("address", data.address);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Error fetching user");
      }
    };

    fetchUser();
  }, [id, setValue]);

  const updateUser = async (data: IUser) => {
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.USERS, ApiUsersRoutes.ME]), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error updating user");
      }
      toast.success("User updated successfully");
      router.push(uniteRoutes([Routes.ROOT]));
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 pb-4">
      <h1 className="text-4xl font-bold mb-4">Update User</h1>
      {user && (
        <form onSubmit={handleSubmit(updateUser)} className="space-y-4">
          <div>
            <label htmlFor="role" className="block mb-2">
              Role
            </label>
            <select
              {...register("role", { required: true })}
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            >
              {Object.values(Roles).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-red-600">Role is required</p>}
          </div>

          <div>
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="User Name"
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            />
            {errors.name && <p className="text-red-600">Name is required</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2">
              Phone
            </label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="Phone Number"
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            />
            {errors.phone && <p className="text-red-600">Phone is required</p>}
          </div>

          <div>
            <label htmlFor="photo" className="block mb-2">
              Photo URL
            </label>
            <input
              type="text"
              {...register("photo")}
              placeholder="Photo URL"
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Email Address"
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            />
            {errors.email && <p className="text-red-600">Email is required</p>}
          </div>

          <div>
            <label htmlFor="address" className="block mb-2">
              Address
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="Address"
              className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            />
            {errors.address && <p className="text-red-600">Address is required</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold px-6 py-2 rounded hover:bg-blue-600"
          >
            Update User
          </button>
        </form>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default privateRoute(UpdateUser);
