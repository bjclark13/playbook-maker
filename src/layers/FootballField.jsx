import React from 'react';
import { Layer, Text, Line, Group } from 'react-konva';

class FootballField extends React.Component {
    constructor( props ) {
        super(props);
        this.state = {
            height: this.getHeight(),
            width: this.getWidth()
        };
    }
    
    updateDimensions() {
        this.setState({width: this.getWidth(), height: this.getHeight()});
    }
    
    componentDidMount() {
        this.updateDimensions();
        
        window.addEventListener("resize", () => this.updateDimensions() );
    }
    
    getWidth() {
        return this.props.width || window.innerWidth;
    }
    
    getHeight() {
        return this.props.height || window.innerHeight;
    }
    
    render() {
        return(
            <Layer>

				{[...Array( Math.floor((this.state.height / 2) / 10))].map((value, index) => {
					let y = (this.state.height / 2) + (index * 20);
					let y2 = y - (index * 40);

					let x = this.state.width / 3;
					let hashLength = 5;

					return (
						<Group>
							{
								( 0 === (index % 5) ) ? 
								<Group>
									<Line 
									points={[ 0, y, this.state.width, y]}
									stroke={this.props.styles[this.props.theme].lines}
									tension={2}
									/>
										<Line 
										points={[ 0, y2, this.state.width, y2]}
										stroke={this.props.styles[this.props.theme].lines}
										tension={2}
										/>

									{ ( 0 === (index % 10) ) ?
									<Group>
										<Text fill={this.props.styles[this.props.theme].lines} x={120} y= {y - 28} text={50 - index} fontSize={50} rotation={90} />
										<Text fill={this.props.styles[this.props.theme].lines} x={120} y= {y2 - 28} text={50 - index} fontSize={50} rotation={90}/>

										<Text fill={this.props.styles[this.props.theme].lines} x={this.state.width - 120} y= {y - 28} text={ 50 - index} fontSize={50} rotation={90} />
										<Text fill={this.props.styles[this.props.theme].lines} x={this.state.width - 120} y= {y2 - 28 } text={ 50 - index} fontSize={50} rotation={90} />
									</Group>
										: null
									}
										
								</Group>
								: 
								<Group>
								<Line 
									points={[ x - hashLength, y, x + hashLength, y]}
									stroke={this.props.styles[this.props.theme].lines}
									tension={2}
								/>

								<Line 
									points={[ 2 * x - hashLength, y, 2 * x + hashLength, y]}
									stroke={this.props.styles[this.props.theme].lines}
									tension={2}
								/>

								<Line 
									points={[ x - hashLength, y2, x + hashLength, y2]}
									stroke={this.props.styles[this.props.theme].lines}
									tension={2}
								/>

								<Line 
									points={[ 2 * x - hashLength, y2, 2 * x + hashLength, y2 ]}
									stroke={this.props.styles[this.props.theme].lines}
									tension={2}
								/>
								</Group>
							}

						</Group>
					);
				}, this)}
            </Layer>
            )
        }
    }
    
    export default FootballField;