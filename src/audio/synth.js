/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";
import { PianoVoice } from "./pianoVoice.js";

export class Synth {
  constructor() {
    this.voices = [];
    this.attack = 0.01;
    this.decay = 0.1;
    this.sustain = 0.5;
    this.release = 0.5;
  }

  /** Play a note. Adds note to voices and limits polyphony
   * to eight voices by dropping oldest voices.
   *
   * @param {number} midiNote The note to play.
   * @returns {ElemNode}
   */
  playNote(midiNote) {
    const key = `v${midiNote}`;
    const freq = computeFrequency(midiNote);

    // Add note to voices after removing previous instances.
    this.voices = this.voices
      .filter((voice) => voice.key !== key)
      .concat(new PianoVoice(key, 1, freq, this.attack, this.decay, this.sustain, this.release))
      .slice(-8);

    return synth(this.voices);
  }

  /** Stop a note. Return silence if last note.
   *
   * @param {number} midiNote The note to stop.
   * @returns {ElemNode}
   */
  stopNote(midiNote) {
    const key = `v${midiNote}`;
    this.voices = this.voices.filter((voice) => voice.key !== key);

    if (this.voices.length > 0) {
      return synth(this.voices);
    } else {
      return silence();
    }
  }

  /** Remove all voices and return silence.
   *
   * @returns {ElemNode}
   */
  stopAllNotes() {
    this.voices = [];

    return silence();
  }

  updateParams(params) {
    if (params.attack !== undefined) this.attack = params.attack;
    if (params.decay !== undefined) this.decay = params.decay;
    if (params.sustain !== undefined) this.sustain = params.sustain;
    if (params.release !== undefined) this.release = params.release;

    this.voices.forEach(voice => {
      voice.updateParams(params);
    });
  }
}

/** Compute frequency using 12-tone equal temperament.
 *
 * @param {number} midiNote
 * @returns {number}
 */
export function computeFrequency(midiNote) {
  return 440 * 2 ** ((midiNote - 69) / 12);
}

/** Sum voices and reduce overall amplitude.
 *
 * @param {PianoVoice[]} voices
 * @returns {ElemNode}
 */
function synth(voices) {
  return el.mul(el.add(...voices.map((voice) => voice.generate())), 0.1);
}

/** Create silence. We render silence when no voices are active.
 *
 * @returns {ElemNode}
 */
function silence() {
  return el.const({ key: "silence", value: 0 });
}
