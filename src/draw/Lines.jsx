import React from 'react';
import { Line as KonvaLine, Arrow as KonvaArrow } from 'react-konva';

export class Line extends React.Component {
    render() {
        return(
            <KonvaLine
                stroke={this.props.styles[this.props.theme].lines}
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
                stroke={this.props.styles[this.props.theme].lines}
                fill={this.props.styles[this.props.theme].lines}
                tension={1}
                onDblClick={this.props.remove}
                {...this.props}
            />
        )
    }
}
    
    