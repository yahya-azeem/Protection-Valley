export const prerender = false;

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
  const token = cookies.get('authToken');
  if (!token) {
    throw error(404, 'Not Found');
  }

  try {
    const res = await fetch('/api/v1/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw error(404, 'Not Found');
    }

    const user = await res.json();
    if (user.role !== 'admin') {
      throw error(404, 'Not Found');
    }

    return {
      user
    };
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    throw error(404, 'Not Found');
  }
};
