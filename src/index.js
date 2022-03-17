// 入口js文件
import React from 'react'
import ReactDOM  from 'react-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
),document.getElementById('root'))  