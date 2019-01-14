import React, { Component } from 'react';
import FootballField from './layers/FootballField';
import { Stage, Layer, Text, Group } from 'react-konva';
import { Oh, CustomText, Ex, Square } from './drag/Icons';
import { Line, DottedLine, Arrow } from './draw/Lines';
import ActionToolbar from './Toolbar';
import InputBase from '@material-ui/core/InputBase';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SaveIcon from '@material-ui/icons/CloudDownload';
import LoadIcon from '@material-ui/icons/CloudUpload';
import PrintIcon from '@material-ui/icons/Print';

import SelectIcon from '@material-ui/icons/PhotoSizeSelectActual';
import DeleteIcon from '@material-ui/icons/Delete';
import SquareIcon from '@material-ui/icons/CropSquare'

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
// import Headspace from 'react-headspace';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

import sample from './samples/1';
import AddIcon from '@material-ui/icons/Add';

import ReactToPrint from "react-to-print";

const styles = {
  fallGreen: {
    lines: '#fff',
    background: '#005C09'
  },
  basic: {
    lines: '#000',
    background: '#f7faf5'
  },
  chalkboard:{
    background: '#708090',
    lines: '#fff'
  }
};

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
      fieldHeight: 800,
      drawMode: false, // can be false, line or arrow
      straightMode: false,
      drawerOpen: false,
      theme: 'basic',
      title: ''
    };

    this.history = {
      past: [],
      future: [], 
      present: []
    }

    this.initialState = {        
      textes: [],
      exes: [],
      ohs: [],
      lines: [],
      arrows: [],
      squares: [],
      dottedLines: [],
      drawMode: false, // can be false, line or arrow
      straightMode: true,
      drawerOpen: false
    };
  }
  
  componentDidMount(){
    this.getLocalChanges();
    document.addEventListener("keydown", this._handleKeyDown);
    this.updateDimensions();
    window.addEventListener("resize", () => this.updateDimensions() );
  }

  updateDimensions() {
    this.setState({ fieldWidth: this.getWidth(), fieldHeight: this.getHeight() });
  }

  setPrintDimensions() {
    this.setState({ fieldWidth: 1400, fieldHeight: 1080 });
  }

  getWidth() {
      return window.innerWidth;
  }

  getHeight() {
    // Conserve ~8.5 x 11 ratio
    return window.innerWidth * .772;
     // return  window.innerHeight;
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this._handleKeyDown);
  }

  downloadChanges = () => {
    let exportObj = this.state;
    let exportName;

    if ( this.state.title ) {
      exportName = this.state.title.replace(/\s+/g, '');
    } else {
      exportName = 'MyPlay';
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".plymaker");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
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

    if ( this.history.present.length ) {
      this.history.past.push(this.history.present.pop());
    }

    this.history.present.push(activeState);
    
    window.sessionStorage.setItem( 'playbook-active', JSON.stringify(activeState) );
    this.getLocalChanges();
  };

  toggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  }

  undo = () => {
    let past = this.history.past.pop();
    this.history.future.push(this.state); 


    this.setState(past, _ => {
      window.sessionStorage.setItem( 'playbook-active', JSON.stringify( Object.assign(this.state, {}) ) );
    });
  }

  redo = () => {
    let future = this.history.future.pop();
    this.history.past.push(this.state);

    this.setState(future, _ => {
      window.sessionStorage.setItem( 'playbook-active', JSON.stringify( Object.assign(this.state, {}) ) );
    })
  }
  
  getLocalChanges = () => {
    var initialState = window.sessionStorage.getItem('playbook-active');

    if ( initialState ) {
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

  setTheme = (theme) => {
    this.setState({theme: theme},this.saveProgress);
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
  
  _handleKeyDown = e => {
    // Start new line on space press
    if ( e.key === ' ' && this.state.drawMode && this.state.straightMode ) {
      e.preventDefault();
      
      let lines = this.state[this.state.drawMode];

      lines.push({points: []});
    }

    if ( e.ctrlKey ) {
      e.preventDefault();
      switch ( e.key ) {
        case 'z':
          this.undo();
          break;
        case 'y':
          this.redo();
          break;
        case 'd':
          this.setState({drawMode: false});
          break;
        case 's':
          this.setState({straightMode: true});
          break;
        case 'l':
          this.setState({drawMode: 'lines'});
          break;
      }
    }
  }

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
      if ( this.state.straightMode ) {
          let lines = this.state[this.state.drawMode];

          // first is
          let stage = this.stageRef.getStage();
          let cursor = stage.getPointerPosition();

          let x = cursor.x;
          let y = cursor.y;

          if ( lines.length ) {
            var pointsLength = lines[lines.length -1].points.length;

            if ( pointsLength && pointsLength > 2 ) {
              let y1 = lines[lines.length -1].points[pointsLength - 1];
              let x1 = lines[lines.length -1].points[pointsLength - 2];
            
             lines[lines.length -1].points.push(x1,y1);           
            }

            lines[lines.length -1].points.push(x,y);
          }
          else 
            lines.push({ points: [x,y] });

          this.setState({[this.state.drawMode]: lines}, this.saveProgress);

        } else {
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
      [type]: items,
       drawMode: false
    })
  };

  fileUpload = (e) => {
    let file = e.target.files[0];
    let ext = file.name.split('.').pop();

    if ( ext == 'plymaker') {
      var fileReader = new FileReader();
      fileReader.onload = (e) => {

        this.setState(JSON.parse(e.target.result),
        _ => this.setState({ uploadModalOpen: false }, this.saveProgress )
        );
      };

      fileReader.readAsText(file);
    } else {
      alert('Could not upload file: wrong extension');
    }
  };
  
  render() {
    var total = 0;

    const sideList = (
      <div>
        <List>
            <ListItem>
            <ListItemIcon> <SaveIcon/> </ListItemIcon>
              <ListItemText primary={'Save Changes'} onClick={this.downloadChanges} />
            </ListItem>

            <ListItem>
              <ListItemIcon> <LoadIcon/> </ListItemIcon>
              <ListItemText primary={'Load a Play'} onClick={() => this.setState({ uploadModalOpen: true })} />
            </ListItem>

            <ListItem>
              <ListItemIcon> <PrintIcon /> </ListItemIcon> 
              <ReactToPrint 
                trigger={ () => 
                  <ListItemText primary={'Print this Play'} />
                  }
                content={ () => this.printRef }
                onBeforePrint={ _ => {
                    this.setState({ drawerOpen: false, printing: true }); 
                }}
                onAfterPrint={ _ => this.setState({ drawerOpen: false, printing: false }, this.updateDimensions ) }
                />
            </ListItem>

            <ListItem>
              <ListItemIcon> <DeleteIcon/> </ListItemIcon>
             <ListItemText primary={'Clear Changes'} onClick={this.clearChanges} />
            </ListItem>

            <ListItem onClick={ _ => this.setState({ settingTheme: !this.state.settingTheme }, this.saveProgress ) }>
              <ListItemIcon> <SelectIcon/> </ListItemIcon>
              <ListItemText primary={'Change Theme'} />
            </ListItem>

            {
              this.state.settingTheme ? 
              <div>
                <Divider />
                  <ListItem onClick={ _ => this.setTheme( 'basic' ) }>
                    <ListItemIcon> 
                      <SquareIcon 
                        style={{
                          color: styles.basic.lines
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText primary={'Basic'} />
                  </ListItem>

                  <ListItem onClick={ _ => this.setTheme( 'fallGreen' ) }>
                    <ListItemIcon> 
                    <SquareIcon 
                        style={{
                          color: styles.fallGreen.background
                        }} 
                      />
                   </ListItemIcon>
                    <ListItemText primary={'Fall Green'} />
                  </ListItem>

                  <ListItem onClick={ _ => this.setTheme( 'chalkboard' ) }>
                    <ListItemIcon> 
                      <SquareIcon 
                          style={{
                          color: styles.chalkboard.background, 
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText primary={'Chalkboard'} />
                  </ListItem>
                <Divider />
              </div> : null
            }

          {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
        </List>
        {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
      </div>
    );

    
    return (
      <div
        onKeyDown={this.handleKeyDown}
      >
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Playbook Maker
            </Typography>

            <InputBase
                style={{
                  position: 'absolute',
                  borderRadius: 3,
                  backgroundColor: fade('#f0f0f0', 0.15),
                  '&:hover': {
                    backgroundColor: fade('#f0f0f0', 0.25),
                  },
                  right: 15,
                  width: 300,
                  color: '#fff',
                  padding: 5
                }}
                placeholder={'Enter a Title'}
                onChange={ (e) => this.setState({ title: e.target.value }, this.saveProgress) }
                value={this.state.title}
              />
          </Toolbar>

          <Drawer anchor="right" open={this.state.drawerOpen} onClose={this.toggleDrawer}>
            <div
              tabIndex={0}
              role="button"
              // onClick={this.toggleDrawer}
              // onKeyDown={this.toggleDrawer}
            >
              {sideList}
            </div>
          </Drawer>

      <Dialog open={this.state.uploadModalOpen} onClose={ _ => this.setState({ uploadModalOpen: !this.state.uploadModalOpen })} aria-labelledby="simple-dialog-title">
        <DialogTitle id="simple-dialog-title">Load a Play </DialogTitle>
        <div>
          <List>
            <ListItem button onClick={this.loadSample}>
              <ListItemText primary='Load Example' />
            </ListItem>
            <Divider />
            <ListItem>
              {/* <ListItemIcon>
                <LoadIcon />
              </ListItemIcon> */}
              <ListItemText primary='Upload File' />
              <input type="file" onChange={this.fileUpload}/>
            </ListItem>
          </List>
        </div>
      </Dialog>
      </AppBar>

      <ActionToolbar 
        addToBoard={this.addToBoard}
        setMode={ (mode) => {
          if ( mode && this.state.straightMode ) {
            var lines  = this.state[mode];

            lines.push({ points: [] });
            this.setState({ [mode]: lines });
          } 

          this.setState({ drawMode: mode });   
        }}
        undo={this.undo}
        redo={this.redo}
        hasFuture={this.history.future.length}
        hasPast={this.history.past.length}       
        drawMode={this.state.drawMode}
        straightMode={this.state.straightMode}
        toggleStraightMode={ _ => this.setState({ straightMode: !this.state.straightMode }) }
      />

      <div       
        ref={ref => {
        this.printRef = ref;
      }}> 
      <Stage 
        width={this.state.fieldWidth} 
        height={this.state.fieldHeight}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleMouseDown}
        style={{backgroundColor: styles[this.state.theme].background}
      }
      
      ref={ref => {
        this.stageRef = ref;
      }}
      >
      
      <FootballField
         height={this.state.fieldHeight}
         width={this.state.fieldWidth}
         theme={this.state.theme} 
         styles={styles}
      />
      
      <Layer 
        ref = { ref => this.layerRef = ref }
      >
      
      {
        !this.state.printing ?
        <Group className="no-print">
              {
                this.state.drawMode ? 
                  this.state.straightMode ? 
                  <Text y={15} x={ 50 } fill={styles[this.state.theme].lines} text = "Mode: Drawing (straight mode). Click to add points to the line. Press the spacebar to start a new line." />
                  : 
                  <Text y={15} x={ 50 } fill={styles[this.state.theme].lines} text = "Mode: Drawing. Click and hold to draw. Release the mouse to finish drawing." />
                :
                <Text y={15} x={ 50 } fill={styles[this.state.theme].lines} text = "Mode: Dragging. Click on an icon to move them around. Double Click any item to delete it" />
              }
        
                <Text y={30} x={ 50 } fill={styles[this.state.theme].lines} text = "Double Click any item to delete it" />
          </Group>
          :null
              }

  
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
            theme={this.state.theme}
            styles={styles}
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
              theme={this.state.theme}
              styles={styles}
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
                theme={this.state.theme}
                styles={styles}
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
                  theme={this.state.theme}
                  styles={styles}
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
                    theme={this.state.theme}
                    styles={styles}
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
                      theme={this.state.theme}
                      styles={styles}
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
                        theme={this.state.theme}
                        styles={styles}
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

                    </div>
                    );
                  }
                }
                
                export default BoardDrag;