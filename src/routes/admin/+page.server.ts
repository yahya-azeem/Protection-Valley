import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
  const isAdmin = cookies.get('isAdmin') === 'true';
  if (!isAdmin) {
    throw error(404, 'Not Found');
  }
};
