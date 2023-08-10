import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApiRoutes, Routes } from '../../../common/enums/api-routes';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { IFeedback } from '../../../common/types/feedback';
import withRole from '@/hocs/withRole';
import { Roles } from '../../../common/enums/roles';

const CreateFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFeedback>();

  const createFeedback = async (data: IFeedback) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(uniteApiRoutes([ApiRoutes.FEEDBACKS]), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Error creating feedback');
      }
      toast.success('Feedback created successfully');
      router.push(uniteRoutes([Routes.ROOT]));
    } catch (error) {
      setError('Error creating feedback');
      console.error('Error creating feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-4">
      <h1 className="text-4xl font-bold mb-4">Create Feedback</h1>
      <form onSubmit={handleSubmit(createFeedback)} className="space-y-4">
        <div>
          <label htmlFor="order_id" className="block mb-2">
            Order ID
          </label>
          <input
            type="number"
            {...register('order_id', { required: true })}
            placeholder="Order ID"
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
          {errors.order_id && <p className="text-red-600">Order ID is required</p>}
        </div>

        <div>
          <label htmlFor="profile_id" className="block mb-2">
            Profile ID
          </label>
          <input
            type="number"
            {...register('profile_id', { required: true })}
            placeholder="Profile ID"
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
          {errors.profile_id && <p className="text-red-600">Profile ID is required</p>}
        </div>

        <div>
          <label htmlFor="rating" className="block mb-2">
            Rating
          </label>
          <input
            type="number"
            {...register('rating', { required: true, min: 1, max: 5 })}
            placeholder="Rating (1-5)"
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
          />
          {errors.rating && <p className="text-red-600">Rating is required and must be between 1 and 5</p>}
        </div>

        <div>
          <label htmlFor="comment" className="block mb-2">
            Comment
          </label>
          <textarea
            {...register('comment', { required: true })}
            placeholder="Comment"
            className="border-2 border-gray-300 px-4 py-2 rounded w-full"
            rows={4}
          ></textarea>
          {errors.comment && <p className="text-red-600">Comment is required</p>}
        </div>

        <button type="submit" className="bg-blue-500 text-white font-bold px-6 py-2 rounded hover:bg-blue-600">
          Create Feedback
        </button>
        {isLoading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default withRole(CreateFeedback, [Roles.CUSTOMER]);
