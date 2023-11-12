import React from 'react';
import { Board, Controls } from './boundary/Boundary'
import { Tile, directions } from './model/Model';
import * as config from "./config"
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <Board nCols={4} nRows={4} />

//     </div>
//   );
// }

class App extends React.Component {
    constructor() {
        super()

        this.state = { ...this.parseConfig(config.config_4x4), moveCnt: 0 };

        this.handleMove = this.handleMove.bind(this);
    }

    parseConfig({ name, numRows, numColumns, ninjaRow, ninjaColumn, initial }) {
        let nCols = Number(numColumns), nRows = Number(numRows);

        let tiles = Array(nCols * nRows);

        initial.forEach(({ color, row, column }) => tiles[charToNumber(column) + nCols * (Number(row) - 1)] = new Tile(color, false, charToNumber(column) + nCols * (Number(row) - 1)));

        tiles[charToNumber(ninjaColumn) + nCols * (Number(ninjaRow) - 1)] = new Tile("limegreen", true, charToNumber(ninjaColumn) + nCols * (Number(ninjaRow) - 1));

        return { nCols, nRows, tiles };
    }

    getTile(col, row, tiles=this.state.tiles) {
        return tiles[col + this.state.nCols * row];
    }

    removeTile(col, row, tiles) {
        tiles[col + this.state.nCols * row] = undefined;
    }

    setTile(col, row, tiles, tile) {
        tiles[col + this.state.nCols * row] = tile;
    }

    moveTile(col1, row1, col2, row2, tiles) {
        this.setTile(col1, row1, tiles, this.getTile(col2, row2, tiles));
        this.removeTile(col2, row2);
    }

    indexToCoords(index) {
        return [index % this.state.nCols, Math.floor(index / this.state.nCols)];
    }

    findNinjaSe() {
        return this.indexToCoords(this.state.tiles.map((v, i) => ({v,i})).filter(({v}) => v.isNinjaSe)[0].i);
    }

    isWon() {

    }

    removeTiles() {

    }

    resetGame() {

    }

    openConfig() {

    }

    checkIfMoveValid(dir, ninjaCol, ninjaRow) {
        switch (dir) {
            case directions.UP:
                return ninjaRow > 0;
            case directions.DOWN:
                return ninjaRow < (this.state.nRows - 1);
            case directions.LEFT:
                return ninjaCol > 0;
            case directions.RIGHT:
                return ninjaCol < (this.state.nCols - 1);
            default:
                throw Error("Expected a direction enum, got " + dir);
        }
    }
    
    updateBlocksInDirection(dir, col, row) {
        let nextCoords = [// TODO fix this, make it only look at one tile at a time
            [[col, wrap(row - 1, this.state.nRows)], [col + 1, wrap(row - 1, this.state.nRows)]], 
            [[wrap(col + 2, this.state.nCols), row], [wrap(col + 2, this.state.nCols), row + 1]],
            [[col, wrap(row + 2, this.state.nRows)], [col + 1, wrap(row + 2, this.state.nRows)]],
            [[wrap(col - 1, this.state.nCols), row], [wrap(col - 1, this.state.nCols), row + 1]]
        ];

        let [coord1, coord2] = nextCoords[dir];

        let firstTile = this.state.tiles[coord1], secondTile = this.state.tiles[coord2];

        if ((firstTile === undefined || firstTile.isNinjaSe) &&  (secondTile === undefined || secondTile.isNinjaSe)) {
            return this.state.tiles;
        }

        let coordAdds = [[0, -1], [1, 0], [1, 0], [0, -1]];

        let newTiles = this.updateBlocksInDirection(dir, wrap(col + coordAdds[dir], this.state.nCols), wrap(row + coordAdds[dir], this.state.nRows));

        let [newCol1, newRow1] = [wrap(coord1[0] + coordAdds[dir][0], this.state.nCols), wrap(coord1[1] + coordAdds[dir][1], this.state.nRows)] 
        let [newCol2, newRow2] = [wrap(coord2[0] + coordAdds[dir][0], this.state.nCols), wrap(coord2[1] + coordAdds[dir][1], this.state.nRows)] 

        this.moveTile(coord1[0], coord1[1], newCol1, newRow1, newTiles);
        this.moveTile(coord2[0], coord2[1], newCol2, newRow2, newTiles);

        return newTiles;
    }

    


    handleMove(dir) {
        console.log(this.findNinjaSe());
        let [col, row] = this.findNinjaSe();
        if (!this.checkIfMoveValid(dir, col, row)) {
            return;
        }

        let newTiles = this.updateBlocksInDirection(dir, col, row);


        // switch (dir) {
        //     case directions.UP:
        //         return row > 0;
        //     case directions.DOWN:
        //         return row < (this.state.nRows - 1);
        //     case directions.LEFT:
        //         return col > 0;
        //     case directions.RIGHT:
        //         return col < (this.state.nCols - 1);
        //     default:
        //         throw Error("Expected a direction enum, got " + dir);

        // }
    }

    render() {
        return (
            <div className="App">
                <Board {...this.state} />
                <Controls moveHandler={this.handleMove} />
            </div>
        )
    }

}

function charToNumber(char) {
    return char.charCodeAt(0) - "A".charCodeAt(0);
}

function wrap(num, limit) {
    return (num + limit) % limit;
}

export default App;
