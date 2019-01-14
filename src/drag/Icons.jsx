import React from 'react';
import { Circle, Text, Rect } from 'react-konva';

const styles = {
    border: 'black',
    background: '#f7faf5'
};

export class Square extends React.Component {
    render() {
        return(
            <Rect 
                width={20} 
                height={20} 
                cornerRadius={2} 
                stroke={this.props.styles[this.props.theme].lines} 
                fill={this.props.styles[this.props.theme].background} 
                shadowColor={styles.border}
                onDblClick={this.props.remove}
                {...this.props}
            />
        )
    }
}
export class Oh extends React.Component{
    render() {
        return(
            <Circle 
                radius={9} 
                stroke={this.props.styles[this.props.theme].lines} 
                fill={this.props.styles[this.props.theme].background} 
                shadowColor={styles.border}
                onDblClick={this.props.remove}
                {...this.props}
          />
        );        
    }
};

export class Ex extends React.Component{
    render() {
        return(
            <CustomText {...this.props}  text="X" />
        );         
    }
};

export class CustomText extends React.Component{
    render() {
        return(
            <Text 
                fontSize={25}
                fill={this.props.styles[this.props.theme].lines} 
                onDblClick={this.props.remove}
                {...this.props}
          />
        );        
    }
};

