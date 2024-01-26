import Group from "../types/Group";
import { storage } from "../utils/storage";

const GroupService = {
	async get(groupId: string) {
		const accessToken = storage.getItem('access_token');
		if (accessToken === null) {
			throw new Error('Access token not found');
		}
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/group/${groupId}?access_token=${accessToken}`);
			const data = await response.json();
			if (!response.ok) {
				throw new Response('Group not found', { status: 404 });
			}
			return data.data || null;
		} catch (e) {
			throw new Response('Error', { status: 404 });
		}
	},

	async update(groupId: string, updatedGroup: Group) {
		const accessToken = storage.getItem('access_token');
		if (accessToken === null) {
			throw new Error('Access token not found');
		}
		try {
			await fetch(`${import.meta.env.VITE_APP_API_URL}/group/${groupId}?access_token=${accessToken}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updatedGroup)
			});
		} catch (e) {
			throw new Response('Error', { status: 404 });
		}
	},

	async getAllGroupsFromAuthUser() {
		const accessToken = storage.getItem('access_token');
		if (accessToken === null) {
			throw new Error('Access token not found');
		}
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/group/user?access_token=${accessToken}`);
			const data = await response.json();
			if (!response.ok || !data.success) {
				throw new Response('Group not found', { status: 404 });
			}
			return data.data || null;
		} catch (e) {
			throw new Response('Error', { status: 404 });
		}
	}
}

export default GroupService;