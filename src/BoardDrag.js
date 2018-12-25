import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Line, Arrow, Text } from 'react-konva';
import { Oh, CustomText, Ex, Square } from './drag/Icons';
import Editor from './Editor';

class BoardDrag extends Component {
  constructor(props) {
    super(props);
    
    this.state = {        
      textes: [],
      exes: [],
      ohs: [],
      lines: [],
      arrows: [],
      squares: [],
      drawMode: false, // can be false, line or arrow
    };
  }
  
  componentDidMount() {
    this.getLocalChanges();
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
  
  roundToNearest = (x, roundTo) => {
    return (x % roundTo) >= (roundTo/2) ? parseInt(x / roundTo) * roundTo + roundTo : parseInt(x / roundTo) * roundTo;
  }
  
  saveProgress = () => {
    let activeState = this.state;
    delete activeState.drawMode;
    delete activeState.editing;
    
    window.sessionStorage.setItem( 'playbook-active', JSON.stringify(this.state) );
  };
  
  getLocalChanges = () => {
    var initialState;
    
    if ( initialState = window.sessionStorage.getItem('playbook-active') ) {
      this.setState(JSON.parse(initialState));
    }
  };
  
  publishChanges = () => {
    window.sessionStorage.removeItem('playbook-active');
  };
  
  handleDragEnd = (e, index, type) => {
    if ( !this.state.drawMode ) {
      e.target.to({
        duration: 0.5,
        //  easing: Konva.Easings.ElasticEaseOut,
        scaleX: 1,
        scaleY: 1,
        // shadowOffsetX: 5,
        // shadowOffsetY: 5
      });  
      
      let thing = this.state[type];
      
      thing[index].x = e.currentTarget._lastPos.x; // this.roundToNearest(e.evt.clientX, 1);
      thing[index].y =  e.currentTarget._lastPos.y; //this.roundToNearest(e.evt.clientY, 1);
      
      this.setState({ [type]: thing }, this.saveProgress);
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
      


      let lines = this.state[this.state.drawMode];
      
      lines.push({
        points: this.state.editing
      })
      
      this.setState({
        [this.state.drawMode]: lines, 
        editing: false
      })
    }
  };
  
  addToBoard = (type, item) => {
    var items = this.state[type];
    
    var item = Object.assign({
      x: (window.innerWidth / 2) - 150 + (Math.random() * 300),
      y: window.innerHeight / 2
    }, item);
    
    items.push(item);
    
    this.setState({
      [type]: items
    })
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
      
      <Editor addToBoard={this.addToBoard} />
      
      <Layer>
      
      {
        this.state.drawMode ? 
        <Text y={150} x={ 50 } text = "Mode: Drawing: Click on an icon in the play to draw a route" />
        :
        <Text y={150} x={ 50 } text = "Mode: Dragging: Click on an icon to move them around" />
      }
    
      <Text y={190} x={ 50 } onClick={ () => this.setState( { drawMode: 'lines'} ) } text="Draw Lines" />
      <Text y={210} x={ 50 } onClick={ () => this.setState( { drawMode: 'arrows'} ) } text="Draw Arrows" />   
      {/* <Text y={170} x={ 50 } onClick={ () => this.setState( { drawMode: !this.state.drawMode} ) } text="Draw Dotted Lines" />
      <Text y={170} x={ 50 } onClick={ () => this.setState( { drawMode: !this.state.drawMode} ) } text="Draw Blocking Lines" /> */}
      <Text y={230} x={ 50 } onClick={ () => this.setState( { drawMode: false } ) } text="Switch to Drawing Mode" />  
      
      {
        this.state.ohs.map( (oh, index) => {
          return( 
            <Oh 
            x={ oh.x } 
            y={ oh.y } 
            draggable={!this.state.drawMode}
            key={index}
            onDragStart={ this.handleDragStart }
            onDragEnd={ e => this.handleDragEnd(e, index, 'ohs') }
            onClick={ ()  => this.setState( { editing: [oh.x, oh.y] }) }
            />
            )
          })
        }
        
        {
          this.state.squares.map( (square, index) => {
            return( 
              <Square 
              x={ square.x } 
              y={ square.y } 
              draggable={!this.state.drawMode}
              key={index}
              onDragStart={ this.handleDragStart }
              onDragEnd={ e => this.handleDragEnd(e, index, 'squares') }
              onClick={ ()  => this.setState( { editing: [square.x, square.y] }) }
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
                  <Arrow
                  points={arrow.points}
                  stroke='black'
                  fill='black'
                  tension={1}
                  />
                  )
                }
                )
              }
              
              {
                this.state.textes.map( (elem, index) => {
                  return( 
                    <CustomText 
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
                      <Ex 
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