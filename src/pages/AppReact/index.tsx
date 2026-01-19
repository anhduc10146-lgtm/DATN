import React from 'react';
import logo from '../../logo.svg';
import './index.css';
import s from './style.module.scss';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <div className={s.title}>
                Hello, React with TypeScript and SCSS Modules!
            </div>
        </div>
    );
}

export default App;
