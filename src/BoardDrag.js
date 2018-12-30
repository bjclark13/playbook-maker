import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Text, Line as KonvaLine } from 'react-konva';
import { Oh, CustomText, Ex, Square } from './drag/Icons';
import { Line, DottedLine, Arrow } from './draw/Lines';
import ActionToolbar from './Toolbar';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import sample from './samples/1';

//  Editor from './Editor';

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
      dottedLines: [],
      drawMode: false, // can be false, line or arrow
    };

    this.initialState = {        
      textes: [],
      exes: [],
      ohs: [],
      lines: [],
      arrows: [],
      squares: [],
      dottedLines: [],
      drawMode: false, // can be false, line or arrow
      straightMode: false
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
    let activeState = Object.assign(this.state, {});
    
    window.sessionStorage.setItem( 'playbook-active', JSON.stringify(activeState) );
  };
  
  getLocalChanges = () => {
    var initialState;
    
    if ( initialState = window.sessionStorage.getItem('playbook-active') ) {
      this.setState(JSON.parse(initialState));
    }
  };

  loadSample = () => {
    this.setState(sample);
  };
  
  clearChanges = () => {
    if ( window.confirm("Are you sure you want to clear changes?")) {
      window.sessionStorage.removeItem('playbook-active');
      this.setState(this.initialState);
    }
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
    if ( this.state.drawMode && !this.state.straightMode ) {
      // there are several ways to get stage reference
      if ( this.state.editing ) {
        let editing = this.state.editing;
        
        // first is
        let stage = this.stageRef.getStage();
        let cursor = stage.getPointerPosition();
        
        editing.push(cursor.x, cursor.y);
        
        // if ( this.state[this.state.drawMode].length ) 
        //   this.state[this.state.drawMode][this.state[this.state.drawMode].length - 1].points = editing;
        // else 
        //   this.state[this.state.drawMode].push({ points: editing })
        
        this.setState({
          editing: editing
        });
      }
    }
  };
  
  remove = ( index, type ) => {
    if ( window.confirm('Are you sure you want to remove this item?') ) {
      
      var items = this.state[type];
      items.splice(index, 1);
      
      this.setState({[type]: items}, this.saveProgress);
    }
  }

  handleMouseUp = e => {
    
    if ( this.state.drawMode ) {
      if ( this.state.editing ) {
        let lines = this.state[this.state.drawMode];
      
        lines.push({
          points: this.state.editing
        })

        this.setState({
          [this.state.drawMode]: lines, 
          editing: false
        }, this.saveProgress);
      }
      
      if ( this.state.straightMode ) {
          let lines = this.state[this.state.drawMode];

          // first is
          let stage = this.stageRef.getStage();
          let cursor = stage.getPointerPosition();

          let x = cursor.x;
          let y = cursor.y;

          if ( lines.length )
            lines[lines.length -1].points.push(x,y);
          else 
            lines.push({ points: [x,y] });

          this.setState({[this.state.drawMode]: lines}, this.saveProgress);

        }   
    }
  };
  
  handleMouseDown = e => {
    if ( this.state.drawMode && !this.state.editing && !this.state.straightMode ) {
      let stage = this.stageRef.getStage();
      let cursor = stage.getPointerPosition();
      
      this.setState({ editing: [cursor.x, cursor.y] });
    }
  };
  
  addToBoard = (type, item) => {
    var items = this.state[type];
    
    var newItem = Object.assign({
      x: (window.innerWidth / 2) - 150 + (Math.random() * 300),
      y: window.innerHeight / 2
    }, item);
    
    items.push(newItem);
    
    this.setState({
      [type]: items
    })
  };
  
  render() {
    var total = 0;
    
    return (
      <div>

      <AppBar position="static">
        <Toolbar>
          {/* <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" color="inherit">
            Playbook Maker
          </Typography>
          <Button color="inherit" style={{ position: 'absolute', right: 200 }} onClick={this.loadSample}>Load Example</Button>
          <Button color="inherit" style={{ position: 'absolute', right: 15 }} onClick={this.clearChanges}>Clear Changes</Button>     
        </Toolbar>
      </AppBar>

      <ActionToolbar 
        addToBoard={this.addToBoard}
        setMode={ (mode) => {
          this.setState({ drawMode: mode });   
        }}
        drawMode={this.state.drawMode}
      />
      
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        style={{backgroundColor: '#f7faf5'}
      }
      
      ref={ref => {
        this.stageRef = ref;
      }}
      >
      
      {/* <Editor addToBoard={this.addToBoard} /> */}
      
      <Layer 
        ref = { ref => this.layerRef = ref }
      >
      
      {
        this.state.drawMode ? 
        <Text y={15} x={ 50 } text = "Mode: Drawing. Click and hold to draw. Release the mouse to finish drawing." />
        :
        <Text y={15} x={ 50 } text = "Mode: Dragging. Click on an icon to move them around. Double Click any item to delete it" />
      }

        <Text y={30} x={ 50 } text = "Double Click any item to delete it" />


      <KonvaLine 
        points={[ 0, window.innerHeight / 2, window.innerWidth, window.innerHeight / 2]}
        stroke='black'
        tension={2}
      />
  
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
            remove={ () => this.remove(index, 'ohs') }
            onClick={ ()  => 
              { 
                // if ( this.state.drawMode )
                // this.setState( { editing: [oh.x, oh.y] }) 
              }
            }
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
              remove={ () => this.remove(index, 'squares') }
              onClick={ ()  => 
                { 
                  //  if ( this.state.drawMode )
                  // this.setState( { editing: [square.x, square.y] }) 
                }
              }
              />
              )
            })
          }
          
          {
            this.state.lines.map( (line, index) => {
              return(
                <Line
                points={line.points}
                remove={ () => this.remove(index, 'lines') }
                />
                )
              } 
              )
            }
            
            {
              this.state.dottedLines.map( (line, index) => {
                return(
                  <DottedLine
                  points={line.points}
                  remove={ () => this.remove(index, 'dottedLines') }
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
                    remove={ () => this.remove(index, 'arrows') }
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
                      remove={ () => this.remove(index, 'textes') }
                      onClick={ ()  => 
                        { 
                          //if ( this.state.drawMode )
                          // this.setState( { editing: [elem.x, elem.y] }) 
                        }
                      }
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
                        remove={ () => this.remove(index, 'exes') }
                        onClick={ ()  => 
                          { 
                            // if ( this.state.drawMode )
                            // this.setState( { editing: [ex.x, ex.y] }) 
                          }
                        }
                        />
                        )
                      })
                    }
                    </Layer>
                    </Stage>
                    </div>
                    );
                  }
                }
                
                export default BoardDrag;