import React, { createContext, useState } from "react";
import Toast from "../types/Toast";
import { v4 } from "uuid";
import AppToast from "../components/Toast";

type ToastContextType = {
	toasts: Toast[];
	addToast: (toast: Toast) => void;
	removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType>({
	toasts: [],
	addToast: () => { },
	removeToast: () => { },
});

const ToastContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (toast: Toast) => {
		toast.id = v4();
		setToasts(currentToasts => [...currentToasts, toast]);
		// Set a timer to remove the toast after 3000ms
		setTimeout(() => {
			removeToast(toast.id!);
		}, 3000);
	};

	const removeToast = (id: string) => {
		setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<div className="fixed bottom-0 right-0 mr-2 flex flex-col-reverse">
				{toasts.map((toast: Toast) => toast.id &&
					<div className="mb-2" key={toast.id}>
						<AppToast id={toast.id} message={toast.message} type={toast.type} closeHandlerCallback={removeToast} />
					</div>
				)}
			</div>
		</ToastContext.Provider>
	);
};

export default ToastContextWrapper;
