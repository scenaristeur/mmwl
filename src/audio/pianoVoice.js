/**
@typedef {import('@elemaudio/core').ElemNode} ElemNode
*/

import { el } from "@elemaudio/core";

export class PianoVoice {
    constructor(key, gate, freq, attack = 0.01, decay = 0.1, sustain = 0.5, release = 0.5) {
        this.key = key;
        this.gate = gate;
        this.freq = freq;
        this.attack = attack;
        this.decay = decay;
        this.sustain = sustain;
        this.release = release;
    }

    updateParams(params) {
        if (params.attack !== undefined) this.attack = params.attack;
        if (params.decay !== undefined) this.decay = params.decay;
        if (params.sustain !== undefined) this.sustain = params.sustain;
        if (params.release !== undefined) this.release = params.release;
    }

    generate() {
        console.log("Voice:", this);
        console.log("Gate:", this.gate);
        console.log("Freq:", this.freq);
        console.log("Key:", this.key);

        const gateNode = el.const({ key: `${this.key}:gate`, value: this.gate });
        const freqNode = el.const({ key: `${this.key}:freq`, value: this.freq });

        // ADSR envelope
        const env = el.adsr(
            this.attack,
            this.decay,
            this.sustain,
            this.release,
            gateNode,
        );
        console.log("ADSR Env Attack:", this.attack);
        console.log("ADSR Env Decay:", this.decay);
        console.log("ADSR Env Sustain:", this.sustain);
        console.log("ADSR Env Release:", this.release);
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
