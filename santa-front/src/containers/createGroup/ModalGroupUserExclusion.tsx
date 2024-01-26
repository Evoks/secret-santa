import { useState } from "react";
import User from '../../types/User';
import { Checkbox } from "flowbite-react";

type ModalGroupUserExclusionProps = {
	user: User;
	otherUsers: User[];
	submitHandler: any;
}

const ModalGroupUserExclusion: React.FC<ModalGroupUserExclusionProps> = ({ user, otherUsers, submitHandler }) => {
	const [exclusions, setExclusions] = useState<string[]>(user.excludedUsers);
	const exclusionChangedHandler = (e: any, otherUser: User) => {
		// we need this to get the checkbox inside the clicked button
		const checkBox = document.getElementById('exclusionModal')?.querySelector(`#checkbox-${otherUser.name}`) as HTMLInputElement;
		if (checkBox) {
			checkBox.checked = !checkBox?.checked;
			if (checkBox?.checked) {
				setExclusions([...exclusions, otherUser.name]);
			} else {
				setExclusions(exclusions.filter((exclusion) => {
					return exclusion !== otherUser.name;
				}));
			}
		}
	};
	return (
		<div data-testid="exclusion-modal" id="exclusionModal" className="absolute inset-0 z-50 justify-center items-center shadow-md border border-dark/5 rounded-xl bg-white/90 backdrop-blur-lg flex flex-col p-10">
			<h2 className="leading-7 font-bold text-black mb-4">
				Exclusions du participant <span className="text-secondary">{user.name}</span>
			</h2>
			<div className="w-full h-full flex flex-col justify-start items-center">
				{otherUsers.map((user: any, idx: number) => {
					return <div key={`exclusion-toggle-${idx}`} className="flex flex-row w-full mb-2 last:mb-4">
						<div data-testid={`exclusion-toggle-${idx}`} className="btn btn-frosty text-dark border-gray-200 w-full justify-start btn-lg rounded-btn" onClick={(e) => { exclusionChangedHandler(e, user) }}>
							<Checkbox data-testid={`exclusion-checkbox-${idx}`} id={`checkbox-${user.name}`} className="checkbox" name="exclusions" value={user.name} onChange={() => { }} checked={exclusions.includes(user.name)} />
							<label htmlFor="exclusions" className="ml-2">{user.name}</label>
						</div>
					</div>
				})
				}
			</div>
			<div className="w-full h-full flex flex-col justify-start items-center">
				<div data-testid="modal-submit-btn" onClick={() => { submitHandler(exclusions) }} className="btn btn-primary  w-full">
					Valider
				</div>
			</div>
		</div>
	);
};

export default ModalGroupUserExclusion;