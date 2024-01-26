import { Card } from "flowbite-react";
import React from "react";
import { useEffect, useState } from "react";

export const APIUrl = 'https://jsonplaceholder.typicode.com/posts';

const Test2: React.FC = () => {
	const [data, setData] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		const fetchPosts = async () => {
			setData(null);
			setError(null);
			setLoading(true);
			try {
				const response = await fetch(APIUrl);
				const json = await response.json();
				setData(json);
			} catch (err) {
				console.error(err);
				setError(err);
			}
			setLoading(false);
		};
		fetchPosts();
	}, []);

	return <React.Fragment>
		{loading && <div>Loading...</div>}
		{!loading && error && <div>Erreur à la récuperation des données</div>}
		{!loading && !error && data?.length > 0 &&
			<div className="flex flex-col gap-2">
				{data.map((item: any) =>
					<Card className="text-dark">
						<div key={item.id}>
							{item.title}
						</div>
					</Card>
				)}
			</div>
		}
	</React.Fragment>;
};

export default Test2;