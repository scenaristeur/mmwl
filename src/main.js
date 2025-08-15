import Emittery from "emittery";
import "./layout.css";
import "./style.css";
import "./timeline.css";
import { Engine } from "./audio/engine";
import { Midi } from "./midi";
import { UI } from "./ui";
import { computeFrequency, Synth } from "./audio/synth";

const noteEmitter = new Emittery();
const engine = new Engine();
const midi = new Midi(noteEmitter);
const synth = new Synth();
const uiInstance = new UI(synth, noteEmitter);

uiInstance.init(getStarted);

// Play note and update indicators
noteEmitter.on("play", ({ midiNote, position }) => {
  console.log(midiNote);
  engine.render(synth.playNote(midiNote, uiInstance.selectedTrack, position));
  uiInstance.setMIDINote(midiNote);
  uiInstance.setFrequency(computeFrequency(midiNote));
  uiInstance.addNoteIndicator(uiInstance.selectedTrack, position);
});

// Stop note
noteEmitter.on("stop", ({ midiNote }) => {
  engine.render(synth.stopNote(midiNote, uiInstance.selectedTrack));
});

// Stop all notes
noteEmitter.on("stopAll", () => {
  engine.render(synth.stopAllNotes());
});

/** Initialize WebMidi, web audio, and Elementary audio on
 * first user interaction. Display MIDI note and frequency
 * indicators.
 *
 * @returns {void}
 */
async function getStarted() {
  await midi.initialize(displayControllers);
  await engine.initialize();
  uiInstance.getStarted();
}

/** Display available controllers and wire them up with
 * set controller event handlers.
 *
 * @param {string[]} controllers
 * @param {string} selectedController
 */
function displayControllers(controllers, selectedController) {
  uiInstance.setControllers(controllers, selectedController, setController);
}

/** Set the active controller.
 *
 * @param {string} controller The selected controller.
 */
function setController(controller) {
  midi.setController(controller);
  uiInstance.selectController(controller);
}
