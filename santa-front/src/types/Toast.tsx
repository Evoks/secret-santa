// Define interfaces for the state
type Toast = {
	id?: string;
	message: string;
	type: 'warning' | 'error' | 'success';
}

export default Toast;