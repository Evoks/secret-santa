import { useEffect, useState } from 'react';
import AuthActions from '../types/AuthActions.enum';
import { TextInput } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import passwordRegex from '../helpers/password.regex';

type InputPasswordProps = {
	value: any,
	setValue: any,
	property: string,
}

const InputPassword = ({ value, setValue, property }: InputPasswordProps) => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [inputType, setInputType] = useState<string>('password');

	useEffect(() => {
		setInputType(isPasswordVisible ? 'text' : 'password');
	}, [isPasswordVisible]);

	return (
		<div className="relative">
			<TextInput
				type={inputType}
				placeholder="Renseignez votre mot de passe"
				value={value}
				color={value.length === 0 || passwordRegex.test(value.password) ? 'gray' : 'failure'}
				onChange={(e) => setValue(e.target.value, property)}
				className="mb-4"
			/>
			{
				!isPasswordVisible &&
				<div className="absolute top-0 right-0 mr-2 mt-2 select-none cursor-pointer">
					<FontAwesomeIcon icon={faEye} onClick={() => setIsPasswordVisible(true)} />
				</div>
			}
			{
				isPasswordVisible &&
				<div className="absolute top-0 right-0 mr-2 mt-2 select-none cursor-pointer">
					<FontAwesomeIcon icon={faEyeSlash} onClick={() => setIsPasswordVisible(false)} />
				</div>
			}
		</div>
	)
}

export default InputPassword;