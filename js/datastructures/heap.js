class Heap {
    constructor() {
        this.heapArr = [];
        this.idToIndex = {};
        this.maxPrio = 99999;
    }

    _swap(index1, index2) {
        let temp = this.heapArr[index2];
        this.heapArr[index2] = this.heapArr[index1];
        this.heapArr[index1] = temp;

        this.idToIndex[this.heapArr[index1].id] = index1;
        this.idToIndex[this.heapArr[index2].id] = index2;
    }
    _percolate(index) {
        let self = this.heapArr[index];
        let parentIndex = Math.floor((index - 1) / 2);

        while (
            parentIndex >= 0 &&
            this.heapArr[parentIndex].value > self.value
        ) {
            this._swap(index, parentIndex);
            index = parentIndex;
            parentIndex = Math.floor((index - 1) / 2);
        }
    }
    _heapify(index) {
        let self = this.heapArr[0];
        let leftchildIndex = index * 2 + 1;
        let rightchildIndex = index * 2 + 2;

        let leftChild =
            leftchildIndex > this.heapArr.length - 1
                ? { value: this.maxPrio }
                : this.heapArr[leftchildIndex];
        let rightChild =
            rightchildIndex > this.heapArr.length - 1
                ? { value: this.maxPrio }
                : this.heapArr[rightchildIndex];

        while (self.value > Math.min(leftChild.value, rightChild.value)) {
            if (leftChild.value < rightChild.value) {
                this._swap(leftchildIndex, index);
                index = leftchildIndex;
            } else {
                this._swap(rightchildIndex, index);
                index = rightchildIndex;
            }
            self = this.heapArr[index];
            leftchildIndex = index * 2 + 1;
            rightchildIndex = index * 2 + 2;
            leftChild =
                leftchildIndex > this.heapArr.length - 1
                    ? { value: this.maxPrio }
                    : this.heapArr[leftchildIndex];
            rightChild =
                rightchildIndex > this.heapArr.length - 1
                    ? { value: this.maxPrio }
                    : this.heapArr[rightchildIndex];
        }
    }
    push(id, value) {
        let index = this.heapArr.push({ id, value }) - 1;
        this.idToIndex[id] = index;

        this._percolate(index);
    }
    popmin() {
        let min = this.heapArr[0];
        let worst = this.heapArr.pop();
        if (this.heapArr.length !== 0) {
            this.heapArr[0] = worst;
            this.idToIndex[worst.id] = 0;
            this._heapify(0);
        }
        this.idToIndex[min.id] = undefined;
        return min;
    }

    decreasePrio(id, newValue) {
        let index = this.idToIndex[id];
        let self = this.heapArr[index];
        self.value = newValue;
        this._percolate(index);
    }

    getPrio(id) {
        if (
            this.idToIndex[id] === undefined ||
            !this.heapArr[this.idToIndex[id]]
        )
            return -1;
        return this.heapArr[this.idToIndex[id]].value;
    }
}
