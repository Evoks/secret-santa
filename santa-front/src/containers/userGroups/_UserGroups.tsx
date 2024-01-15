import { Card } from "flowbite-react";
import Group from "../../types/Group";
import { Link } from "react-router-dom";

type GroupManagerProps = {
	groups: Group[];
}


const UserGroups: React.FC<GroupManagerProps> = ({ groups }: GroupManagerProps) => {
	return (
		<div className="flex flex-row flex-wrap w-full">
			{groups.map((group: Group, index: number) => (
				<div key={group._id} className="w-1/3">
					<Card className="m-1">
						<Link to={'/group/' + group._id} className="flex flex-row items-center">
							<div className="flex flex-col">
								<h2 className="card-title text-primary">Groupe</h2>
								<div className="text-dark font-semibold text-sm mb-1">
									{group.name}
								</div>
								<div className="text-dark text-normal text-xs flex flex-row items-center mb-1">
									<div className="rounded-full bg-primary text-white w-[16px] h-[16px] font-bold flex flex-row items-center justify-center mr-1">
										{group.users.length}
									</div>
									membres
								</div>
								<div className="text-dark text-xs">
									Tirage le <span className="font-semibold">{new Date(group.dueDate).toLocaleDateString()}</span>
								</div>
							</div>
						</Link>
					</Card >
				</div>
			))}
		</div>
	);
}

export default UserGroups;
