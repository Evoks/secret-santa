import { useEffect, useContext, useReducer, useState } from 'react';
import User from '../../types/User';
import { AuthContext } from '../../contexts/AuthContext';
import FormGroupEditionActions from '../../types/FormGroupEditionActions.enum';
import Group from '../../types/Group';
import { Card, Datepicker, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import GroupUserAssociation from './GroupUserAssociation';
import GroupManagerState from '../../types/GroupManager';
import GroupService from '../../services/group.service';
import { useQueryClient } from '@tanstack/react-query';

type GroupManagerProps = {
	group: Group;
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
	const queryClient = useQueryClient();
	const { authUser } = useContext(AuthContext);
	const [groupState, dispatchGroupState] = useReducer(groupReducer, group);
	const [initialGroupState, setInitialGroupState] = useState<string>(JSON.stringify(group));

	useEffect(() => {
		if (!authUser) {
			navigate('/login');
		}
		// check if the authUser is in the group
		const userInGroup = groupState?.users.find((user: User) => user._id === authUser?._id);
		if (!userInGroup) {
			navigate('/login');
		}
	}, [authUser, groupState?.users, navigate])

	useEffect(() => {
		const updateServerValues = async () => {
			await GroupService.update(groupState._id, groupState);
			setInitialGroupState(JSON.stringify(groupState));
			// reset the cache for the group
			queryClient.invalidateQueries({ queryKey: ['group', groupState._id] });
			queryClient.invalidateQueries({ queryKey: ['groups'] });
		}
		if (initialGroupState !== JSON.stringify(groupState)) {
			updateServerValues();
		}
	}, [groupState, initialGroupState, queryClient])

	const handleInputChange = async (value: any, property: string) => {
		const payload = { [property]: value };
		dispatchGroupState({ type: FormGroupEditionActions.UPDATE_DATA, payload });
	}

	return (
		<Card className="bg-frosty relative text-black"> {/* display the group information */}
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
							data-testid="groupName"
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
							data-testid="dueDate"
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
				<div className="flex flex-row items-start">
					<div className="flex flex-col w-1/2">
						<h2 className="card-title text-primary">Associations des utilisateurs</h2>
						<div className="card-desc">Chaque membre du groupe doit faire un cadeau à l'autre membre qui lui ait associé</div>
					</div>
					<Card className="w-1/2" data-testid="users-associations">
						{groupState.associations?.map((association: any, idx: number) =>
							<GroupUserAssociation key={`association-${idx}`} association={association} />
						)}
					</Card>
				</div>
			</div>
		</Card >
	);
}

export default GroupManager;
