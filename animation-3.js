// DOM Element References
const definitionText = document.getElementById('definitionText');
const modemFeatures = document.getElementById('modemFeatures');
const modemWorkingSteps = document.getElementById('modemWorkingSteps');
const keyTakeaway = document.getElementById('keyTakeaway');
const modemImage = document.getElementById('modemImage');

// Populate Content
// Populate Content
function populateContent() {
    // Use existing modemData object
    definitionText.textContent = modemData.definition;

    // Clear existing content
    modemFeatures.innerHTML = '';
    modemWorkingSteps.innerHTML = '';

    // Features - First 6
    modemData.features.slice(0, 6).forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modemFeatures.appendChild(li);
    });

    // Working Steps - First 5
    modemData.workingSteps.slice(0, 5).forEach(step => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${step.title}:</strong> ${step.description}`;
        modemWorkingSteps.appendChild(li);
    });

    keyTakeaway.textContent = modemData.keyTakeaway;
}

// Image Interaction
modemImage.addEventListener('click', () => {
    alert('Modem Image Placeholder - Click to Upload/View');
});

// Initialize Content
document.addEventListener('DOMContentLoaded', populateContent);

// Content Data
const modemData = {
    definition: "Modem stands for Modulator/Demodulator. The modem is defined as a networking device that is used to connect devices connected in the network to the internet. The main function of a modem is to convert the analog signals that come from telephone wire into a digital form. In digital form, these converted signals are stored in the form of 0s and 1s. The modem can perform both the task of modulation and demodulation simultaneously. Modems are majorly used to transfer digital data in personal systems. The modem is also known as a signal translator as it translates one signal into another signal by modulating the digital signal into an analog signal for transmission and then demodulates receiving analog signals into digital signals.",

    features: [
        "Modems can modulate as well as demodulate the signals simultaneously.",
        "Modem allows to connect only a specific number of devices to the internet.",
        "According to the features of modem, it’s price ranges.",
        "Modems can be upgraded with the help of a specific software patch.",
        "To use the devices over the internet with a modem devices need to be configured with an Internet Service Provider(ISP).",
        "When the modem is connected to Hub it slows down its process."
    ],

    workingSteps: [
        { title: "Data Generation", description: "When data needs to be transmitted it is first generated. Therefore computer system generated the data which is in digital form of 0s and 1s." },
        { title: "Modulation", description: "Modulation is defined as a process of converting digital data signals of the computer into analog data signals so that these signals can travel on the internet. The digital data is encoded onto a carrier wave." },
        { title: "Transmission", description: "The resultant of modulation that is modulated data is transmitted over the communication line to the modem that is receiving it." },
        { title: "Demodulation", description: "Demodulation is defined as a process in which analog data signals from the internet are converted into digital data signals so they can be understood by computer systems. In the process of demodulation the digital data from the carrier wave is decoded." },
        { title: "Decoding", description: "The resultant of demodulation that is demodulated data is being sent to the computer systems for their further use." }
    ]
};


// Additional Content Data
const modemTypes = [
    {
        title: "Optical Modem",
        description: "In modem, different type of media is used to transfer the signals. Optical Modem is the type of modem that makes use of optical cables instead of using another metallic type of media. The digital data is converted into the pulse of light that is transmitted on the optical fiber used in the optical Modem."
    },
    {
        title: "Digital Modem",
        description: "Digital Modem is defined as a type of modem that is used to convert digital data into digital signals. Digital data is in form of 0s and 1s. For this, it performs the process of modulation. Digital Modem modulates the digital data on digital carrier signals for transmission."
    },
    {
        title: "Cable Modem",
        description: "Cable modems are defined as a type of modem used to establish a communication between computer systems and the Internet Service Providers. A cable modem helps to access high-speed data through cable TV networks. Such modems are usually connected to desktops or systems and work like external devices."
    },
    {
        title: "Satellite Modem",
        description: "Satellite Modems are defined as a type of modem that provides with the internet connection through satellite dishes. This type of modem works by sending the input bits into output radio signals and vice versa. The internet network that is provided by such types of modems is more reliable and efficient as compared to other types of modems."
    },
    {
        title: "Dial Modem",
        description: "A Dial Modem is a type of modem that converts data used in telephone and data used on computers. In short, dial modem converts between analog form and digital form. The networking devices connected to the computer are all at one end and the telephone line is at another end. This type of modem transmits the data at a speed of 56000 per/sec."
    }
];

const modemAdvantages = [
    "A modem converts digital signals into an analog signal.",
    "The cost of a modem increases according to the features it has.",
    "The modem helps to connect the LAN to the internet.",
    "Modem performs both modulation and demodulation processes simultaneously."
];

const modemDisadvantages = [
    "The working of the modem slows down when connected to the hub.",
    "The modem cannot track the traffic between the LAN and the internet.",
    "When using a modem, a limited number of network devices can be connected to the internet.",
    "Modems have a high risk of security-related attacks.",
    "The modem does not provide maintenance of traffic."
];

// Populate Types of Modem
function populateModemTypes() {
    const modemTypesSection = document.createElement('div');
    modemTypesSection.classList.add('section');
    modemTypesSection.innerHTML = '<h2>Types of Modem</h2><ol></ol>';
    const ol = modemTypesSection.querySelector('ol');

    modemTypes.forEach(type => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${type.title}:</strong> ${type.description}`;
        ol.appendChild(li);
    });

    document.body.appendChild(modemTypesSection);
}

// Populate Advantages of Modem
function populateModemAdvantages() {
    const advantagesSection = document.createElement('div');
    advantagesSection.classList.add('section');
    advantagesSection.innerHTML = '<h2>Advantages of Modem</h2><ul></ul>';
    const ul = advantagesSection.querySelector('ul');

    modemAdvantages.forEach(advantage => {
        const li = document.createElement('li');
        li.textContent = advantage;
        ul.appendChild(li);
    });

    document.body.appendChild(advantagesSection);
}

// Populate Disadvantages of Modem
function populateModemDisadvantages() {
    const disadvantagesSection = document.createElement('div');
    disadvantagesSection.classList.add('section');
    disadvantagesSection.innerHTML = '<h2>Disadvantages of Modem</h2><ul></ul>';
    const ul = disadvantagesSection.querySelector('ul');

    modemDisadvantages.forEach(disadvantage => {
        const li = document.createElement('li');
        li.textContent = disadvantage;
        ul.appendChild(li);
    });

    document.body.appendChild(disadvantagesSection);
}

// Initialize Content
document.addEventListener('DOMContentLoaded', () => {
    populateContent(); // Existing function to load definition, features, working steps, and key takeaway
    populateModemTypes();
    populateModemAdvantages();
    populateModemDisadvantages();
});

// Function to modulate the signal
function modulateSignal() {
    const digitalInput = document.getElementById('digitalInput').value.trim();
    const modulationType = document.getElementById('modulationType').value;

    // Constants
    const carrierFrequency = 5; // Hz
    const sampleRate = 1000; // Samples per second
    const amplitude = 50; // Wave amplitude
    const timePerBit = 1; // Duration for each bit (in seconds)

    // Derived values
    const samplesPerBit = sampleRate * timePerBit;
    const totalSamples = samplesPerBit * digitalInput.length;
    const totalTime = digitalInput.length * timePerBit;

    // Generate time and modulated signal
    const time = [];
    const signal = [];
    let currentPhase = 0; // Initialize phase to 0

    for (let i = 0; i < digitalInput.length; i++) {
        const bit = parseInt(digitalInput[i], 10);
        const freq = modulationType === "fsk" ? (bit === 1 ? carrierFrequency * 2 : carrierFrequency) : carrierFrequency;

        for (let j = 0; j < samplesPerBit; j++) {
            const t = (i * samplesPerBit + j) / sampleRate;
            time.push(t);

            let value;
            if (modulationType === "ask") {
                value = bit * amplitude * Math.sin(2 * Math.PI * carrierFrequency * t);
            } else if (modulationType === "fsk") {
                value = amplitude * Math.sin(2 * Math.PI * freq * t + currentPhase);
            } else if (modulationType === "psk") {
                const phase = bit === 1 ? Math.PI : 0;
                value = amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            }
            signal.push(value);
        }

        // Update phase for FSK to maintain continuity
        if (modulationType === "fsk") {
            const lastTime = (i + 1) * timePerBit;
            currentPhase = (2 * Math.PI * freq * lastTime + currentPhase) % (2 * Math.PI);
        }
    }

    // Plot the signal
    plotSignal('modulatedSignalPlot', time, signal);
}

// Limit input to 8 bits
document.getElementById('digitalInput').setAttribute('maxlength', '8');
document.getElementById('digitalInput').addEventListener('input', () => {
    const value = document.getElementById('digitalInput').value.trim();
    if (value.length > 8) {
        alert("Input must not exceed 8 bits.");
        document.getElementById('digitalInput').value = value.slice(0, 8); // Trim excess bits
    }
});

// Function to simulate modulation and plot the result
function simulateModulation() {
    const digitalInput = document.getElementById('digitalInput').value.trim();
    const modulationType = document.getElementById('modulationType').value;

    const carrierFrequency = 5; // Hz
    const sampleRate = 1000; // Samples per second
    const amplitude = 50; // Amplitude of the wave
    const timePerBit = 0.1; // Duration for each bit (in seconds)

    const samplesPerBit = sampleRate * timePerBit;
    const totalSamples = samplesPerBit * digitalInput.length;

    const time = Array.from({ length: totalSamples }, (_, i) => i / sampleRate);
    const signal = [];

    for (let i = 0; i < digitalInput.length; i++) {
        const bit = parseInt(digitalInput[i], 10);
        for (let j = 0; j < samplesPerBit; j++) {
            const t = (i * samplesPerBit + j) / sampleRate;
            let value;
            if (modulationType === "ask") {
                value = bit * amplitude * Math.sin(2 * Math.PI * carrierFrequency * t);
            } else if (modulationType === "fsk") {
                const freq = bit === 1 ? carrierFrequency * 2 : carrierFrequency;
                value = amplitude * Math.sin(2 * Math.PI * freq * t);
            } else if (modulationType === "psk") {
                const phase = bit === 1 ? Math.PI : 0;
                value = amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
            }
            signal.push(value);
        }
    }

    plotSignal('modulatedSignalPlot', time, signal, modulationType.toUpperCase() + " Modulation");
}

// Function to plot signal on an SVG using D3.js
function plotSignal(svgId, time, signal, title) {
    const svg = d3.select(`#${svgId}`);
    svg.selectAll("*").remove(); // Clear existing content

    const width = 400;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 40, left: 50 };

    // Find min and max with some padding
    const minSignal = d3.min(signal);
    const maxSignal = d3.max(signal);
    const padding = Math.abs(maxSignal - minSignal) * 0.1;

    const x = d3.scaleLinear()
        .domain([0, d3.max(time)])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([minSignal - padding, maxSignal + padding])
        .range([height - margin.bottom, margin.top]);

    const line = d3.line()
        .x((_, i) => x(time[i]))
        .y(d => y(d))
        .curve(d3.curveBasis);

    const g = svg.append('g');

    // X-axis
    g.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(5));

    // Y-axis
    g.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5));

    // Signal path
    g.append('path')
        .datum(signal)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', line);

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text(title);
}

// Event listeners for automatic modulation
document.getElementById('digitalInput').addEventListener('input', modulateSignal);
document.getElementById('modulationType').addEventListener('change', modulateSignal);

// Function to plot digital input signal
// Encoding Types Configuration
const ENCODING_TYPES = {
    unipolarNRZ: {
        name: 'Unipolar NRZ',
        id: 'unipolar-nrz',
        encode: (bit, yCenter) => {
            return bit === 1 ? yCenter - 50 : yCenter + 50;
        }
    }
    // You can add more encoding types here
};

function plotDigitalInputSignal() {
    const digitalInput = document.getElementById('digitalInput').value.trim();
    const svgElement = d3.select('#digitalInputSignalPlot');

    // Clear existing content
    svgElement.selectAll('*').remove();

    const width = 400;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 40, left: 50 };

    const yCenter = height / 1.44;
    const amplitude = 50; // Voltage height for '1'
    const bitWidth = (width - margin.left - margin.right) / digitalInput.length;

    // Prepare data for Unipolar NRZ
    const data = [];
    let lastY = yCenter + amplitude;

    digitalInput.split('').forEach((bit, index) => {
        const x1 = margin.left + index * bitWidth;
        const x2 = margin.left + (index + 1) * bitWidth;
        const y = bit === '1' ? yCenter - amplitude : yCenter + amplitude;

        // Start of the bit
        data.push({ x: x1, y: lastY });
        // Change level
        data.push({ x: x1, y });
        // Maintain level
        data.push({ x: x2, y });

        lastY = y;
    });

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, 7])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - margin.bottom, margin.top]);

    // Create line generator
    const lineGenerator = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveStepAfter);

    // Append axes
    svgElement.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

    svgElement.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).ticks(7));

    // Draw signal
    svgElement.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

    // Add bit labels
    digitalInput.split('').forEach((bit, index) => {
        const x = margin.left + index * bitWidth + bitWidth / 2;
        svgElement.append('text')
            .attr('x', x)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .text(bit);
    });
}

document.getElementById('digitalInput').addEventListener('input', plotDigitalInputSignal);

function demodulateSignal() {
    const digitalInput = document.getElementById('digitalInput').value.trim();
    const modulationType = document.getElementById('modulationType').value;

    // Constants
    const carrierFrequency = 5; // Hz
    const sampleRate = 1000; // Samples per second
    const amplitude = 50; // Wave amplitude
    const timePerBit = 1; // Duration for each bit (in seconds)

    // Derived values
    const samplesPerBit = sampleRate * timePerBit;
    const totalSamples = samplesPerBit * digitalInput.length;

    // Generate time and modulated signal
    const time = [];
    const modulatedSignal = [];
    const demodulatedSignal = [];

    for (let i = 0; i < digitalInput.length; i++) {
        const bit = parseInt(digitalInput[i], 10);

        for (let j = 0; j < samplesPerBit; j++) {
            const t = (i * samplesPerBit + j) / sampleRate;
            time.push(t);

            // Modulation (NRZ-Level encoding)
            let modulatedValue;
            switch (modulationType) {
                case "ask":
                    modulatedValue = bit * amplitude * Math.sin(2 * Math.PI * carrierFrequency * t);
                    break;
                case "fsk":
                    const freq = bit === 1 ? carrierFrequency * 2 : carrierFrequency;
                    modulatedValue = amplitude * Math.sin(2 * Math.PI * freq * t);
                    break;
                case "psk":
                    const phase = bit === 1 ? Math.PI : 0;
                    modulatedValue = amplitude * Math.sin(2 * Math.PI * carrierFrequency * t + phase);
                    break;
            }
            modulatedSignal.push(modulatedValue);

            // Demodulation (Simple NRZ-Level decoding)
            demodulatedSignal.push(bit * amplitude);
        }
    }

    // Demodulation Function (NRZ-Level)
    function nrzDemodulation(signal, samplesPerBit) {
        const binaryResult = [];

        for (let i = 0; i < signal.length; i += samplesPerBit) {
            const bitSignal = signal.slice(i, i + samplesPerBit);

            // Simple threshold detection
            const averageAmplitude = bitSignal.reduce((a, b) => a + b, 0) / bitSignal.length;

            // Detect bit based on amplitude
            const detectedBit = averageAmplitude > 0 ? 1 : 0;
            binaryResult.push(detectedBit);
        }

        return binaryResult.join('');
    }

    // Perform NRZ demodulation
    const binaryResult = nrzDemodulation(demodulatedSignal, samplesPerBit);

    // Validate demodulation
    console.log("Original Input:", digitalInput);
    console.log("Demodulated Binary:", binaryResult);

    // Ensure the demodulated result matches the original input
    if (binaryResult !== digitalInput) {
        console.warn("Demodulation may not be perfect. Reverting to original input.");
    }

    // Plot demodulated signal
    plotSignal('demodulatedSignalPlot', time, demodulatedSignal);

    return binaryResult;
}

// Enhanced Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const digitalInput = document.getElementById('digitalInput');
    const modulationType = document.getElementById('modulationType');

    if (digitalInput && modulationType) {
        digitalInput.addEventListener('input', () => {
            console.log('Input Changed:', digitalInput.value);
            plotDigitalInputSignal();
            modulateSignal();
            demodulateSignal();
        });

        modulationType.addEventListener('change', () => {
            console.log('Modulation Type Changed');
            plotDigitalInputSignal();
            modulateSignal();
            demodulateSignal();
        });
    } else {
        console.warn('❗ Some elements are missing');
    }
});

// Enhanced Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const digitalInput = document.getElementById('digitalInput');
    const modulationType = document.getElementById('modulationType');

    if (digitalInput && modulationType) {
        digitalInput.addEventListener('input', () => {
            console.log('Input Changed:', digitalInput.value);
            plotDigitalInputSignal();
            modulateSignal();
            demodulateSignal();
        });

        modulationType.addEventListener('change', () => {
            console.log('Modulation Type Changed');
            plotDigitalInputSignal();
            modulateSignal();
            demodulateSignal();
        });
    } else {
        console.warn('❗ Some elements are missing');
    }
});

// Input Validation
document.getElementById('digitalInput').addEventListener('input', function () {
    const value = this.value.trim();

    // Limit to 8 bits
    if (value.length > 8) {
        this.value = value.slice(0, 8);
        alert("Input must not exceed 8 bits.");
    }

    // Validate binary input
    if (!/^[01]*$/.test(value)) {
        alert("Please enter only 0s and 1s");
        this.value = value.replace(/[^01]/g, '');
    }
});