import React from 'react';
import { directions } from '../model/Model';

export class Board extends React.Component {
    // constructor({nCol, nRow, tiles}) {
    //     super();

    //     this.nCol = nCol;
    //     this.nRow = nRow;
    //     this.tiles = tiles;

    // }

    render() {
        console.log(this.props);
        return (
            <div className='grid' style={{gridTemplateColumns: `repeat(${this.props.nCol}, 1fr)`, gridTemplateRows: `repeat(${this.props.nRow}, 1fr)`}}>
                {[...Array(this.props.nCol * this.props.nRow).keys()].map(i => (<TileElement {...this.props.tiles[i]} />))}
            </div>
        )
    }
}

export class Controls extends React.Component {
    render() {
        return (
            <div className="controls">
                <div className="reset-div"></div>
                <div className="moving-div">
                    <div className="btn-row">
                        <div className="up-button" onClick={() => this.props.moveHandler(directions.UP)}>
                            <span>UP</span>
                        </div>
                        <div className="right-button" onClick={() => this.props.moveHandler(directions.RIGHT)}>
                            <span>RIGHT</span>
                        </div>
                    </div>
                    <div className="btn-row">
                        <div className="left-button" onClick={() => this.props.moveHandler(directions.LEFT)}>
                            <span>LEFT</span>
                        </div>
                        <div className="down-button" onClick={() => this.props.moveHandler(directions.DOWN)}>
                            <span>DOWN</span>
                        </div>
                    </div>
                </div>
                <div className="remove-div"></div>
            </div>
        )
    }

}

export class TileElement extends React.Component {
    render() {
        if (this.props.isNinjaSe) {
            return (
            <div className="grid-box" style={{backgroundColor: this.props.color}}>
                <div id="ninja-se">
                    
                </div>
            </div>)
        } else {
            return <div className="grid-box" style={{backgroundColor: this.props.color}}></div>
        }
    }
}