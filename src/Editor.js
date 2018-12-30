import React from 'react';
import { Oh, CustomText, Ex, Square } from './drag/Icons';
import { Text, Layer } from 'react-konva';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            textes: [
                {
                    text: 'QB',
                },
                {
                    text: 'HB',
                },
                {
                    text: 'FB',
                },
                {
                    text: 'C',
                },
                {
                    text: 'Y',
                },
                {
                    text: 'Z',
                },
            ],
            exes: [{}],
            ohs: [{}],
            squares: [{}]
        };
    }
    
    render() {
        var total = 0;

        return(
            <Layer> 
            <Text y={5} x={ 50 } text = "Editor: Click an icon to add to the play" />
            
            {
                this.state.ohs.map( (oh, index) => {
                    total ++; 
                    
                    return(
                        <Oh 
                        x={total * 60} 
                        y={ 35 } 
                        onClick={ e => {                             
                            this.props.addToBoard('ohs')
                        }
                        }
                    />
                    );
                }, this)
            }
            
            {
                this.state.exes.map( (ex, index) => {
                    total ++; 

                    return( 
                        <Ex 
                        key={index}
                        x={total * 60} 
                        y={ 25 } 
                        onClick={ e => {                             
                            this.props.addToBoard('ohs') }
                        }
                            />
                    )
                })
            }
            
            {
                this.state.squares.map( (ex, index) => {
                    total ++; 

                    return( 
                        <Square 
                            key={index}
                            x={total * 60} 
                            y={ 25 } 
                            onClick={ e => { 
                                
                                this.props.addToBoard('squares')
                            }
                            }
                    />
                    )
                })
            }

            {
                this.state.textes.map( (elem, index) => {
                    total ++; 

                    return( 
                        <CustomText
                        text={elem.text} 
                        x={total * 60} 
                        y={ 25 } 
                        onClick={ e => {                             
                            this.props.addToBoard('textes', {text: elem.text} )
                        }
                        }
                    />
                    )
                })
            }
            </Layer>
            );
        }
    } 
    
    export default Editor;