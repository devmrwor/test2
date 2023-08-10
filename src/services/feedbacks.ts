import { uniteApiRoutes } from "@/utils/uniteRoute";
import { ApiRoutes, FeedbackRoutes } from "../../common/enums/api-routes";
import { IFeedback } from "../../common/types/feedback";
import { IPaginationResponse } from "../../common/types/pagination-response";

export async function getFeedbacks(
  page: number,
  limit: number,
  feedbackType: FeedbackRoutes,
  userId: string
): Promise<IPaginationResponse<IFeedback>> {
  const url = new URL(uniteApiRoutes([ApiRoutes.FEEDBACKS]));

  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
    feedbackType,
    userId,
  };

  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const categoriesRes = await fetch(url.toString());

  if (!categoriesRes.ok) throw new Error("Error fetching data");

  const categoriesData = await categoriesRes.json();

  return categoriesData;
}
