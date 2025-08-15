/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";
import { PianoVoice } from "./pianoVoice.js";

export class Synth {
  voices = [];

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
      .concat(new PianoVoice(key, 1, freq))
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
