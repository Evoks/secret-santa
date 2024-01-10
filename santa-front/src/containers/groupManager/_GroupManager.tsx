import { useEffect, useContext, useReducer, useState } from 'react';
import User from '../../types/User';
import { AuthContext } from '../../contexts/AuthContext';
import FormGroupEditionActions from '../../types/FormGroupEditionActions.enum';
import Group from '../../types/Group';
import GroupUsersAssociations from './GroupUsersAssociations';
import { Card, Datepicker, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

type GroupManagerProps = {
	group: Group;
}

interface GroupManagerState {
	name?: string;
	users: User[];
	mainUser: User;
	exclusions: {
		userId: string;
		excludedUsers: string[];
	}[];
	dueDate: Date;
	associations: {
		userId: string,
		associatedUser: string;
	}[];
}

function groupReducer(state: GroupManagerState, action: { type: string, payload: any }) {
	switch (action.type) {
		case FormGroupEditionActions.UPDATE_DATA:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

const GroupManager: React.FC<GroupManagerProps> = ({ group }: GroupManagerProps) => {
	const navigate = useNavigate();
	const { authUser } = useContext(AuthContext);
	const [groupState, dispatchGroupState] = useReducer(groupReducer, group);
	const [initialGroupState, setInitialGroupState] = useState<string>(JSON.stringify(group));

	useEffect(() => {
		if (!authUser) {
			navigate('/login');
		}
		// check if the authUser is in the group
		const userInGroup = groupState.users.find((user: User) => user._id === authUser?._id);
		if (!userInGroup) {
			navigate('/login');
		}
	}, [authUser, groupState.users, navigate])

	useEffect(() => {
		const updateServerValues = async () => {
			await fetch(`${process.env.REACT_APP_API_URL}/group/${group._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(groupState)
			});
			setInitialGroupState(JSON.stringify(groupState));
		}
		if (initialGroupState !== JSON.stringify(groupState)) {
			updateServerValues();
		}
	}, [group._id, groupState, initialGroupState])

	const handleInputChange = async (value: any, property: string) => {
		const payload = { [property]: value };
		dispatchGroupState({ type: FormGroupEditionActions.UPDATE_DATA, payload });
	}

	return (
		<>
			{/* display the group information */}
			<Card className="bg-frosty relative">
				<div className="flex flex-col">
					<div className="flex flex-row items-center">
						<div className="flex flex-col w-1/2">
							<h2 className="card-title text-primary">Nom du groupe</h2>
							<div className="card-desc">Le nom du groupe est utilisé pour identifier le groupe.</div>
						</div>
						<div className="w-1/2">
							<TextInput
								name="groupName"
								value={groupState.name}
								onChange={(event) => handleInputChange(event?.target.value, 'name')}
								disabled={authUser?._id !== groupState.mainUser._id}
							/>
						</div>
					</div>
					<hr className="border-0 border-b border-gray-300 my-4" />
					<div className="flex flex-row items-center">
						<div className="flex flex-col w-1/2">
							<h2 className="card-title text-primary">Date du tirage</h2>
							<div className="card-desc">La date où les membres du groupe doivent se faire les cadeaux</div>
						</div>
						<div className="w-1/2">
							<Datepicker
								language="fr-FR"
								minDate={new Date()}
								weekStart={1}
								value={new Date(groupState.dueDate).toLocaleDateString()}
								title="Choisissez la date de tirage"
								onSelectedDateChanged={(date: Date) => handleInputChange(date, 'dueDate')}
								disabled={authUser?._id !== groupState.mainUser._id}
							/>
						</div>
					</div>
					<hr className="border-0 border-b border-gray-300 my-4" />
					<GroupUsersAssociations associations={groupState.associations} />
				</div>
			</Card>
		</>
	);
}

export default GroupManager;
