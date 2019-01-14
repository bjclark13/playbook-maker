import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import StraightIcon from '@material-ui/icons/Straighten';

import DragIndicator from '@material-ui/icons/DragIndicator';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import RedoIcon from '@material-ui/icons/Redo';
import UndoIcon from '@material-ui/icons/Undo';


const styles = theme => ({
    fab: {
        marginLeft: 100,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class AppToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menuOpen: false,
            drawMenuOpen: false
        };
    }

    toggleMenu = () => {
        this.setState({ menuOpen: !this.state.menuOpen });
    };

    toggleDrawMenu = () => {
        this.setState({ drawMenuOpen: !this.state.drawMenuOpen });
    };

    setMode = (mode) => {
        this.props.setMode(mode);
        this.handleClose();
    }

    handleClose = () => {
        this.setState({
            menuOpen: false, 
            drawMenuOpen: false
        });
    };

    render() {
        return(
        <div style={{zIndex: 999}}>

        {
            this.props.drawMode ? 
            <Tooltip title="Straight Mode" aria-label="Straight Mode">
                <Fab 
                    color={ this.props.straightMode ? 'primary' : 'default' } 
                    aria-label="Draw" 
                    style={{ 
                        position: 'fixed',
                        zIndex: 999,
                        bottom: 80,
                        right: 85
                    }}
                    buttonRef={node => {
                        this.anchorElDraw = node;
                    }}
                    onClick={ _ => this.props.toggleStraightMode() }
                >
                    <StraightIcon />
                </Fab>
            </Tooltip> : null
        }

        <Tooltip title="Draw Mode" aria-label="Draw Mode">
            <Fab 
                color={ this.props.drawMode ? 'primary' : 'default' } 
                aria-label="Draw" 
                style={{ 
                    position: 'fixed',
                    zIndex: 999,
                    bottom: 80,
                    right: 15
                }}
                buttonRef={node => {
                    this.anchorElDraw = node;
                }}
                onClick={this.toggleDrawMenu}
             >
                <EditIcon />
            </Fab>
        </Tooltip>

        <Tooltip title="Add Item" aria-label="Add Item">
            <Fab 
                color='secondary'
                aria-label="Add" 
                style={{ 
                    bottom: 10,
                    right: 15,
                    position: 'fixed',
                    zIndex: 999
                }}
                onClick={ this.toggleMenu }
                buttonRef={node => {
                    this.anchorEl = node;
                }}
            >
                <AddIcon />
            </Fab>
        </Tooltip>

        {
            this.props.hasPast ? 
            <Tooltip title="Undo" aria-label="Undo">
            <Fab 
                color={'default' } 
                aria-label="Draw" 
                style={{ 
                    position: 'fixed',
                    zIndex: 999,
                    bottom: 10,
                    right: 85
                }}
                onClick={this.props.undo}
             >
                <UndoIcon />
            </Fab>
        </Tooltip> : null
        }

        {
            this.props.hasFuture ? 
            <Tooltip title="Redo" aria-label="Redo">
                <Fab 
                    color={'default' } 
                    aria-label="Draw" 
                    style={{ 
                        position: 'fixed',
                        zIndex: 999,
                        bottom: 10,
                        right: 155
                    }}
                    onClick={this.props.redo}
                >
                    <RedoIcon />
                </Fab>
            </Tooltip>
            : null
        }

        <Tooltip title="Drag Mode" aria-label="Drag Mode">
            <Fab 
                color={ !this.props.drawMode ? 'primary' : 'default' } 
                aria-label="Drag" 
                style={{ 
                    bottom: 150,
                    right: 15,
                    position: 'fixed',
                    zIndex: 999
                }}
                onClick={ () => { this.props.setMode(false); } }
                >
                <DragIndicator />
            </Fab>
        </Tooltip>

                <Menu
                    id="add-menu"
                    onClose={this.handleClose}
                    open={this.state.menuOpen}
                    anchorEl={this.anchorEl}
                    >
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('ohs')
                            this.handleClose();
                        }
                    }>
                        Circle
                    </MenuItem>

                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('squares')
                            this.handleClose();
                        }
                    }>Square</MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('exes')
                            this.handleClose();
                        }
                    }> X </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'Y'})
                            this.handleClose();
                        }
                    }> Y </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'Z'})
                            this.handleClose();
                        }
                    }> Z </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'QB'})
                            this.handleClose();
                        }
                    }> QB </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'HB'})
                            this.handleClose();
                        }
                    }> HB </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'FB'})
                            this.handleClose();
                        }
                    }> FB </MenuItem>
                    <MenuItem 
                        onClick={ () => {
                            this.props.addToBoard('textes', {text: 'TE'})
                            this.handleClose();
                        }
                    }> TE </MenuItem>
                    {/* <MenuItem onClick={this.setState({ customTextForm: true })}>Custom Text</MenuItem> */}
                </Menu>

                <Menu
                    id="draw-menu"
                    open={this.state.drawMenuOpen}
                    anchorEl={this.anchorElDraw}
                    >
                    <MenuItem onClick={() => this.setMode('lines')}>Lines</MenuItem>
                    <MenuItem onClick={() => this.setMode('arrows')}>Arrows</MenuItem>
                    <MenuItem onClick={() => this.setMode('dottedLines')}>Dotted Lines</MenuItem>
                </Menu>
            </div> 
            )
        }
    }
    
export default withStyles(styles)(AppToolbar);
    