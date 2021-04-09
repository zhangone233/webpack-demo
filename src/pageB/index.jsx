import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const PageB = (props) => {
    const { title } = props;
    const [state, setState] = useState('this is');

    useEffect(() => {
        console.log(`${state}${title}`);
        setTimeout(() => setState(''), 3000);
    }, []);

    return (
        <div className="Page-B">
            <h3>
                {state} {title}
            </h3>
        </div>
    );
};

ReactDOM.render(<PageB title="Page-B" />, document.getElementById('root'));

// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    if (module && module.hot) {
        module.hot.accept();
    }
}
