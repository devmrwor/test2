import withRole from '@/hocs/withRole';
import { uniteApiRoutes, uniteRoutes } from '@/utils/uniteRoute';
import { useState, useEffect } from 'react';
import { ApiFeedbacksRoutes, ApiRoutes } from '../../../common/enums/api-routes';
import { Roles } from '../../../common/enums/roles';
import { IFeedback } from '../../../common/types/feedback';

const AllFeedback = () => {
  const [feedbackList, setFeedbackList] = useState<IFeedback[] | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(uniteApiRoutes([ApiRoutes.FEEDBACKS, ApiFeedbacksRoutes.ME]));
        const data = await response.json();
        setFeedbackList(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  if (!feedbackList) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 pb-4">
      <h1 className="text-4xl font-bold mb-4">All Feedback</h1>
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Profile ID</th>
            <th className="px-4 py-2">Rating</th>
            <th className="px-4 py-2">Comment</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback, index) => (
            <tr key={feedback.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="border px-4 py-2">{feedback.id}</td>
              <td className="border px-4 py-2">{feedback.order_id}</td>
              <td className="border px-4 py-2">{feedback.user_id}</td>
              <td className="border px-4 py-2">{feedback.profile_id}</td>
              <td className="border px-4 py-2">{feedback.rating}</td>
              <td className="border px-4 py-2">{feedback.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withRole(AllFeedback, [Roles.CUSTOMER]);
