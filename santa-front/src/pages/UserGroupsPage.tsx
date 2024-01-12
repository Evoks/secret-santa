import { lazy } from 'react';
import { LoaderFunction, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import UserGroups from '../containers/userGroups/_UserGroups';
const Title = lazy(() => import('../components/Title'));

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
	const authUserId = params.authUserId;
	const access_token = localStorage.getItem('access_token');
	const response = await fetch(`${process.env.REACT_APP_API_URL}/group/user?access_token=${access_token}&authUserId=${authUserId}`);
	const data = await response.json();
	console.log(data);
	if (!response.ok || !data.success) {
		throw new Response('Group not found', { status: 404 });
	}
	return { groups: data.data };
};

const UserGroupsPage: React.FC = () => {
	const data: any = useLoaderData();


	if (!data.groups || data.groups.length === 0) {
		return <Title title={"⚠️ Vous n'appartenez pas encore à un groupe"} />;
	}

	return (
		<>
			<Title title={"Groupes accessibles"}/>
			<UserGroups groups={data.groups} />
		</>
	);
}

export default UserGroupsPage;
