import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../../types/User";

type GroupUserAssociationProps = {
	association: {
		userId: User,
		associatedUser: User;
	};
};

const GroupUserAssociation: React.FC<GroupUserAssociationProps> = ({ association }: GroupUserAssociationProps) => {
	return (
		<div className="text flex flex-row items-center mb-2 last:mb-0">
			<div className="bg-primary text-white font-bold py-1 px-2 rounded flex flex-row items-center">
				<FontAwesomeIcon className="mr-1" icon={faUser} />
				<div>{association.userId.name}</div>
			</div>
			<div>&nbsp;doit faire un cadeau à&nbsp;</div>
			<div className="bg-secondary text-white font-bold py-1 px-2 rounded flex flex-row items-center">
				<FontAwesomeIcon className="mr-1" icon={faUser} />
				<div>{association.associatedUser.name}</div>
			</div>
		</div>
	);
}
export default GroupUserAssociation;