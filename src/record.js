export class Record {
    constructor(noteEmitter) {
        this.noteEmitter = noteEmitter;
        this.recording = false;
        this.recordedEvents = { track1: [], track2: [], track3: [], track4: [] };
        this.recordingStartTime = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.noteEmitter.on("play", ({ midiNote, position }) => {
            console.log(midiNote);
            if (this.recording) {
                const currentTime = performance.now() / 1000; // Convert milliseconds to seconds
                this.recordedEvents[this.selectedTrack].push({
                    midiNote: midiNote,
                    position: position,
                    time: currentTime - this.recordingStartTime,
                    state: 'on'
                });
            }
        });

        this.noteEmitter.on("stop", ({
            midiNote, position }) => {
            console.log(midiNote);
            if (this.recording) {
                const currentTime = performance.now() / 1000; // Convert milliseconds to seconds
                this.recordedEvents[this.selectedTrack].push({
                    midiNote: midiNote,
                    position: position,
                    time: currentTime - this.recordingStartTime,
                    state: 'off'
                });
            }
        });
    }

    startRecording(selectedTrack) {
        console.log('Start Recording');
        this.recording = true;
        this.selectedTrack = selectedTrack;
        this.recordedEvents = { track1: [], track2: [], track3: [], track4: [] };
        this.recordingStartTime = performance.now() / 1000; // Store the start time in seconds
    }

    stopRecording() {
        console.log('Stop Recording');
        this.recording = false;
        this.saveRecording();
    }

    playRecording(selectedTrack) {
        console.log('Play Recording');
        this.recording = false;
        this.noteEmitter.emit("stopAll", {});

        this.recordedEvents[selectedTrack].forEach(event => {
            setTimeout(() => {
                if (event.state === 'on') {
                    this.noteEmitter.emit("play", { midiNote: event.midiNote, position: event.position });
                } else if (event.state === 'off') {
                    this.noteEmitter.emit("stop", { midiNote: event.midiNote });
                }
            }, event.time * 1000); // Adjust time based on recording start time
        });
    }

    saveRecording() {
        console.log('Save Recording');
        const recordedData = this.recordedEvents[this.selectedTrack].map(event => ({
            midiNote: event.midiNote,
            time: event.time,
            state: event.state
        }));

        const dataStr = JSON.stringify(recordedData);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `${this.selectedTrack}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
