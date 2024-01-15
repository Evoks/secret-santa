import Group from "../types/Group";

const GroupService = {
	async get(groupId: string) {
		console.log("GET GROUP DATA", groupId)
		const access_token = localStorage.getItem('access_token');
		const response = await fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}?access_token=${access_token}`);
		const data = await response.json();
		if (!response.ok) {
			throw new Response('Group not found', { status: 404 });
		}
		return data.data || null;
	},

	async update(groupId: string, updatedGroup: Group) {
		const accessToken = localStorage.getItem('access_token');
		await fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}?access_token=${accessToken}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(updatedGroup)
		});
	},
	
	async getAllGroupsFromAuthUser() {
		console.log("GET GROUPS DATA")
		const access_token = localStorage.getItem('access_token');
		const response = await fetch(`${process.env.REACT_APP_API_URL}/group/user?access_token=${access_token}`);
		const data = await response.json();
		if (!response.ok || !data.success) {
			throw new Response('Group not found', { status: 404 });
		}
		return data.data || null;
	}
}

export default GroupService;