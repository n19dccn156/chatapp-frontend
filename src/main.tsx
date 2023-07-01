import ReactDOM from 'react-dom/client'
import Routers from './router/router'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import store from './redux/store'

const stores = configureStore({ reducer: store })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Provider store={stores}>
		<Routers/>
	</Provider>
)
