/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";

export class PianoVoice {
    constructor(key, gate, freq) {
        this.key = key;
        this.gate = gate;
        this.freq = freq;
    }

    generate() {
        console.log("Voice:", this);
        console.log("Gate:", this.gate);
        console.log("Freq:", this.freq);
        console.log("Key:", this.key);

        const gateNode = el.const({ key: `${this.key}:gate`, value: this.gate });
        const freqNode = el.const({ key: `${this.key}:freq`, value: this.freq });

        // ADSR envelope
        const attack = 0.01;
        const decay = 0.1;
        const sustain = 0.5;
        const release = 0.5;

        const env = el.adsr(
            attack,
            decay,
            sustain,
            release,
            gateNode,
        );
        console.log("ADSR Env Attack:", attack);
        console.log("ADSR Env Decay:", decay);
        console.log("ADSR Env Sustain:", sustain);
        console.log("ADSR Env Release:", release);
        console.log("ADSR Env Gate:", gateNode);

        // Piano waveform approximation
        const waveform = el.add(
            el.cycle(freqNode),
            el.mul(0.5, el.cycle(el.mul(freqNode, 2))),
            el.mul(0.25, el.cycle(el.mul(freqNode, 3))),
            el.mul(0.125, el.cycle(el.mul(freqNode, 4)))
        );
        console.log("Waveform:", waveform);

        return el.mul(gateNode, el.mul(env, waveform));
    }
}
