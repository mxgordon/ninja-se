export class Tile {
    constructor(color, isNinjaSe) {
        this.color = color;
        this.isNinjaSe = isNinjaSe;
    }
}

export const directions = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
}