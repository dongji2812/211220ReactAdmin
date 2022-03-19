// 入口js文件
import React from 'react'
import ReactDOM  from 'react-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import App from './App'
/* import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils' */

/* const user = storageUtils.getUser()
memoryUtils.user = user */

ReactDOM.render((
    <Provider store={store}> {/* Provider是根组件，Provider接收store，然后把store暴露给 所有的容器组件。   包装UI组件生成的组件就是容器组件。*/}
        <App/>
    </Provider>
),document.getElementById('root'))  