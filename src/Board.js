import React from 'react';
import CanvasDraw from "react-canvas-draw";

class Board extends React.Component {
    render() {
        const defaultProps = {
            loadTimeOffset: 5,
            lazyRadius: 30,
            brushRadius: 3,
            brushColor: "#444",
            catenaryColor: "#0a0302",
            gridColor: "rgba(150,150,150,0.17)",
            hideGrid: false,
            canvasWidth: '100vw',
            canvasHeight: '100vh',
            disabled: false,
            imgSrc: "",
            saveData: null,
            immediateLoading: false,
            styles: 'margin: auto'
          };

        return(
            <div>
                Hello!
                
                <CanvasDraw {...defaultProps} />
            </div>
        );
    }
}

export default Board;