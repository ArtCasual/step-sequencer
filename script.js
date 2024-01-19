//  SET ORIENTATION WHEN MOBILE
const modal = document.querySelector(".screenOrient");
const screenBtn = document.querySelector(".screenOrient__btn");

screenBtn.addEventListener("click", function () {
  document.documentElement.requestFullscreen();
  screen.orientation.lock("landscape");
  modal.style.display = "none";
});

// Buttons
const playBtn = document.querySelector(".play");
const pauseBtn = document.querySelector(".pause");
const saveBtn = document.querySelector(".save");
const loadBtn = document.querySelector(".load");
const bpmInput = document.querySelector(".bpm--input");
const bpmForm = document.querySelector(".bpm--form");
const noteUserInput = document.querySelector(".ui--note");
const scaleUserInput = document.querySelector(".ui--scale");
const saveMain = document.querySelector(".save-container");
const closeLoad = document.querySelector(".closeLoad-btn");

// const chooseScale = document.querySelector(".choose-scale");

// Tone.js
const synth = new Tone.Synth();
synth.oscillator.type = "sine";
const gain = new Tone.Gain(0.1);
synth.connect(gain);
gain.toDestination();

let index = 0;
let baseNote = noteUserInput.value;
let baseScale = scaleUserInput.value;
let chromaticScaleArray;
let userBaseScale;
let freq;
let sequencesDB;

// Selectors
const rowsC = document.querySelector(".note--C3");
const rowC = Array.from(rowsC.children);

const rowsD = document.querySelector(".note--D3");
const rowD = Array.from(rowsD.children);

const rowsE = document.querySelector(".note--E3");
const rowE = Array.from(rowsE.children);

const rowsF = document.querySelector(".note--F3");
const rowF = Array.from(rowsF.children);

const rowsG = document.querySelector(".note--G3");
const rowG = Array.from(rowsG.children);

const rowsA = document.querySelector(".note--A3");
const rowA = Array.from(rowsA.children);

const rowsB = document.querySelector(".note--B3");
const rowB = Array.from(rowsB.children);

const rowsAndColumns = [
  ...rowC,
  ...rowD,
  ...rowE,
  ...rowF,
  ...rowG,
  ...rowA,
  ...rowB,
];

// Columns or Steps

function getSteps(rowsAndColumns) {
  const steps = [];
  for (let i = 1; i <= 8; i++) {
    const step = rowsAndColumns.filter((column) => column.id.endsWith(i));
    steps.push(step);
  }
  return steps;
}

const allSteps = getSteps(rowsAndColumns);

let checkBoxes = Array.from(
  document.querySelectorAll("input[type=checkbox]:checked")
);

function unCheckingBoxes(stepsColumn) {
  stepsColumn.forEach((step) => {
    step.checked = false;
  });
}

// function that gets ids from checkboxes

function stateCheckBoxes(columns, step) {
  columns.forEach((column) => {
    column.addEventListener("change", (e) => {
      const checked = e.currentTarget.checked;
      if (e.currentTarget.classList.contains(step)) unCheckingBoxes(columns);
      if (checked) e.currentTarget.checked = true;
    });
  });
}

allSteps.forEach((step, i) => {
  stateCheckBoxes(step, i + 1);
});

// constructor based on the equation Notes to Freq
class Scale {
  constructor(
    note01,
    note02,
    note03,
    note04,
    note05,
    note06,
    note07,
    note08,
    note09,
    note10,
    note11,
    note12
  ) {
    this.note01 = baseNote;
    this.note02 = baseNote * 1.059463;
    this.note03 = baseNote * 1.122462;
    this.note04 = baseNote * 1.189207;
    this.note05 = baseNote * 1.259921;
    this.note06 = baseNote * 1.33484;
    this.note07 = baseNote * 1.414214;
    this.note08 = baseNote * 1.498307;
    this.note09 = baseNote * 1.587401;
    this.note10 = baseNote * 1.681793;
    this.note11 = baseNote * 1.781797;
    this.note12 = baseNote * 1.887749;
  }
}

// Functions
// Function Note to Freq

const convertNotesToFreq = function (note, octave = 4) {
  let notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    keyNumber;

  keyNumber = notes.indexOf(note);
  // note.slice(0,-1) for removing octave number

  if (keyNumber < 3) {
    keyNumber = keyNumber + 12 + (octave - 1) * 12 + 1;
  } else {
    keyNumber = keyNumber + (octave - 1) * 12 + 1;
  }

  // Return frequency of note
  baseNote = 440 * Math.pow(2, (keyNumber - 49) / 12);
  // baseNote = frequency;
};

// Create Scale FIX Refresh!!
const createScale = function () {
  convertNotesToFreq(baseNote);
  let userScale = new Scale(baseNote);
  chromaticScaleArray = Object.values(userScale);
};

const createMajorScale = function (arr) {
  let indexesMajor = [1, 3, 6, 8, 10];

  arr = arr.filter(function (value, index) {
    return indexesMajor.indexOf(index) == -1;
  });
  return arr;
};

const createMinorScale = function (arr) {
  let indexesMinor = [1, 4, 6, 9, 11];
  arr = arr.filter(function (value, index) {
    return indexesMinor.indexOf(index) == -1;
  });

  return arr;
};

// Set BPM
const setBPM = function () {
  Tone.Transport.bpm.value = +bpmInput.value;
};

// Note to Frequency Converter

const play = function (time) {
  Tone.Transport.start(time);
};

// const pause = function () {
//   Tone.Transport.pause();
// };

// SORTING FUNCTION ASCEDING
const customSort = (a, b) => {
  const numberA = parseInt(a.substring(1));
  const numberB = parseInt(b.substring(1));

  return numberA - numberB;
};

// LOAD SEQUENCES
const fetchAllSequences = function () {
  fetch("load_all_sequences.php")
    .then((response) => response.json())
    .then((sequences) => {
      sequencesDB = sequences;
    })
    .catch((error) => console.error("Error:", error));
  console.log("yo");
};

fetchAllSequences();

// Function to display the sequences in the UI
const listSequences = document.querySelector(".listSequences");

const createSequencesContainer = function () {
  listSequences.innerHTML = "";
  let sequences = sequencesDB.map((sequence) => {
    return sequence.steps;
  });

  console.log(sequences.length, listSequences.childElementCount);

  for (let i = 0; i < sequences.length; i++) {
    let sequence = document.createElement("li");

    sequence.textContent = sequences[i];

    listSequences.appendChild(sequence);

    sequence.addEventListener("click", (e) => {
      let chosenSequence = e.target.innerText.split(",");
      chooseSequence(chosenSequence);
    });
  }
  saveMain.appendChild(listSequences);
};
const chooseSequence = function (chosenSequence) {
  let allNotes = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  );
  // DELETE ALL NOTES
  allNotes.forEach((note) => {
    note.checked = false;
  });
  const allSteps = getSteps(rowsAndColumns);
  allSteps.forEach((columns) => {
    columns.forEach((steps) => {
      if (chosenSequence.includes(steps.id)) {
        steps.checked = true;
      }
    });
  });
};

// ////////////////////////////////////////////

// const loadSequence = function (sequenceName) {
//   fetch("load_sequence.php?sequence_name=" + sequenceName)
//     .then((response) => response.json())
//     .then((data) => {
//       // Handle the loaded sequence data
//       // console.log(data);
//       // Further processing with the loaded sequence data
//     })
//     .catch((error) => {
//       console.error("Failed to load the sequence.", error);
//     });
// };
///////////////////////////////////////////////

const saveSequence = function () {
  let currentNotes = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  );
  let dbNotes = currentNotes.map((el) => el.id.slice()).sort(customSort);

  // FETCH FUNCTION
  fetch("save_sequence.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value: dbNotes }),
  })
    .then((response) => response.text())
    .then((data) => {
      // console.log(data, sequencesDB.length);
      fetchAllSequences();
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });
};
let isSequencerPaused = false;

const pause = function (time) {
  // Stop the transport if it's currently playing
  Tone.Transport.stop(time);

  if (isSequencerPaused) {
    index = 0;
    stepLight(0);
  }
  isSequencerPaused = !isSequencerPaused;
};

function stepLight(steps) {
  document.querySelectorAll(".steps-lights-container_step").forEach((el) => {
    el.classList.remove("steps-lights-container_step--light");
  });

  const clickedStep = document.querySelector(
    `.steps-lights-container_step:nth-child(${steps + 1})`
  );

  clickedStep.classList.add("steps-lights-container_step--light");
}

// Repeat Function//////////////////////////////////////////////////////

function repeat(time, scaleArr) {
  let steps = index % 8;
  index++;

  stepLight(steps);

  const inputs = [rowC, rowD, rowE, rowF, rowG, rowA, rowB].map(
    (row) => row[steps]
  );
  inputs.forEach((input, index) => {
    if (input.checked) synth.triggerAttackRelease(scaleArr[index], "8n", time);
  });
}

Tone.Transport.scheduleRepeat((time) => {
  repeat(time, userBaseScale);
}, "8n");

// Handlers

noteUserInput.addEventListener("change", function (e) {
  baseNote = e.target.value;
  createScale();

  // REFACTOR
  if (baseScale === "Major")
    userBaseScale = createMajorScale(chromaticScaleArray);

  if (baseScale === "Minor")
    userBaseScale = createMinorScale(chromaticScaleArray);
});

scaleUserInput.addEventListener("change", function (e) {
  baseScale = e.target.value;

  // REFACTOR
  if (baseScale === "Major")
    userBaseScale = createMajorScale(chromaticScaleArray);

  if (baseScale === "Minor")
    userBaseScale = createMinorScale(chromaticScaleArray);
});

window.addEventListener("load", function () {
  createScale();
  setBPM();
  userBaseScale = createMajorScale(chromaticScaleArray);
});

playBtn.addEventListener("click", function () {
  play();
});

pauseBtn.addEventListener("click", function () {
  pause();
});

saveBtn.addEventListener("click", () => {
  saveSequence();
});

loadBtn.addEventListener("click", () => {
  fetchAllSequences();
  saveMain.showModal();
  createSequencesContainer();
});

closeLoad.addEventListener("click", () => {
  saveMain.close();
});

bpmForm.addEventListener("submit", function (e) {
  e.preventDefault();
  setBPM();
});

bpmForm.addEventListener("change", function (e) {
  e.preventDefault();
  setBPM();
});

// Major Scale
// const getMajorScale = function (object) {
//   const majorScale = { ...object };
//   delete majorScale.note02;
//   delete majorScale.note04;
//   delete majorScale.note07;
//   delete majorScale.note09;
//   delete majorScale.note11;

//   const majorScaleArray = Object.values(majorScale);

//   return majorScaleArray;
// };

// // Minor Scale
// const getMinorScale = function (object) {
//   const minorScale = { ...object };
//   delete minorScale.note02;
//   delete minorScale.note05;
//   delete minorScale.note07;
//   delete minorScale.note10;
//   delete minorScale.note11;

//   const minorScaleArray = Object.values(minorScale);

//   return minorScaleArray;
// };

// const setOctave = function (scale, oct) {
//   notesOct = scale.map((note) => `${note}${oct}`);
//   notesOct.push(scale[0] + (oct + 1));

//   return notesOct;
// };

// setOctave(notes, 3);
// console.log(notesOct);
