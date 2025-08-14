import { WebMidi } from "webmidi";

export class Midi {
  noteEmitter;
  selectedInput;

  constructor(noteEmitter) {
    this.noteEmitter = noteEmitter;
    this.selectedInput = null;
  }

  /** Initialize MIDI. Note that we cannot do this in this constructor because
   * we need async for WebMidi.
   *
   * @callback displayControllers Callback to update displayed controllers.
   * @returns {void}
   */
  async initialize(displayControllers) {
    try {
      await WebMidi.enable();
      console.log("WebMidi enabled");
      console.log("Inputs:", WebMidi.inputs);
      console.log("Selected Input:", this.selectedInput);
      displayControllers(this.#getInputNames(), this.selectedInput?.name);

      WebMidi.addListener("connected", () => {
        console.log("MIDI connected");
        console.log("Inputs:", WebMidi.inputs);
        console.log("Selected Input:", this.selectedInput);
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });

      WebMidi.addListener("disconnected", () => {
        console.log("MIDI disconnected");
        console.log("Inputs:", WebMidi.inputs);
        console.log("Selected Input:", this.selectedInput);
        displayControllers(this.#getInputNames(), this.selectedInput?.name);
      });
    } catch (err) {
      console.error("WebMidi could not be initialized:", err);
    }
  }

  /** Set the active controller by wiring it up to the note emitter.
   *
   * @param {string} name The name of the selected controller.
   * @returns {void}
   */
  setController(controller) {
    console.log("Setting controller:", controller);
    console.log("Current selectedInput:", this.selectedInput);

    // Stop any active notes
    this.noteEmitter.emit("stopAll");

    // Remove listeners from the previous input
    if (this.selectedInput) {
      this.selectedInput.removeListener("noteon");
      this.selectedInput.removeListener("noteoff");
    }

    // Set the new input
    this.selectedInput = WebMidi.getInputByName(controller);
    console.log("New selectedInput:", this.selectedInput);

    // Add note on listener
    if (this.selectedInput) {
      this.selectedInput.addListener("noteon", (event) => {
        const midiNote = event.note.number;
        console.log("Note on:", midiNote);
        this.noteEmitter.emit("play", { midiNote });
      });

      // Add note off listener
      this.selectedInput.addListener("noteoff", (event) => {
        const midiNote = event.note.number;
        console.log("Note off:", midiNote);
        this.noteEmitter.emit("stop", { midiNote });
      });
    } else {
      console.error("Selected input is undefined");
    }
  }

  /** Get WebMidi input names.
   *
   * @returns {string[]} The input names.
   */
  #getInputNames() {
    return WebMidi.inputs.map((input) => input.name);
  }
}
