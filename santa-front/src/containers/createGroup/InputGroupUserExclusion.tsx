import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "flowbite-react";

interface InputGroupUserExclusionProps {
	user: any;
	setSelectedUser: any;
	index: number;
}

const InputGroupUserExclusion: React.FC<InputGroupUserExclusionProps> = ({ user, setSelectedUser, index }) => {
	const openExclusionModalHandler = () => {
		setSelectedUser(user);
	};

	return (
		<div className="mb-2 cursor-pointer">
			<div>
				<label className="label text-dark">
					<span className="label-text font-semibold">{user.name}</span>
				</label>
			</div>
			<div className="relative">
				<TextInput data-testid={`exclusion-user-input-${index}`} onClick={() => { openExclusionModalHandler() }} readOnly={true} placeholder="Choisissez des exclusions..." className="w-full !cursor-pointer" value={user.excludedUsers.join(', ')} />
				<div className="absolute right-[10px] top-[14px] text-xs cursor-pointer hover:opacity-70 transition-all">
					<FontAwesomeIcon icon={faChevronRight} />
				</div>
			</div>
		</div>
	);
}

export default InputGroupUserExclusion;