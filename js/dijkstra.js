class Dijksta {
    constructor(state) {
        this.maxweight = 10000;
        this.state = state;
        this.heap = new Heap();
        this.destID = this.getHeapId(this.state.dest);
        this.finished = false;
        this.state.state.forEach((row, y) => {
            row.forEach((block, x) => {
                this.heap.push(this.getHeapId({ x, y }), this.maxweight);
                block.parent = undefined;
            });
        });

        this.heap.decreasePrio(this.getHeapId(this.state.start), 0);
    }

    getHeapId({ x, y }) {
        return JSON.stringify({ x, y });
    }
    idToCoord(st) {
        return JSON.parse(st);
    }
    getWeight(a, b) {
        return a.role !== 'wall' && b !== 'wall' ? 1 : this.maxweight;
    }

    calcNextMove() {
        let cur = this.heap.popmin();
        let totalEnergy = cur.value;
        let coord = this.idToCoord(cur.id);

        let affectedBlocks = [];
        console.log(cur.value);
        if (cur.id === this.destID || cur.value === this.maxweight) {
            this.finished = true;
            return affectedBlocks;
        }

        let curBlock = this.state.state[coord.y][coord.x];

        let processNeighbour = ({ nX, nY }) => {
            let neighbourId = this.getHeapId({ y: nY, x: nX });
            let neighbourblock = this.state.state[nY][nX];

            let newCost =
                this.getWeight(curBlock, neighbourblock) + totalEnergy;
            let oldCost = this.heap.getPrio(neighbourId);

            if (newCost < oldCost) {
                this.heap.decreasePrio(neighbourId, newCost);
                neighbourblock['parent'] = coord;
            } else {
                return;
            }

            if (neighbourblock.role === 'unfilled') {
                neighbourblock.role = 'processed';
            }
            affectedBlocks.push({ x: nX, y: nY });
        };
        if (coord.y > 0) {
            //up
            processNeighbour({ nY: coord.y - 1, nX: coord.x });
        }
        if (coord.y < this.state.dim - 1) {
            //down
            processNeighbour({ nY: coord.y + 1, nX: coord.x });
        }
        if (coord.x > 0) {
            //left
            processNeighbour({ nY: coord.y, nX: coord.x - 1 });
        }
        if (coord.x < this.state.dim - 1) {
            //right
            processNeighbour({ nY: coord.y, nX: coord.x + 1 });
        }
        return affectedBlocks;
    }
    iterativeSolver() {
        return {
            next: () => {
                return {
                    state: this.state,
                    affectedBlocks: this.calcNextMove(),
                };
            },
            hasNext: () => !this.finished,
            getPath: () => {
                let solutionPath = [];
                if (this.finished) {
                    let curBlock = this.state.state[this.state.dest.y][
                        this.state.dest.x
                    ];
                    while (curBlock.parent !== undefined) {
                        solutionPath.push(curBlock.parent);
                        curBlock = this.state.state[curBlock.parent.y][
                            curBlock.parent.x
                        ];
                    }
                    if (solutionPath.length >= 2) {
                        solutionPath.pop();
                    }
                }
                return solutionPath.reverse();
            },
        };
    }
}
