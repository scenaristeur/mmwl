import { Track } from './track';

export class Timeline {
    constructor(uiInstance) {
        this.uiInstance = uiInstance;
        this.noteEmitter = uiInstance.noteEmitter;
        this.timelineDiv = document.getElementById('timeline');
        this.tracks = [];
        this.speedInput = null;
        this.speed = 1; // Default speed in seconds
        this.intervalId = null;
        this.init();
    }

    init() {
        // Create 4 tracks
        for (let i = 1; i <= 4; i++) {
            const track = new Track(i, this.uiInstance, this.timelineDiv);
            this.tracks.push(track);
        }

        // Add play button
        const playButton = document.createElement('button');
        playButton.id = 'timeline-play';
        playButton.textContent = 'Play';
        playButton.addEventListener('click', () => this.startScroll());
        this.timelineDiv.appendChild(playButton);

        // Add stop button
        const stopButton = document.createElement('button');
        stopButton.id = 'timeline-stop';
        stopButton.textContent = 'Stop';
        stopButton.addEventListener('click', () => this.stopScroll());
        this.timelineDiv.appendChild(stopButton);

        // Add speed input
        const speedInput = document.createElement('input');
        speedInput.type = 'range';
        speedInput.id = 'timeline-speed';
        speedInput.min = '1';
        speedInput.max = '10';
        speedInput.step = '0.1';
        speedInput.value = '1';
        speedInput.addEventListener('input', (event) => {
            this.speed = parseFloat(event.target.value);
        });
        this.timelineDiv.appendChild(speedInput);

        // Select the default track
        this.selectTrack('track1');
    }

    selectTrack(trackId) {
        // Deselect all tracks
        this.tracks.forEach(track => {
            track.element.classList.remove('selected');
        });

        // Select the clicked track
        const selectedTrack = this.tracks.find(track => track.id === trackId);
        if (selectedTrack) {
            selectedTrack.element.classList.add('selected');
        }

        // Update the selected track
        this.uiInstance.selectedTrack = trackId;
    }

    addNoteIndicator(trackId, position) {
        const track = this.tracks.find(track => track.id === trackId);
        if (track) {
            track.addNoteIndicator(position);
        }
    }

    startScroll() {
        this.stopScroll(); // Clear any existing interval
        this.intervalId = setInterval(() => {
            this.tracks.forEach(track => {
                const currentLeft = parseFloat(track.scrollBar.style.left);
                const newLeft = currentLeft + 0.1 / this.speed; // Adjust speed

                if (newLeft >= 100) {
                    track.scrollBar.style.left = '0%';
                } else {
                    track.scrollBar.style.left = `${newLeft}%`;
                }

                // Emit note position based on scroll bar position
                const position = newLeft;
                const midiNote = 60; // Example MIDI note number for C4
                this.uiInstance.synth.playNote(midiNote, track.id, position);
                track.addNoteIndicator(position);
                this.noteEmitter.emit("play", { midiNote, position });
            });
        }, 100); // Update every 100ms
    }

    stopScroll() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
