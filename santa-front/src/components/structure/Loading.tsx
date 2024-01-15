import { Spinner } from "flowbite-react";

const Loading: React.FC<any> = ():any => {
	return (
		<div className="flex flex-row justify-center items-center w-full h-[100vh] ">
			<Spinner />
		</div>
	);
}

export default Loading;
