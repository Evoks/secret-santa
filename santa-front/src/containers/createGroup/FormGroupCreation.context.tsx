import { Dispatch, createContext } from 'react';

type FormContextType = {
	state: any;
	dispatchState: Dispatch<{ type: string; payload: any; }>;
}

export const FormGroupCreationContext = createContext<FormContextType>({
	state: {},
	dispatchState: () => {},
});
