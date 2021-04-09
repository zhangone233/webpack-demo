import React from 'react';
import ReactDom from 'react-dom';
import './index.scss';

class PageA extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        const { title } = this.props;
        return (
            <div className="page-A">
                <h3>{title} aaaa</h3>
            </div>
        );
    }
}

ReactDom.render(<PageA title="Page-A" />, document.getElementById('root'));

if (process.env.NODE_ENV === 'development') {
    if (module && module.hot) {
        module.hot.accept();
    }
}
