import { Button, Card } from "flowbite-react";
import { useState } from "react";

const Test1: React.FC = () => {
	const [value, setValue] = useState<number>(0);

	const addVal = (num: number) => {
		setValue(value + num);
	}
	
	return (
		<Card>
			<div className="flex flex-col justify-center items-center gap-4">
				<div className="badge badge-secondary text-white">{value}</div>
				<div className="flex flex-row gap-2">
				<Button className="btn-primary" aria-label="Ajouter" onClick={() => {addVal(1)}}>Ajouter</Button>
				<Button className="btn-primary" aria-label="Enlever" onClick={() => {addVal(-1)}}>Enlever</Button>
				</div>
			</div>
		</Card>
	);
};

export default Test1;