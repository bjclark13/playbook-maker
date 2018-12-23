import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Line, Arrow, Text } from 'react-konva';

class BoardDrag extends Component {
  constructor(props) {
    super(props);
    
    this.styles = {
      size: 20
    };
    
    this.editorValues = {
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
      exes: [ {} ],
      ohs: [ {} ]
    };
    
    this.state = {        
      textes: [],
      exes: [],
      ohs: [],
      lines: [],
      arrows: [],
      drawMode: false
    };
  }
  
  handleDragStart = e => {
    if ( !this.state.drawMode ) {
      e.target.setAttrs({
        // shadowOffset: {
        //   x: 15,
        //   y: 15
        // },
        // scaleX: 1.5,
        // scaleY: 1.5
      });      
    }

  };
  
  handleDragEnd = (e, index, type) => {
    if ( !this.state.drawMode ) {
      console.log(e);
      e.target.to({
        duration: 0.5,
        //  easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        // shadowOffsetX: 5,
        // shadowOffsetY: 5
      });  

      let thing = this.state[type];
      thing[index].x = e.evt.clientX;
      thing[index].y = e.evt.clientY;

      this.setState({ [type]: thing });
    }
  };
  
  handleMouseMove = e => {
    if ( this.state.drawMode ) {
      // there are several ways to get stage reference
      if ( this.state.editing ) {
        let editing = this.state.editing;
        
        // first is
        let stage = this.stageRef.getStage();
        let cursor = stage.getPointerPosition();
        
        editing.push(cursor.x, cursor.y);
        
        this.setState({
          editing: editing
        });
      }
    }
  };
  
  handleMouseUp = e => {
    if ( this.state.drawMode && this.state.editing ) {
      // first is
      let stage = this.stageRef.getStage();
      
      let lines = this.state.lines;
      
      lines.push({
        points: this.state.editing
      })
            
      this.setState({
        lines: lines, 
        editing: false
      })
    }
  };
  
  
  render() {
    var total = 0;
    
    return (
      <Stage 
      width={window.innerWidth} 
      height={window.innerHeight}
      onMouseMove={this.handleMouseMove}
      onMouseUp={this.handleMouseUp}
      ref={ref => {
        this.stageRef = ref;
      }}
      >
      <Layer>
      
      <Text y={5} x={ 50 } text = "Click an icon to add to the play" />
      
      {
        this.state.drawMode ? 
        <Text y={150} x={ 50 } text = "Mode: Drawing: Click on an icon in the play to draw a route" />
        :
        <Text y={150} x={ 50 } text = "Mode: Dragging: Click on an icon to move them around" />
      }

      <Text y={170} x={ 50 } onClick={ () => this.setState( { drawMode: !this.state.drawMode} ) } text="Switch Mode" />

      {
        this.editorValues.ohs.map( (oh, index) => {
          total ++; 
          
          return(
            <Circle 
            x={total * 60} 
            y={ 35 } 
            radius={10} 
            fill="white"
            stroke="black"
            shadowColor={'black'}
            onClick={ () =>  {
              var ohs = this.state.ohs;
              
              ohs.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              });
              
              this.setState({
                ohs: ohs
              })
            }
          }
          />
          );
        }, this)
      }
      
      {
        this.editorValues.textes.map( (elem, index) => {
          total ++; 
          
          return( 
            <Text 
            fontSize={this.styles.size}
            text={elem.text} 
            x={total * 60} 
            y={ 25 } 
            onClick={ () =>  {
              var textes = this.state.textes;
              
              textes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                text: elem.text
              });
              
              this.setState({
                textes: textes
              })
            }
          }
          />
          )
        })
      }
      
      {
        this.editorValues.exes.map( (ex, index) => {
          total ++; 
          
          return( 
            <Text 
            fontSize={this.styles.size}
            key={index}
            text="X" 
            x={total * 60} 
            y={ 25 } 
            onClick={ () =>  {
              var exes = this.state.exes;
              
              exes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              });
              
              this.setState({
                exes: exes
              })
            }
          }
          />
          )
        })
      }
      
      
      { /** Live State */}
      {
        this.state.ohs.map( (oh, index) => {
          return( 
            <Circle 
            x={ oh.x } 
            y={ oh.y } 
            radius={10} 
            fill="#fff"
            stroke="black"
            draggable={!this.state.drawMode}
            key={index}
            onDragStart={ this.handleDragStart }
            onDragEnd={ e => this.handleDragEnd(e, index, 'ohs') }
            shadowColor={'black'}
            onClick={ ()  => this.setState( { editing: [oh.x, oh.y] }) }
            />
            )
          })
        }
        
        {
          this.state.lines.map( (line, index) => {
            return(
              <Line
              points={line.points}
              stroke='black'
              tension={1}
              />
              )
            } 
            )
          }
          
          {
            this.state.arrows.map( (arrow, index) => {
              return(
                <Line
                points={arrow.points}
                stroke='black'
                tension={1}
                />
                )
              }
              )
            }
            
            {
              this.state.textes.map( (elem, index) => {
                return( 
                  <Text 
                  fontSize={this.styles.size}
                  draggable={!this.state.drawMode}
                  key={index}
                  onDragStart={this.handleDragStart}
                  onDragEnd={ e => this.handleDragEnd(e, index, 'textes') }
                  text={elem.text} 
                  x={ elem.x } 
                  y={ elem.y } 
                  onClick={ ()  => this.setState( { editing: [elem.x, elem.y] }) }
                  />
                  )
                })
              }
              
              {
                this.state.exes.map( (ex, index) => {
                  return( 
                    <Text 
                    fontSize={this.styles.size}
                    draggable={!this.state.drawMode}
                    key={index}
                    onDragStart={this.handleDragStart}
                    onDragEnd={ e => this.handleDragEnd(e, index, 'exes') }
                    text="X" 
                    x={ ex.x } 
                    y={ ex.y } 
                    onClick={ ()  => this.setState( { editing: [ex.x, ex.y] }) }
                    />
                    )
                  })
                }
                </Layer>
                </Stage>
                );
              }
            }
            
            export default BoardDrag;