import { createBrowserHistory } from 'history';
import ReactDOM from 'react-dom/client';
import LecturesPage from './container/Home/pages/MainHome/LecturesPage.jsx';
import './index.css';

export const history = createBrowserHistory();

ReactDOM.createRoot(document.getElementById('root')).render(
	// <Admin />
	// <ProblemsPage/>
	<LecturesPage/>
	// <React.StrictMode>
	// 	<HistoryBrowserRouter history={history}>
	// 		<App />
	// 	</HistoryBrowserRouter>
	// </React.StrictMode>,
);
