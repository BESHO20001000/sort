let array = [];
let speed = 50;
let comparisons = 0;
let swaps = 0;
let startTime;
let interval;

function generateArray() {
  const container = document.getElementById('array-container');
  container.innerHTML = '';
  array = [];
  const size = document.getElementById('size').value;

  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 20;
    array.push(value);

    const barWrapper = document.createElement('div');
    barWrapper.classList.add('bar-wrapper');

    const label = document.createElement('span');
    label.classList.add('label');
    label.innerText = value;

    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;

    barWrapper.appendChild(label);
    barWrapper.appendChild(bar);
    container.appendChild(barWrapper);
  }
  resetStats();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort() {
  resetStats();
  speed = 100 - document.getElementById('speed').value;
  const algo = document.getElementById('algo-select').value;
  startTime = Date.now();
  interval = setInterval(updateTimer, 100);

  if (algo === 'bubble') await bubbleSort();
  else if (algo === 'selection') await selectionSort();
  else if (algo === 'insertion') await insertionSort();
  else if (algo === 'quick') await quickSort(0, array.length - 1);
  else if (algo === 'merge') await mergeSort(0, array.length - 1);

  clearInterval(interval);
}

function resetArray() {
  generateArray();
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  document.getElementById('comparisons').innerText = 0;
  document.getElementById('swaps').innerText = 0;
  document.getElementById('timer').innerText = '0.0';
}

function updateStats() {
  document.getElementById('comparisons').innerText = comparisons;
  document.getElementById('swaps').innerText = swaps;
}

function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  document.getElementById('timer').innerText = elapsed.toFixed(1);
}

function updateBar(index, value) {
  const container = document.getElementById('array-container').children[index];
  const bar = container.querySelector('.bar');
  const label = container.querySelector('.label');
  bar.style.height = `${value}px`;
  label.innerText = value;
}

// Algorithms
async function bubbleSort() {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      updateStats();
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        updateStats();
        updateBar(j, array[j]);
        updateBar(j + 1, array[j + 1]);
      }
      await sleep(speed);
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      updateStats();
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      await sleep(speed);
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      swaps++;
      updateStats();
      updateBar(i, array[i]);
      updateBar(minIdx, array[minIdx]);
    }
    await sleep(speed);
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      comparisons++;
      updateStats();
      array[j + 1] = array[j];
      updateBar(j + 1, array[j + 1]);
      j--;
      swaps++;
      updateStats();
      await sleep(speed);
    }
    array[j + 1] = key;
    updateBar(j + 1, array[j + 1]);
    await sleep(speed);
  }
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    comparisons++;
    updateStats();
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      swaps++;
      updateStats();
      updateBar(i, array[i]);
      updateBar(j, array[j]);
      await sleep(speed);
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  swaps++;
  updateStats();
  updateBar(i + 1, array[i + 1]);
  updateBar(high, array[high]);
  await sleep(speed);
  return i + 1;
}

async function mergeSort(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let merged = [];
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    comparisons++;
    updateStats();
    if (array[i] < array[j]) {
      merged.push(array[i++]);
    } else {
      merged.push(array[j++]);
    }
    await sleep(speed);
  }
  while (i <= mid) merged.push(array[i++]);
  while (j <= end) merged.push(array[j++]);
  
  for (let k = start; k <= end; k++) {
    array[k] = merged[k - start];
    updateBar(k, array[k]);
    swaps++;
    updateStats();
    await sleep(speed);
  }
}

// Dark Mode
const toggleMode = document.getElementById('toggle-mode');
toggleMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
