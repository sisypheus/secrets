import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Home } from './pages/home.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';

export function App() {
	return (
		<LocationProvider>
			<main class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
				<div class={"flex flex-1 flex-col items-center justify-center"}>
					<Router>
						<Route path="/" component={Home} />
						<Route path="/secrets" component={Home} />
						<Route path="/secrets/:id" component={Home} />
						<Route default component={NotFound} />
					</Router>
				</div>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
