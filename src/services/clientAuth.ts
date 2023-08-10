import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../common/enums/api-routes';

export async function clientAuth(): Promise<any> {
  const url = uniteApiRoutes([ApiRoutes.USERS, ApiRoutes.ME]);

  const clientAuthRes = await fetch(url);

  if (clientAuthRes.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!clientAuthRes.ok) {
    throw new Error('Request failed');
  }

  const clientAuthData = await clientAuthRes.json();

  return clientAuthData;
}
