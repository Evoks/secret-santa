import React from "react";

const FormErrors: React.FC<any> = ({ errors }: any) => {
	return (
		<React.Fragment>
			<div className="text-xs text-red-600 flex-1">
				{errors.map((error: string, idx: number) => {
					return (
						<div key={idx}>{error}</div>
					);
				})}
			</div>
		</React.Fragment>
	);
};

export default FormErrors;