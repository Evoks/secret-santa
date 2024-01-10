
type TitleProps = {
	title: string;
	subtitle?: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle }: TitleProps) => {
	return (
		<div className="flex flex-col text-left w-full mb-6">
			<h1 className="sm:text-4xl text-4xl title-font text-gradient-blue-purple font-bold">
				{title}
			</h1>
			{subtitle &&
				<p className="leading-relaxed text-xs text-white">
					{subtitle}
				</p>
			}
		</div>
	);
}

export default Title;