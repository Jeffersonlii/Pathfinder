class Ui {
    refreshGrid(gridState, onClickBlocks, onHoverBlocks) {
        let gridParent = document.getElementById('gridarea');

        gridParent.innerHTML = '';

        gridState.state.map((row, row_index) => {
            gridParent.append(
                ...row.map((block, col_index) => {
                    let coords = { x: col_index, y: row_index };
                    let blockEl = document.createElement('div'); // Create a new element
                    blockEl.id = this._getGridHTMLId(coords);
                    blockEl.className = 'block';
                    blockEl.classList.add(block.role);

                    blockEl.addEventListener('mousedown', (e) => {
                        onClickBlocks(e, coords);
                    });
                    blockEl.addEventListener('mouseover', (e) => {
                        onHoverBlocks(e, coords);
                    });
                    return blockEl;
                })
            );
        });
    }
    refreshGridBlock(gridState, coords) {
        let targetBlock = document.getElementById(this._getGridHTMLId(coords));
        if (targetBlock) {
            targetBlock.className = 'block';
            targetBlock.classList.add(gridState.state[coords.y][coords.x].role);
        }
    }
    _getGridHTMLId(coords) {
        return `block_${JSON.stringify(coords)}`;
    }
}
