export class Timeline {
    constructor(uiInstance) {
        this.uiInstance = uiInstance;
        this.noteEmitter = uiInstance.noteEmitter;
        this.timelineDiv = document.getElementById('timeline');
        this.tracks = [];
        this.scrollBar = document.createElement('div');
        this.scrollBar.id = 'scroll-bar';
        this.scrollBar.style.position = 'absolute';
        this.scrollBar.style.height = '100%';
        this.scrollBar.style.width = '2px';
        this.scrollBar.style.backgroundColor = 'white';
        this.scrollBar.style.transition = 'left 0.1s';
        this.scrollBar.style.left = '0%';
        this.speedInput = null;
        this.speed = 1; // Default speed in seconds
        this.intervalId = null;
        this.init();
    }

    init() {
        // Create 4 tracks
        for (let i = 1; i <= 4; i++) {
            const track = document.createElement('div');
            track.id = `track${i}`;
            track.className = 'track';
            this.tracks.push(track);
            this.timelineDiv.appendChild(track);
        }

        // Add scroll bar
        this.timelineDiv.appendChild(this.scrollBar);

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
            track.classList.remove('selected');
        });

        // Select the clicked track
        const selectedTrack = document.querySelector(`#${trackId}`);
        selectedTrack.classList.add('selected');

        // Update the selected track
        this.uiInstance.selectedTrack = trackId;
    }

    addNoteIndicator(trackId, position) {
        const track = document.querySelector(`#${trackId}`);
        const noteIndicator = document.createElement('div');
        noteIndicator.className = 'note-indicator';
        noteIndicator.style.left = `${position}%`;

        track.appendChild(noteIndicator);

        // Remove the note indicator after a short delay
        setTimeout(() => {
            track.removeChild(noteIndicator);
        }, 5000); // 5 seconds
    }

    startScroll() {
        this.stopScroll(); // Clear any existing interval
        this.intervalId = setInterval(() => {
            const currentLeft = parseFloat(this.scrollBar.style.left);
            const newLeft = currentLeft + 0.1 / this.speed; // Adjust speed

            if (newLeft >= 100) {
                this.scrollBar.style.left = '0%';
            } else {
                this.scrollBar.style.left = `${newLeft}%`;
            }

            // Emit note position based on scroll bar position
            const position = newLeft;
            const midiNote = 60; // Example MIDI note number for C4
            this.uiInstance.synth.playNote(midiNote, this.uiInstance.selectedTrack, position);
            this.uiInstance.addNoteIndicator(this.uiInstance.selectedTrack, position);
            this.noteEmitter.emit("play", { midiNote, position });
        }, 100); // Update every 100ms
    }

    stopScroll() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
