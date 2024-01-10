import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import User from "../../types/User";

type GroupAssociationProps = {
	associations: {
		userId: string,
		associatedUser: User;
	}[];
};

const GroupUsersAssociations: React.FC<GroupAssociationProps> = ({ associations }: GroupAssociationProps) => {
	return (
		<>
			<div className="flex flex-row items-start">
				<div className="flex flex-col w-1/2">
					<h2 className="card-title text-primary">Associations des utilisateurs</h2>
					<div className="card-desc">Chaque membre du groupe doit faire un cadeau à l'autre membre qui lui ait associé</div>
				</div>
				<div className='w-1/2 bg-white p-4 rounded border border-gray-300 '>
					{associations?.map((association: any, idx: number) =>
						<div key={`assoc-${idx}`} className="flex flex-row items-center mb-2 last:mb-0">
							<FontAwesomeIcon className="mr-1 text-primary" icon={faUser} />
							<div className="text-primary font-bold">{association.userId.name}</div>
							<div className="text">&nbsp;doit faire un cadeau à&nbsp;</div>
							<FontAwesomeIcon className="ml-1 mr-1 text-secondary" icon={faUser} />
							<div className="text-secondary font-bold">{association.associatedUser.name}</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
export default GroupUsersAssociations;