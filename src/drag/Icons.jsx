import React from 'react';
import { Circle, Text, Rect } from 'react-konva';

export class Square extends React.Component {
    render() {
        return(
            <Rect 
                width={20} 
                height={20} 
                cornerRadius={2} 
                stroke="black" 
                fill="white" 
                shadowColor={'black'}
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
                fill="white"
                stroke="black"
                shadowColor={'black'}
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
                {...this.props}
          />
        );        
    }
};

