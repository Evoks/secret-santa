import { faCheck, faTimes, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Toast } from 'flowbite-react';
import { useCallback } from 'react';

type ToastProps = {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning';
	closeHandlerCallback: (toastId: string) => void;
};

const AppToast = ({ id, message, type, closeHandlerCallback }: ToastProps) => {
	const closeHandler = useCallback(() => {
		closeHandlerCallback(id);
	}, [id, closeHandlerCallback]);

	return (
		<div className="w-full flex flex-row">
			<Toast className="items-center pb-2 z-[999999]">
				{type === "success" && (
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
						<FontAwesomeIcon icon={faCheck} />
					</div>
				)}
				{type === "error" && (
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
						<FontAwesomeIcon icon={faTimes} />
					</div>
				)}
				{type === "warning" && (
					<div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
						<FontAwesomeIcon icon={faWarning} />
					</div>
				)}
				<div className="ml-3 text-sm font-normal">{message}</div>
				<Toast.Toggle onClick={closeHandler} />
			</Toast>
		</div>
	);
};

export default AppToast;