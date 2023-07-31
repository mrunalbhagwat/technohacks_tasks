class Timer {
    constructor(durationInput, startButton, pauseButton, container, callbacks) {
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.container = container;
        if (callbacks) {
            this.onStart = callbacks.onStart;
            this.onPause = callbacks.onPause;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
            this.onReset = callbacks.onReset;
        }
        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);
        this.durationInput.addEventListener('click', () => this.durationInput.value = '');
        this.durationInput.addEventListener('keydown', (e) => e.key === 'Enter' ? this.start() : null)
    }

    start = () => {
        this.onStart?.(this.durationInput.value);
        this.tick();
        this.interval = setInterval(this.tick, 10);
        this.pauseButton.removeEventListener('click', this.reset);
        this.pauseButton.addEventListener('click', this.pause);

    }

    pause = () => {
        this.onPause();
        clearInterval(this.interval);
        this.pauseButton.removeEventListener('click', this.pause);
        this.pauseButton.addEventListener('click', this.reset);

    }

    tick = () => {
        if (this.durationInput.value <= 0) {
            this.pause();
            this.onComplete?.();
        }
        else {
            this.durationInput.value = (this.durationInput.value - .01).toFixed(2);
            this.onTick?.();
        }
    }
    reset = () => {
        this.onReset?.();
        durationInput.value == 0.00 ? this.durationInput.value = '60.00' : durationInput.value = '';
    }
}

const durationInput = document.querySelector('#duration');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const circle = document.querySelector('circle');
const container = document.querySelector('.background');
const theme = document.documentElement.style;

const timer = new Timer(durationInput, startButton, pauseButton, container, {
    onStart(duration) {
        circle.setAttribute("pathLength", duration);
        circle.setAttribute("stroke-dasharray", duration);
        duration === 0 ? circle.setAttribute("stroke-dashoffset", 0) : '';
        this.pauseButton.firstChild.setAttribute('class', 'fa-solid fa-pause');
        this.startButton.classList.add('disabled');
    },
    onPause() {
        this.pauseButton.firstChild.setAttribute('class', 'fa-solid fa-rotate-right');
        this.startButton.classList.remove('disabled');
    },
    onTick() {
        circle.setAttribute("stroke-dashoffset", circle.getAttribute("stroke-dashoffset") - .01);
    },
    onComplete() {
        this.startButton.classList.add('disabled');
        this.container.classList.add('animation');
        this.durationInput.setAttribute('disabled', 'true');
    },
    onReset() {
        circle.setAttribute("stroke-dashoffset", 0);
        this.startButton.firstChild.setAttribute('class', 'fa-solid fa-play');
        this.pauseButton.firstChild.setAttribute('class', 'fa-solid fa-pause');
        this.startButton.addEventListener('click', this.start);
        this.startButton.classList.remove('disabled');
        this.container.classList.remove('animation');
        this.durationInput.removeAttribute('disabled');
    }
});
