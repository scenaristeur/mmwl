import { Record } from './record';
import { InstrumentPanel } from './ui/instrumentPanel';

export class Track {
    constructor(id, uiInstance, timelineDiv) {
        this.id = id;
        this.uiInstance = uiInstance;
        this.noteEmitter = uiInstance.noteEmitter;
        this.element = document.createElement('div');
        this.element.id = `track${this.id}`;
        this.element.className = 'track';
        this.controlDiv = document.createElement('div');
        this.controlDiv.className = 'track-controls';
        this.record = new Record(this.noteEmitter);
        this.scrollBar = document.createElement('div');
        this.scrollBar.id = `scroll-bar-${this.id}`;
        this.scrollBar.style.position = 'absolute';
        this.scrollBar.style.height = '100%';
        this.scrollBar.style.width = '2px';
        this.scrollBar.style.backgroundColor = 'white';
        this.scrollBar.style.transition = 'left 0.1s';
        this.scrollBar.style.left = '0%';
        this.speedInput = document.createElement('input');
        this.speedInput.type = 'range';
        this.speedInput.id = `timeline-speed-${this.id}`;
        this.speedInput.min = '1';
        this.speedInput.max = '10';
        this.speedInput.step = '0.1';
        this.speedInput.value = '1';
        this.speed = 1; // Default speed in seconds
        this.intervalId = null;
        this.timelineDiv = timelineDiv;

        // Create track container
        this.trackContainer = document.createElement('div');
        this.trackContainer.className = 'track-container';

        this.init();
    }

    init() {
        // Create control buttons for each track
        const recordButton = document.createElement('button');
        recordButton.id = `record-${this.id}`;
        recordButton.className = 'record-icon';
        recordButton.addEventListener('click', () => {
            if (this.record.recording && this.record.selectedTrack === this.id) {
                this.record.stopRecording();
                recordButton.classList.remove('stop-recording-icon');
                recordButton.classList.add('record-icon');
            } else {
                this.record.startRecording(this.id);
                recordButton.classList.remove('record-icon');
                recordButton.classList.add('stop-recording-icon');
            }
        });

        const playRecordButton = document.createElement('button');
        playRecordButton.id = `play-record-${this.id}`;
        playRecordButton.className = 'play-icon';
        playRecordButton.addEventListener('click', () => {
            if (this.record.playing && this.record.selectedTrack === this.id) {
                this.record.stopPlaying();
                playRecordButton.classList.remove('stop-playing-icon');
                playRecordButton.classList.add('play-icon');
            } else {
                this.record.playRecording(this.id);
                playRecordButton.classList.remove('play-icon');
                playRecordButton.classList.add('stop-playing-icon');
            }
        });

        this.controlDiv.appendChild(recordButton);
        this.controlDiv.appendChild(playRecordButton);

        // Append control div to track element
        this.element.appendChild(this.controlDiv);

        // Add scroll bar
        this.element.appendChild(this.scrollBar);

        // Add speed input
        this.speedInput.addEventListener('input', (event) => {
            this.speed = parseFloat(event.target.value);
        });
        this.controlDiv.appendChild(this.speedInput);

        // Append control div and track element to track container
        this.trackContainer.appendChild(this.controlDiv);
        this.trackContainer.appendChild(this.element);

        // Append track container to timeline
        this.timelineDiv.appendChild(this.trackContainer);

        // Track selection by click
        this.element.addEventListener('click', () => {
            this.uiInstance.selectTrack(`track${this.id}`);
        });

        // Create instrument panel
        const instrumentPanelContainer = document.createElement('div');
        instrumentPanelContainer.id = `track-controls-${this.id}`;
        instrumentPanelContainer.className = 'instrument-panel';
        this.trackContainer.appendChild(instrumentPanelContainer);

        const instrumentPanel = new InstrumentPanel(this.id, instrumentPanelContainer, this.uiInstance);
        this.uiInstance.instrumentPanels.push(instrumentPanel);
        this.uiInstance.synth.setVoice(this.id, instrumentPanel.instruments[this.id === 0 ? 'piano' : this.id === 1 ? 'guitar' : this.id === 2 ? 'bass' : 'percussion']); // Assign different instruments to each track
    }

    addNoteIndicator(position) {
        const noteIndicator = document.createElement('div');
        noteIndicator.className = 'note-indicator';
        noteIndicator.style.left = `${position}%`;

        this.element.appendChild(noteIndicator);

        // Remove the note indicator after a short delay
        setTimeout(() => {
            this.element.removeChild(noteIndicator);
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
            this.uiInstance.synth.playNote(midiNote, this.id, position);
            this.addNoteIndicator(position);
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
