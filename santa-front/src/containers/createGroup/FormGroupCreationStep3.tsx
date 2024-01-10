import { useState } from 'react';
import InputGroupUserExclusion from './InputGroupUserExclusion';
import ModalGroupUserExclusion from './ModalGroupUserExclusion';
import User from '../../types/User';
import FormGroupCreationActions from '../../types/FormGroupCreationActions.enum';

type FormGroupCreationStep3Props = {
	state: any;
	dispatchState: any;
}

const FormGroupCreationStep3: React.FC<FormGroupCreationStep3Props> = ({ state, dispatchState }: any) => {
	const [enableExclusions, setEnableExclusions] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const handleSubmitUserExclusion = (excludedUsers: string[]) => {
		// sort exclusions
		excludedUsers.sort();
		dispatchState({ type: FormGroupCreationActions.UPDATE_USER_EXCLUSION, payload: { user: selectedUser, excludedUsers } });
		setSelectedUser(null);
	}

	return (
		<>
			<div className="mb-2">
				{selectedUser &&
					<ModalGroupUserExclusion
						user={selectedUser}
						otherUsers={([state.mainUser, ...state.users] as User[]).filter((user: User) => user.name !== selectedUser?.name)}
						submitHandler={handleSubmitUserExclusion}
					/>
				}
				<h2 className="leading-7 font-bold text-black mb-2">Voulez-vous paramétrer des exclusions?</h2>
				<div className="text-xs text-gray-600 mb-2">Une exclusion indique qui ne doit pas tirer qui.</div>
				<div className="flex flex-col w-full">
					<div onClick={() => { setEnableExclusions(false) }} className={`btn mb-2 flex-1 ${enableExclusions === false ? 'btn-secondary' : 'btn-frosty'}`}>
						Ne pas utiliser d'exclusions
					</div>
					<div onClick={() => { setEnableExclusions(true) }} className={`btn mb-2 flex-1  ${enableExclusions ? 'btn-secondary' : 'btn-frosty'}`}>
						Déterminer des exclusions
					</div>
				</div>
				{enableExclusions && state.users.length > 0 &&
					<>
						<div>
							<InputGroupUserExclusion user={state.mainUser} setSelectedUser={setSelectedUser} />
						</div>
						{state.users.map((user: User, idx: number) => {
							return (
								<div key={idx}>
									<InputGroupUserExclusion user={user} setSelectedUser={setSelectedUser} />
								</div>
							);
						})}
					</>
				}
			</div>
		</>
	);
}

export default FormGroupCreationStep3;
