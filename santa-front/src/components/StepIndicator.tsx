type StepIndicatorProps = {
	steps: number[];
	currentStep: number;
	text: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, text }) => {
	return (
		<div className="flex justify-center items-center my-4">
			{steps.map((step, index) => (
				<div key={step} className="flex flex-row items-center ">
					<div className="flex flex-col items-center justify-start">
						{/* Circle for the step */}
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center
							${index === currentStep ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'}
							${index < currentStep ? 'bg-blue-300 text-white' : ''}`}
						>
							{step}
						</div>
					</div>
					{index < steps.length - 1 && (
						<div className="w-4 h-[1px] bg-gray-300 mx-2"></div>
					)}
				</div>
			))}
		</div>
	);
};

export default StepIndicator;