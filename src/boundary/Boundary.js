import React from 'react';

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