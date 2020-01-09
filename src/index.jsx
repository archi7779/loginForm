import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm';
import './styles/index.sass';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

// а реально формы через фомик сделать экспортируемымы модулями, а то у меня не получилось с первого раза

ReactDOM.render(<LoginForm />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
