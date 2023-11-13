import React from 'react';
import { Board, Controls, WinnerText } from './boundary/Boundary'
import { Tile, directions } from './model/Model';
import './App.css';

class App extends React.Component {
    constructor() {
        super()

        this.state = { nRows: 1, nCols: 1, tiles: [], moveCnt: 0, score: 0, config: null};

        this.tmpScore = 0;

        this.handleMove = this.handleMove.bind(this);
        this.setConfig = this.setConfig.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.removeGroups = this.removeGroups.bind(this);
        this.isWon = this.isWon.bind(this);
    }

    parseConfig({ name, numRows, numColumns, ninjaRow, ninjaColumn, initial }) {
        let nCols = Number(numColumns), nRows = Number(numRows);

        let tiles = Array(nCols * nRows);

        initial.forEach(({ color, row, column }) => tiles[charToNumber(column) + nCols * (Number(row) - 1)] = new Tile(color, false));

        tiles[charToNumber(ninjaColumn) + nCols * (Number(ninjaRow) - 1)] = new Tile("limegreen", true);

        return { nCols, nRows, tiles };
    }

    setConfig(config) {
        this.setState({...this.parseConfig(config), moveCnt: 0, score: 0, config: config})
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

    moveTile(colDest, rowDest, colSrc, rowSrc, tiles) {
        this.setTile(colDest, rowDest, tiles, this.getTile(colSrc, rowSrc, tiles));
        this.removeTile(colSrc, rowSrc, tiles);
    }

    indexToCoords(index) {
        return [index % this.state.nCols, Math.floor(index / this.state.nCols)];
    }

    findNinjaSe() {
        return this.indexToCoords(this.state.tiles.map((v, i) => ({v,i})).filter(({v}) => v !== undefined && v.isNinjaSe)[0].i);
    }

    isWon() {
        return this.state.tiles.filter(v => v !== undefined).length === 1;
    }

    removeGroups() {
        for (let i = 0; i < this.state.tiles.length; i++) {
            let [col, row] = this.indexToCoords(i);
            let tile = this.getTile(col, row);
            if (col < this.state.nCols - 1 && row < this.state.nRows - 1 && tile !== undefined ) {
                let isSameColor = [this.getTile(col, row+1), this.getTile(col+1, row+1), this.getTile(col+1, row)].map(v => v !== undefined && v.color === tile.color).filter(v => v);
                if (isSameColor.length === 3) {
                    let tiles = this.state.tiles;
                    this.removeTile(col, row, tiles);
                    this.removeTile(col+1, row, tiles);
                    this.removeTile(col+1, row+1, tiles);
                    this.removeTile(col, row+1, tiles);

                    this.setState({tiles, moveCnt: this.state.moveCnt+1, score: this.state.score + 4});
                    return
                }
            }
        }

    }

    resetGame() {
        if (this.state.config !== null) {
            this.setConfig(this.state.config);
        }
    }

    checkIfMoveValid(dir, ninjaCol, ninjaRow) {
        if (this.state.config === null || this.isWon()) {
            return false;
        }

        switch (dir) {
            case directions.UP:
                return ninjaRow > 0;
            case directions.DOWN:
                return ninjaRow < (this.state.nRows - 2);
            case directions.LEFT:
                return ninjaCol > 0;
            case directions.RIGHT:
                return ninjaCol < (this.state.nCols - 2);
            default:
                throw Error("Expected a direction enum, got " + dir);
        }
    }

    updateTilesInDirection(dir, col, row) {
        let nextCoords = [
            [col, wrap(row - 1, this.state.nRows)], 
            [wrap(col + 1, this.state.nCols), row],
            [col, wrap(row + 1, this.state.nRows)],
            [wrap(col - 1, this.state.nCols), row],
        ];

        let [newCol, newRow] = nextCoords[dir];
        let tile = this.getTile(col, row);

        if (tile === undefined) {
            return this.state.tiles;
        }
        
        let newTiles = this.updateTilesInDirection(dir, ...nextCoords[dir]); 
        
        this.moveTile(newCol, newRow, col, row, newTiles);
        this.tmpScore++;

        return newTiles;
    }

    handleMove(dir) {
        let col, row;
        try {
            [col, row] = this.findNinjaSe();
        } catch (error) {
            return
        }

        if (!this.checkIfMoveValid(dir, col, row)) {
            return;
        }

        let tiles = this.state.tiles;
        this.removeTile(col, row, tiles);
        this.setState({tiles});
        
        let edgeCoords = [
            [[col, wrap(row - 1, this.state.nRows)], [col + 1, wrap(row - 1, this.state.nRows)]], 
            [[wrap(col + 2, this.state.nCols), row], [wrap(col + 2, this.state.nCols), row + 1]],
            [[col, wrap(row + 2, this.state.nRows)], [col + 1, wrap(row + 2, this.state.nRows)]],
            [[wrap(col - 1, this.state.nCols), row], [wrap(col - 1, this.state.nCols), row + 1]]
        ];

        let nextNinjaSeCoords = [
            [col, wrap(row - 1, this.state.nRows)], 
            [wrap(col + 1, this.state.nCols), row],
            [col, wrap(row + 1, this.state.nRows)],
            [wrap(col - 1, this.state.nCols), row],
        ];
        this.tmpScore = 0;
        this.setState({tiles: this.updateTilesInDirection(dir, ...edgeCoords[dir][0])});
        this.setState({tiles: this.updateTilesInDirection(dir, ...edgeCoords[dir][1])});

        let moveCnt = this.state.moveCnt + 1;
        tiles = this.state.tiles;

        this.setTile(...nextNinjaSeCoords[dir], tiles, new Tile("limegreen", true));
        this.setState({tiles, moveCnt, score: this.state.score + this.tmpScore});
    }

    render() {
        return (
            <div className="App">
                <Board {...this.state} />
                <Controls {...this.state} moveHandler={this.handleMove} setConfig={this.setConfig} resetGame={this.resetGame} removeGroups={this.removeGroups} />
                <WinnerText isWon={this.isWon} />
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
