import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormGroupCreationActions from '../types/FormGroupCreationActions.enum';
import { TextInput } from 'flowbite-react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

type UserEditableInputProps = {
	dispatchState: any;
	removable: boolean;
	disabled: boolean;
	type?: string;
	placeholder?: string;
	regexValidation?: RegExp,
	inputName: string;
	value: string;
	idx: number;
}

const UserEditableInput: React.FC<UserEditableInputProps> = ({ dispatchState, removable, disabled, inputName, regexValidation, placeholder = '', type = 'text', value = '', idx = null }: any) => {
	// Function to handle changes in the input fields
	const [color, setColor] = useState('gray');
	const handleInputChange = (index: number, value: string) => {
		if (regexValidation) {
			regexValidation.test(value) ? setColor('success') : setColor('failure');
		}
		const payload: any = {
			index,
		}
		payload[inputName] = value;
		dispatchState({ type: FormGroupCreationActions.UPDATE_USER, payload });
	};

	// Function to handle removing a user from the list
	const handleUserRemoved = (index: number) => {
		dispatchState({ type: FormGroupCreationActions.REMOVE_USER, payload: { index } });
	}

	return (
		<div key={`user-${idx}`} className="relative flex-grow w-full mb-2">
			<TextInput type={type} color={color} disabled={disabled} value={value} onChange={(e) => { handleInputChange(idx, e.target.value) }} />
			{removable &&
				<div onClick={() => (handleUserRemoved(idx))} className="absolute right-[10px] top-[calc(50%_-_12px)] cursor-pointer hover:opacity-60 transition-all">
					<FontAwesomeIcon icon={faTimes} />
				</div>
			}
		</div >
	);
};

export default UserEditableInput;