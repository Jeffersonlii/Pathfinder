(() => {
    let toolMode = 'start'; // 'start', 'dest', 'wall'
    let gridState;
    let delay = 20;

    let onInteract = (e, coords) => {
        if (e.buttons == 1) {
            ['start', 'dest'].map((str) => {
                // prevent multiple starting and destination locations
                if (toolMode === str) {
                    if (gridState[str].x !== -1) {
                        //unassign previous node
                        gridState.state[gridState[str].y][
                            gridState[str].x
                        ].role = 'unfilled';
                        new Ui().refreshGridBlock(gridState, gridState[str]);
                    }
                    gridState[str] = coords;
                }
            });
            gridState.state[coords.y][coords.x].role = toolMode;
            new Ui().refreshGridBlock(gridState, coords);
        } else if (e.buttons == 2) {
            ['start', 'dest'].map((str) => {
                if (gridState.state[coords.y][coords.x].role === str) {
                    gridState[str] = { x: -1, y: -1 };
                }
            });

            gridState.state[coords.y][coords.x].role = 'unfilled';
            new Ui().refreshGridBlock(gridState, coords);
        }
    };

    let resetGrid = () => {
        let dim = 20;
        let state = [];
        for (let i = 0; i < dim; i++) {
            let intermediateArr = [];
            for (let i = 0; i < dim; i++) {
                intermediateArr.push({ role: 'unfilled' }); //unfilled, start, dest, wall, path
            }
            state.push(intermediateArr);
        }
        gridState = {
            start: { x: -1, y: -1 },
            dest: { x: -1, y: -1 },
            state,
            dim,
        };
        new Ui().refreshGrid(
            gridState,
            (e, coords) => {
                onInteract(e, coords);
                //removeGenerated();
            },
            onInteract
        );
    };
    let removeGenerated = () => {
        gridState = {
            ...gridState,
            state: gridState.state.map((row) => {
                for (let i = 0; i < gridState.dim; i++) {
                    row[i].role =
                        row[i].role === 'start' ||
                        row[i].role === 'dest' ||
                        row[i].role === 'wall'
                            ? row[i].role
                            : 'unfilled';
                }
                return row;
            }),
        };
        new Ui().refreshGrid(
            gridState,
            (e, coords) => {
                onInteract(e, coords);
                //removeGenerated();
            },
            onInteract
        );
    };
    let drawPath = async (pathArr) => {
        for (let i = 0; i < pathArr.length; i++) {
            let coords = pathArr[i];
            gridState.state[coords.y][coords.x].role = 'path';
            new Ui().refreshGridBlock(gridState, coords);
            await sleep(15);
        }
    };
    window.onload = () => {
        //init grid
        resetGrid();

        //listeners
        let toolsEl = document.getElementById('tools-select');
        toolsEl.addEventListener('change', (e) => {
            toolMode = toolsEl.value;
        });

        document
            .getElementById('reset-button')
            .addEventListener('click', (e) => {
                resetGrid();
            });

        document
            .getElementById('dkAlgo')
            .addEventListener('click', async (e) => {
                if (gridState.start.x === -1 || gridState.dest.x === -1) {
                    alert(
                        'Please make sure starting and destination points are defined.'
                    );
                } else {
                    removeGenerated();
                    let worker = new Dijksta(gridState).iterativeSolver();
                    while (worker.hasNext()) {
                        let { state, affectedBlocks } = worker.next();
                        affectedBlocks.forEach((coords) => {
                            new Ui().refreshGridBlock(state, coords);
                        });
                        await sleep(delay);
                    }
                    await drawPath(worker.getPath());
                }
            });

        let speed = document.getElementById('speed');
        speed.oninput = () => {
            delay = 40 - speed.value;
        };
    };

    const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
})();
