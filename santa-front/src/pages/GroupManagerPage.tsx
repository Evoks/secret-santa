import { lazy } from 'react';
import { LoaderFunction, LoaderFunctionArgs, useLoaderData } from "react-router-dom";
const GroupManager = lazy(() => import('../containers/groupManager/_GroupManager'));
const Title = lazy(() => import('../components/Title'));

export const loader: LoaderFunction = async ({ params }: LoaderFunctionArgs) => {
	const groupId = params.id; // Access the 'id' route parameter
	const response = await fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}`);
	const data = await response.json();
	if (!response.ok) {
		throw new Response('Group not found', { status: 404 });
	}
	return { group: data.data };
};

const ManageGroup: React.FC = () => {
	const data: any = useLoaderData();

	return (
		<>
			<Title title={"Gestion du groupe"}/>
			<GroupManager group={data.group} />
		</>
	);
}

export default ManageGroup;
