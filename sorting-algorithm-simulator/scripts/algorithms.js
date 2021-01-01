// TODO: put functions into modules
// TODO: add quicksort/mergesort

$(document).ready(function() {

    document.getElementById("bubble-sort-button").addEventListener("click", BubbleSort);
    document.getElementById("selection-sort-button").addEventListener("click", SelectionSort);
    document.getElementById("insertion-sort-button").addEventListener("click", InsertionSort);

    let permutation = FisherYatesShuffle([1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,10]);

    let bubbleSortItems = createObjectArray("bubble", permutation);
    let selectionSortItems = createObjectArray("selection", permutation);
    let insertionSortItems = createObjectArray("insertion", permutation);

    let bubbleSort = $("#bubble-sort");
    for (let i=0; i<=(bubbleSortItems.length-1); i++) {
        bubbleSort.append(bubbleSortItems[i].html);
    }
    let selectionSort = $("#selection-sort");
    for (let i=0; i<=(selectionSortItems.length-1); i++) {
        selectionSort.append(selectionSortItems[i].html);
    }
    let insertionSort = $("#insertion-sort");
    for (let i=0; i<=(insertionSortItems.length-1); i++) {
        insertionSort.append(insertionSortItems[i].html);
    }

    let bubbleSortAnimations = [];
    let selectionSortAnimations = [];
    let insertionSortAnimations = [];

    function createObjectArray(sortName, permutation) {
        let recordStruct = [];
        for (let i=0; i < permutation.length; i++) {
            recordStruct[i] = {
                "html": `<p class='sorting-item' id='${sortName + "-item-" + permutation[i]}'>${permutation[i]}</p>`,
                "jQuery": `#${sortName}-item-${permutation[i]}`,
                "value": permutation[i],
                "id": `${sortName}-item-${permutation[i]}`
            };
        }
        return recordStruct
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index]);
        }
    }

    function FisherYatesShuffle(array) {
        let arr = array;
        for (let i = arr.length - 1; i > 0; i--) {
            let rand = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[rand];
            arr[rand] = temp;
        }
        return arr;
    }

    function PrintArray(array) {
        for (let i=0; i<array.length; i++) {
            console.log(array[i])
        }
    }

    async function AnimateElements(array) {
        await asyncForEach(array, async function(item) {
            console.log(item[2]);
            $(item[0].jQuery).addClass("selected");
            $(item[1].jQuery).addClass("selected");
            if (item[2] === "swap") {
                $(item[0].jQuery).swap({
                    target: item[1].id,
                });
            }
            await new Promise(function (resolve) {
                setTimeout(function () {
                    $(item[0].jQuery).removeClass("selected");
                    $(item[1].jQuery).removeClass("selected");
                    console.log("Done.");
                    return resolve();
                }, 1100)
            });
        });
        console.log("Sorted.")
    }

    function BubbleSort() {
        document.getElementById("bubble-sort-button").disabled = true;
        let buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < bubbleSortItems.length-1; i++) {
                if (bubbleSortItems[i].value > bubbleSortItems[i + 1].value) {
                    let temp = bubbleSortItems[i];
                    bubbleSortItems[i] = bubbleSortItems[i + 1];
                    bubbleSortItems[i + 1] = temp;
                    swapped = true;
                    bubbleSortAnimations.push([bubbleSortItems[i], bubbleSortItems[i+1], "swap"])
                } else {
                    bubbleSortAnimations.push([bubbleSortItems[i], bubbleSortItems[i+1]])
                }
            }
        } while (swapped);
        PrintArray(bubbleSortItems);
        PrintArray(bubbleSortAnimations);
        AnimateElements(bubbleSortAnimations);
    }

    function SelectionSort() {
        document.getElementById("selection-sort-button").disabled = true;
        let buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        PrintArray(selectionSortItems);
        PrintArray(selectionSortAnimations);
        AnimateElements(selectionSortAnimations);
    }

    function InsertionSort() {
        document.getElementById("insertion-sort-button").disabled = true;
        let buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
        for (let i=1; i < insertionSortItems.length; i++) {
            // i represents the first non-sorted item in the list
            let temp = insertionSortItems[i];
            let j = i-1;
            while ((j>= 0) && (insertionSortItems[j].value > temp.value)) {
                insertionSortItems[j+1] = insertionSortItems[j];
                insertionSortAnimations.push([temp, insertionSortItems[j], "swap"]);
                j--;
            }
            insertionSortItems[j+1] = temp;
            if (!(j <= 0)) {
                insertionSortAnimations.push([temp, insertionSortItems[j]])
            }
        }
        PrintArray(insertionSortItems);
        PrintArray(insertionSortAnimations);
        AnimateElements(insertionSortAnimations);
    }
});