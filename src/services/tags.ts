import { SortOrders } from '../../common/enums/sort-orders';
import { uniteApiRoutes } from '@/utils/uniteRoute';
import { ApiRoutes } from '../../common/enums/api-routes';

export async function getCategoryTagsById(id: string) {
	// FIXME: replace with API filter
	try {
		const res = await getTags(0, 1000);
		const tags = {};
		res.rows
			.filter(el => id && String(el.category_id) === String(id))
			.map(el => el.tags?.map(tag => {
				tags[tag] = 1
			}));
		return Object.keys(tags);
	} catch (err) {
		console.error('getCategoryTagsById', err);
	}

	return [];
}

export async function getTags(page: number, limit: number, searchText: string = '', sortOrder?: SortOrders) {
	const url = new URL(uniteApiRoutes([ApiRoutes.TAGS]));

	const params: Record<string, string> = {
		page: page.toString(),
		limit: limit.toString(),
		searchText,
		sortOrder: sortOrder ?? 'null',
	};

	Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

	const tagsRes = await fetch(url.toString());

	if (!tagsRes.ok) throw new Error('Error fetching data');

	const tagsData = await tagsRes.json();

	return tagsData;
}

export async function saveTags(data: {}) {
	const url = new URL(uniteApiRoutes([ApiRoutes.TAGS]));

	const method = data.id ? 'PUT' : 'POST';

	const tagsRes = await fetch(url.toString(), {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!tagsRes.ok) throw new Error('Error saving data');

	const tagsData = await tagsRes.json();

	return tagsData;
}

export async function removeTags(id) {
	const url = new URL(uniteApiRoutes([ApiRoutes.TAGS]));

	const tagsRes = await fetch(url.toString(), {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id }),
	});

	if (!tagsRes.ok) throw new Error('Error deleting data');

	const tagsData = await tagsRes.json();

	return tagsData;
}
