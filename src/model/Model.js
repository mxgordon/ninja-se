export class Tile {
    constructor(color, isNinjaSe, key) {
        this.color = color;
        this.isNinjaSe = isNinjaSe;
        this.key = key;
    }
}

export const directions = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
}