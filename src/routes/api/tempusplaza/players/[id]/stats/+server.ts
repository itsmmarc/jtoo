// claude
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, fetch }) => {
        const { id } = params;

        // Only allow numeric IDs so this can't be used to hit arbitrary upstream paths
        if (!/^\d+$/.test(id)) {
                throw error(400, 'Invalid player ID');
        }

        const res = await fetch(`https://api.tempusplaza.com/players/${id}/stats`);

        if (!res.ok) {
                throw error(res.status, 'Upstream request failed');
        }

        const data: unknown = await res.json();

        return json(data, {
                headers: { 'Cache-Control': 'public, max-age=300' }
        });
};