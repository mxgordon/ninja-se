import React from 'react';
import { directions } from '../model/Model';
import * as config from "../model/config";

export function Board(props) {
    return (
        <div className='grid' style={{gridTemplateColumns: `repeat(${props.nCols}, 1fr)`, gridTemplateRows: `repeat(${props.nRows}, 1fr)`}}>
            {[...Array(props.nCols * props.nRows).keys()].map(i => (<TileElement {...props.tiles[i]}/>))}
        </div>
    )
}

export function Controls(props) {
    return (
        <div className="controls">
            <div className="reset-div">
                <p>{`Score: ${props.score}`}</p>
                <p>{`Moves: ${props.moveCnt}`}</p>
            </div>
            <div className="moving-div">
                <div className="btn-row">
                    <div className="up-button" onClick={() => props.moveHandler(directions.UP)}>
                        <span>UP</span>
                    </div>
                    <div className="right-button" onClick={() => props.moveHandler(directions.RIGHT)}>
                        <span>RIGHT</span>
                    </div>
                </div>
                <div className="btn-row">
                    <div className="left-button" onClick={() => props.moveHandler(directions.LEFT)}>
                        <span>LEFT</span>
                    </div>
                    <div className="down-button" onClick={() => props.moveHandler(directions.DOWN)}>
                        <span>DOWN</span>
                    </div>
                </div>
            </div>
            <div className="remove-div">
                <div className="btns">
                    <div className="4x4-btn btn" onClick={() => props.setConfig(config.config_4x4)}><span>4x4</span></div>
                    <div className="5x5-btn btn" onClick={() => props.setConfig(config.config_5x5)}><span>5x5</span></div>
                    <div className="6x6-btn btn" onClick={() => props.setConfig(config.config_6x6)}><span>6x6</span></div>
                    <div className="rst-btn btn" onClick={props.resetGame}><span>Reset</span></div>
                </div>
                <div className="rmv-btn btn" onClick={props.removeGroups}><span>Remove Group</span></div>
            </div>
        </div>
    )
}

export function TileElement(props) {
    if (props.isNinjaSe) {
        return (
        <div className="grid-box" style={{backgroundColor: props.color}}>
            <div id="ninja-se">
                
            </div>
        </div>)
    } else {
        return <div className="grid-box" style={{backgroundColor: props.color}}></div>
    }
}

export function WinnerText(props) {
    if (props.isWon()) {
        return <h1>You Win!</h1>;
    } else {
        return <></>;
    }
}