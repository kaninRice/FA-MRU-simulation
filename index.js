/* Input Sidebar */
const sequenceBtn = document.querySelector('.sequence-button');
const randomBtn = document.querySelector('.random-button');
const midrepeatBtn = document.querySelector('.midrepeat-button');
const totalMemBlocks = document.querySelector('#num-mem-blocks');
const sequenceInputList = document.querySelector('.sequence-input');
const submitBtn = document.querySelector('.submit-button');
const stepBtn = document.querySelector('.step-button');
const finalBtn = document.querySelector('.final-button');
const resetBtn = document.querySelector('.reset-button');
let lastBtn = "Sequence"

// custom sequence
const customBtn = document.querySelector('.custom-button');
const customSeqInput = document.querySelector('.customSeqInput');
const pushBlock = document.querySelector('#pushblocks');
const pushErr = document.querySelector('.pushErr');
const pushCustomBtn = document.querySelector('.pushCustomBtn');
const clearCustomBtn = document.querySelector('.clearCustomBtn');

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
const CACHE_LINE_NUM = 32;
const CACHE_ACCESS_TIME = 1;
const MEMORY_ACCESS_TIME = 1 + (10 + CACHE_LINE_NUM * 10) / 2;
let TOTAL_MEM_BLOCKS = parseInt(totalMemBlocks.value);
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
let hit = 0;
let miss = 0;

initializeSim();
function initializeSim() {
    /* Sequence test case is default */

    //recall las sequence used when changing total memory blocks
    updateButton(lastBtn);
    updateSequenceInput();

    submitBtn.addEventListener('click', () => {
        //resetAll
        resetAll();
        TOTAL_MEM_BLOCKS = totalMemBlocks.value;
        updateButton(lastBtn);
        updateSequenceInput();
    });

    sequenceBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateSequence();
        updateSequenceInput();
        toggleStepFinal('enable');
        updateButton('Sequence');
    });

    randomBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateRandom();
        updateSequenceInput();
        toggleStepFinal('enable');
        updateButton('Random');
    });

    midrepeatBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateMidRepeat();
        updateSequenceInput();
        toggleStepFinal('enable');
        updateButton('Mid-repeat');
    });

    customBtn.addEventListener('click', () => {
        currInputIndex = -1;
        updateButton('Custom');
        generateCustom();
    });

    stepBtn.addEventListener('click', () => {
        currInputIndex++;
        let index = 0;
        index = stepFAMRU(inputArray[currInputIndex]);
        updateCacheBlock(index, inputArray[currInputIndex]);

        updateCacheHitCount(hit);
        updateCacheMissCount(miss);
        updateMemoryAccessCount(miss + hit);
        const hitRate = hit / (hit + miss);
        const missRate = miss / (hit + miss);
        updateCacheHitRate(hitRate);
        updateCacheMissRate(missRate);
        updateAveMemoryAccessTime(
            hitRate * CACHE_ACCESS_TIME + missRate * MISS_PENALTY
        );
        updateTotMemoryAccessTime(
            (hit * CACHE_LINE_NUM * CACHE_ACCESS_TIME)
            + (miss * CACHE_LINE_NUM * (MEMORY_ACCESS_TIME + CACHE_ACCESS_TIME))
            + (miss * CACHE_ACCESS_TIME));
        updateTextLog(index, inputArray[currInputIndex]);
        updateSequenceInputHighlight();
        if (currInputIndex == inputArray.length - 1) {
            toggleStepFinal('disable');
        }
    });

    finalBtn.addEventListener('click', () => {
        finalFAMRU();
        toggleStepFinal('disable');
    });

    resetBtn.addEventListener('click', () => {
        currInputIndex = -1;
        mruIndex = -1;
        hit = 0;
        miss = 0;
        resetOutput();
        resetCacheBlock();
        updateSequenceInputHighlight();
        toggleStepFinal('enable');
    });
}


function updateButton(btn) {
    lastBtn = btn;
    customSeqInput.style.display = "none";
    if(lastBtn == "Random"){
        generateRandom();
        midrepeatBtn.disabled = false;
        randomBtn.disabled = true;
        sequenceBtn.disabled = false;
        customBtn.disabled = false;
    }else if(lastBtn == "Mid-repeat"){
        generateMidRepeat();
        midrepeatBtn.disabled = true;
        randomBtn.disabled = false;
        sequenceBtn.disabled = false;
        customBtn.disabled = false;
    } else if (lastBtn == "Custom"){
        generateCustom();
        midrepeatBtn.disabled = false;
        randomBtn.disabled = false;
        sequenceBtn.disabled = false;
        customBtn.disabled = true;
    } else {
        generateSequence();
        midrepeatBtn.disabled = false;
        randomBtn.disabled = false;
        sequenceBtn.disabled = true;
        customBtn.disabled = false;
    }
}

/* Input Sidebar */
function generateSequence() {
    resetAll();
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < TOTAL_MEM_BLOCKS && i < CACHE_BLOCK_NUM * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function generateRandom() {
    inputArray = [];
    resetAll();
    for (let i = 0; i < CACHE_BLOCK_NUM * 4; i++) {
        inputArray.push(Math.floor(Math.random() * TOTAL_MEM_BLOCKS )); /* 0 - # of memory blocks */
    }
}

function generateMidRepeat() {
    resetAll();
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < TOTAL_MEM_BLOCKS && i < CACHE_BLOCK_NUM; i++) {
        tmp.push(i);
    }

    for (let i = 1; i < TOTAL_MEM_BLOCKS && i < CACHE_BLOCK_NUM * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i <NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function generateCustom () {
    customSeqInput.style.display = null;
    resetAll();
    inputArray = [];
    sequenceInputList.textContent = '';
}

pushCustomBtn.addEventListener('click', () => {
    blockInput = parseInt(pushBlock.value)
    pushErr.style.display = "none";
    if (Number.isInteger(blockInput)) { 
        if(blockInput >= 0 && blockInput < TOTAL_MEM_BLOCKS) {
        inputArray.push(blockInput)
        sequenceInputList.innerHTML += `<li class="">${blockInput}</li>`
        pushBlock.value = "";
        toggleStepFinal('enable');
    } else {
        pushErr.style.display = null;
    }}
})

clearCustomBtn.addEventListener('click', () => {
    pushBlock.value = "";
    pushErr.style.display = "none";
    generateCustom ()
})

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
function stepFAMRU(currInput) {
    /* TODO: */
    //check if  mm block  is stored in cache
    //if yes, then transfer mru to the  cache index containing the  mm block
    //else check if there is available space in cache,
    //if yes, then place the mm in the free space
    //else replace the existing mm block in the cache index containing mru
    let cacheBlocks = [...cacheBlockList.children];
    let isHit = false;
    let prevMRU = -1;
    for(let i = 0; i < CACHE_BLOCK_NUM; i++) {
        if(cacheBlocks[i].children[2].textContent == 'MRU') {
            prevMRU = i;
        }
        if(currInput == parseInt(cacheBlocks[i].children[1].textContent)) {
            mruIndex = i;
            hit+=1;
            console.log("hit = "+hit);
            return i;
        }
    }
    if(!isHit){

        miss+=1;
        if(miss > 16){
            return prevMRU; //not hit and cache is full
        }
    }
    return miss-1; //not hit and cache is not full
    
}

function finalFAMRU() {
    /* TODO: */
    //get the number of repititions of the stepFAMRU left
    //loop stepFAMRU for the number of repititions
    let total = inputArray.length - currInputIndex;
        for(i=0; i<total-1; i++){
            currInputIndex++;
            let index = 0;
            index = stepFAMRU(inputArray[currInputIndex]);
            updateCacheBlock(index, inputArray[currInputIndex]);
            
            updateCacheHitCount(hit);
            updateCacheMissCount(miss);
            updateMemoryAccessCount(miss+hit);
            const hitRate = hit/(hit+miss);
            const missRate = miss/(hit+miss);
            updateCacheHitRate(hitRate);
            updateCacheMissRate(missRate);
            updateAveMemoryAccessTime(hitRate*1 + ((10+20)/2)* missRate);
            updateTotMemoryAccessTime(hit*2 + miss* (20+1)); 
            updateTextLog(index, inputArray[currInputIndex]);
            updateSequenceInputHighlight();
        }
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
function resetOutput() {
    updateMemoryAccessCount(0);
    updateCacheHitCount(0);
    updateCacheMissCount(0);
    updateCacheHitRate(0);
    updateCacheMissRate(0);
    updateAveMemoryAccessTime(0);
    updateTotMemoryAccessTime(0);
    for(let i = 0; i < TEXT_LOG.length; i++) {
        TEXT_LOG[i] = TEXT_LOG[i].substring(0, 4);
        textLog.textContent = TEXT_LOG.join('\n');
    }
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
function resetAll(){
    resetOutput();
    resetCacheBlock();
    currInputIndex = -1;
    mruIndex = -1;
    hit = 0;
    miss = 0;
    updateSequenceInputHighlight();
    toggleStepFinal('enable');
}


