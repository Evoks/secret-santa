import './App.css';
import { Body } from './components/structure';
import { QueryClientProvider } from '@tanstack/react-query';
import router, { queryClient } from './routes-obj';
// pages
import AuthContextWrapper from './contexts/AuthContext';
import ToastContextWrapper from './contexts/ToastContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom';

type CombinedContextsProps = {
	children: React.ReactNode;
}

const CombinedContexts: React.FC<CombinedContextsProps> = ({ children }) => (
	<AuthContextWrapper>
		<ToastContextWrapper>
			{children}
		</ToastContextWrapper>
	</AuthContextWrapper>
);

type AppPropsType = {
	children: React.ReactNode;
}

const App: React.FC<AppPropsType> = ({ children }: AppPropsType) => {
	return (
		<QueryClientProvider client={queryClient}>
			<CombinedContexts>
				<div className="App !text-light flex flex-col">
					<div className="flex flex-auto bg-dark">
						<Body>
							<RouterProvider router={router} />
						</Body>
					</div>
				</div>
				<ReactQueryDevtools initialIsOpen={false} />
			</CombinedContexts>
		</QueryClientProvider>
	);
}

export default App;
