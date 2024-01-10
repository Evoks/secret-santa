
const Footer: React.FC<any> = (): any => {
	return (
		<footer className="body-font mx-auto container flex flex-col max-w-[1024px]">
			<div className="container py-8 mx-auto flex items-center sm:flex-row flex-col">
				<span className="ml-3 text-xl">Secret Santa</span>
				<p className="text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2023 — 2024 Secret Santa
				</p>
				<span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">

				</span>
			</div>
		</footer>
	);
}

export default Footer;
