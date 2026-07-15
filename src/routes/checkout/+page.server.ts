import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    stripePublicKey: env.PUBLIC_STRIPE_PUBLISHABLE_KEY || env.STRIPE_PUBLIC_KEY || ''
  };
};
