import React from 'react';
import {Board, Controls} from './boundary/Boundary'
import { Tile } from './model/Model';
import * as config from "./config"
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <Board nCol={4} nRow={4} />

//     </div>
//   );
// }

class App extends React.Component {
  constructor() {
    super()

    this.state = this.parseConfig(config.config_4x4);
  }

  parseConfig({name, numRows, numColumns, ninjaRow, ninjaColumn, initial}) {
    let nCol = Number(numColumns), nRow = Number(numRows);

    let tiles = Array(nCol * nRow);

    initial.forEach(({color, row, column}) => tiles[charToNumber(column) + nCol * (Number(row) - 1)] = new Tile(color, false));

    tiles[charToNumber(ninjaColumn) + nCol * (Number(ninjaRow) - 1)] = new Tile("limegreen", true);

    return {nCol, nRow, tiles};
  }

  render() {
    return (
      <div className="App">
        <Board {...this.state} />
        <Controls />
      </div>
    )
  }

}

function charToNumber(char) {
  return char.charCodeAt(0) - "A".charCodeAt(0);

}

export default App;
