import { useContext, useState } from 'react';
import InputGroupUserExclusion from './InputGroupUserExclusion';
import ModalGroupUserExclusion from './ModalGroupUserExclusion';
import User from '../../types/User';
import FormGroupCreationActions from '../../types/FormGroupCreationActions.enum';
import { FormGroupCreationContext } from './FormGroupCreation.context';
import React from 'react';



const FormGroupCreationStep3: React.FC = () => {
	const { state, dispatchState } = useContext(FormGroupCreationContext);

	const [enableExclusions, setEnableExclusions] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const handleSubmitUserExclusion = (excludedUsers: string[]) => {
		// sort exclusions
		excludedUsers.sort();
		dispatchState({ type: FormGroupCreationActions.UPDATE_USER_EXCLUSION, payload: { user: selectedUser, excludedUsers } });
		setSelectedUser(null);
	}

	return (
		<div className="mb-2">
			{selectedUser &&
				<ModalGroupUserExclusion
					user={selectedUser}
					otherUsers={state.users.filter((user: User) => user.name !== selectedUser?.name)}
					submitHandler={handleSubmitUserExclusion}
				/>
			}
			<h2 className="leading-7 font-bold text-black mb-2">Voulez-vous paramétrer des exclusions?</h2>
			<div className="text-xs text-gray-600 mb-2">Une exclusion indique qui ne doit pas tirer qui.</div>
			<div className="flex flex-col w-full">
				<div data-testid="btn-disable-exclusions" onClick={() => { setEnableExclusions(false) }} className={`btn mb-2 flex-1 ${enableExclusions === false ? 'btn-secondary' : 'btn-frosty'}`}>
					Ne pas utiliser d'exclusions
				</div>
				<div data-testid="btn-enable-exclusions" onClick={() => { setEnableExclusions(true) }} className={`btn mb-2 flex-1  ${enableExclusions ? 'btn-secondary' : 'btn-frosty'}`}>
					Déterminer des exclusions
				</div>
			</div>
			{enableExclusions && state.users.length > 0 &&
				<React.Fragment>
					{state.users.map((user: User, idx: number) => {
						return (
							<div data-testid={`exclusion-user-${idx}`} key={`exclusion-user-${idx}`}>
								<InputGroupUserExclusion user={user} setSelectedUser={setSelectedUser} index={idx} />
							</div>
						);
					})}
				</React.Fragment>
			}
		</div>
	);
}

export default FormGroupCreationStep3;
