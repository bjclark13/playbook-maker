import React from 'react';
import { Line as KonvaLine, Arrow as KonvaArrow } from 'react-konva';

const styles = {
    border: 'black',
    background: '#bbfc00'
};

export class Line extends React.Component {
    render() {
        return(
            <KonvaLine
                stroke={styles.border}
                tension={1}
                onDblClick={this.props.remove}
                {...this.props}
            />
        )
    }
}

export class DottedLine extends React.Component {
    render() {
        return(
            <Line
                dash={[10]}
                {...this.props}

            />
        )
    }
}

export class Arrow extends React.Component {
    render() {
        return(
            <KonvaArrow
                stroke={styles.border}
                fill={styles.border}
                tension={1}
                onDblClick={this.props.remove}
                {...this.props}
            />
        )
    }
}
    
    