import * as React from 'react';

interface Props {
    url: string;
}

class RemoteImage extends React.Component<Props, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <img src={this.props.url} />
        );
    }
}

export default RemoteImage;
