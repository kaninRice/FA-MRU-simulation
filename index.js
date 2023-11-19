/* Input Sidebar */
const sequenceBtn = document.querySelector('.sequence-button');
const randomBtn = document.querySelector('.random-button');
const midrepeatBtn = document.querySelector('.midrepeat-button');

const sequenceInputList = document.querySelector('.sequence-input');

const stepBtn = document.querySelector('.step-button');
const finalBtn = document.querySelector('.final-button');
const resetBtn = document.querySelector('.reset-button');

/* Cache Section */
const cacheBlockList = document.querySelector('.cache-block-list');

/*  Output Sidebar */
const memoryAccessCount = document.querySelector('.access-count');
const cacheHitCount = document.querySelector('.hit-count');
const cacheMissCount = document.querySelector('.miss-count');
const cacheHitRate = document.querySelector('.hit-rate');
const cacheMissRate = document.querySelector('.miss-rate');
const aveMemoryAccessTime = document.querySelector('.ave-access-time');
const totMemoryAccessTime = document.querySelector('.total-access-time');
const textLog = document.querySelector('#text-log');

const CACHE_BLOCK_NUM = 16;
const TEXT_LOG = [
    '00: ',
    '01: ',
    '02: ',
    '03: ',
    '04: ',
    '05: ',
    '06: ',
    '07: ',
    '08: ',
    '09: ',
    '10: ',
    '11: ',
    '12: ',
    '13: ',
    '14: ',
    '15: ',
];

let inputArray = [];
let currInputIndex = -1;
let mruIndex = -1;

function initializeSim() {
    /* Sequence test case is default */
    generateSequence();
    updateSequenceInput();

    sequenceBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateSequence();
        updateSequenceInput();
        toggleStepFinal('enable');
    });

    randomBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateRandom();
        updateSequenceInput();
        toggleStepFinal('enable');
    });

    midrepeatBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateMidRepeat();
        updateSequenceInput();
        toggleStepFinal('enable');
    });

    stepBtn.addEventListener('click', () => {
        currInputIndex++;
        // stepFAMRU();
        // updateCacheBlock();
        updateSequenceInputHighlight();

        if (currInputIndex == inputArray.length - 1) {
            toggleStepFinal('disable');
        }
    });

    finalBtn.addEventListener('click', () => {
        currInputIndex = inputArray.length - 1;
        // finalFAMRU();
        // updateCacheBlock();
        updateSequenceInputHighlight();
        toggleStepFinal('disable');
    });

    resetBtn.addEventListener('click', () => {
        currInputIndex = -1;
        resetCacheBlock();
        updateSequenceInputHighlight();
        toggleStepFinal('enable');
    });
}

/* Input Sidebar */
function generateSequence() {
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < CACHE_BLOCK_NUM * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function generateRandom() {
    inputArray = [];

    for (let i = 0; i < CACHE_BLOCK_NUM * 4; i++) {
        inputArray.push(Math.floor(Math.random() * 100)); /* 0 - 99 */
    }
}

function generateMidRepeat() {
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < CACHE_BLOCK_NUM; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < CACHE_BLOCK_NUM * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function updateSequenceInput() {
    sequenceInputList.textContent = '';

    for (let i = 0; i < inputArray.length; i++) {
        sequenceInputList.innerHTML += `<li class="">${inputArray[i]}</li>`;
    }
}

function updateSequenceInputHighlight() {
    let sequenceInput = [...sequenceInputList.children];
    let prevInput = document.querySelector('.current-input');
    console.log(prevInput);
    if (prevInput != null) {
        prevInput.classList.remove('current-input');
    }

    if (currInputIndex >= 0) {
        sequenceInput[currInputIndex].classList.add('current-input');
    }
}

/* Cache Section */
function stepFAMRU() {
    /* TODO: */
}

function finalFAMRU() {
    /* TODO: */
}

function resetCacheBlock() {
    for (let i = 0; i < CACHE_BLOCK_NUM; i++) {
        updateCacheBlock(i, null);
    }
}

function updateCacheBlock(cacheIndex, value) {
    let cacheBlocks = [...cacheBlockList.children];
    let prevMRU = document.querySelector('.mru');

    if (prevMRU != null) {
        prevMRU.classList.remove('mru');
        prevMRU.children[2].textContent = '';
    }

    if (cacheIndex >= 0 && value == null) {
        cacheBlocks[cacheIndex].children[1].textContent = '';
        cacheBlocks[cacheIndex].children[2].textContent = '';
    } else {
        cacheBlocks[cacheIndex].classList.add('mru');
        cacheBlocks[cacheIndex].children[1].textContent = `${value}`;
        cacheBlocks[cacheIndex].children[2].textContent = `MRU`;
    }
}

/* Output Sidebar */
function updateMemoryAccessCount(value) {
    memoryAccessCount.textContent = `${value}`;
}

function updateCacheHitCount(value) {
    cacheHitCount.textContent = `${value}`;
}

function updateCacheMissCount(value) {
    cacheMissCount.textContent = `${value}`;
}

function updateCacheHitRate(value) {
    cacheHitRate.textContent = `${value}`;
}

function updateCacheMissRate(value) {
    cacheMissRate.textContent = `${value}`;
}

function updateAveMemoryAccessTime(value) {
    aveMemoryAccessTime.textContent = `${value}`;
}

function updateTotMemoryAccessTime(value) {
    totMemoryAccessTime.textContent = `${value}`;
}

function updateTextLog(cacheIndex, value) {
    TEXT_LOG[cacheIndex] = TEXT_LOG[cacheIndex].concat(value, ', ');
    textLog.textContent = TEXT_LOG.join('\n');
}

/* Other */
function toggleStepFinal(option) {
    if (option === 'enable') {
        stepBtn.disabled = false;
        finalBtn.disabled = false;
    } else {
        stepBtn.disabled = true;
        finalBtn.disabled = true;
    }
}

initializeSim();
