// Modulation Techniques Class
class AmplitudeModulation {
    constructor(messageFreq, messageAmp, carrierFreq, carrierAmp) {
        this.messageFreq = messageFreq;
        this.messageAmp = messageAmp;
        this.carrierFreq = carrierFreq;
        this.carrierAmp = carrierAmp;
        this.duration = 1; // 1 second
        this.sampleRate = 1000; // samples per second
    }

    generateSignal(freq, amp, isMessage = true) {
        const samples = this.sampleRate * this.duration;
        return Array.from({ length: samples }, (_, i) => {
            const t = i / this.sampleRate;
            return amp * Math.sin(2 * Math.PI * freq * t);
        });
    }

    // Double Sideband Full Carrier
    dsbfc() {
        const messageSignal = this.generateSignal(this.messageFreq, this.messageAmp);

        return messageSignal.map((m, i) =>
            (this.carrierAmp + m) * Math.sin(2 * Math.PI * this.carrierFreq * (i / this.sampleRate))
        );
    }

    // Double Sideband Suppressed Carrier
    dsbsc() {
        const messageSignal = this.generateSignal(this.messageFreq, this.messageAmp);
        return messageSignal.map((m, i) =>
            this.carrierAmp * Math.sin(2 * Math.PI * this.carrierFreq * (i / this.sampleRate)) * m
        );
    }

    // Single Sideband Suppressed Carrier
    ssbsc(upperSideband = true) {
        const messageSignal = this.generateSignal(this.messageFreq, this.messageAmp);
        const hilbertTransform = this.hilbertTransform(messageSignal);

        return messageSignal.map((m, i) => {
            const t = i / this.sampleRate;
            if (upperSideband) {
                // Only upper sideband: suppress lower frequency components
                return this.carrierAmp * (
                    Math.sin(2 * Math.PI * this.carrierFreq * t) * messageSignal[i] -
                    Math.cos(2 * Math.PI * this.carrierFreq * t) * hilbertTransform[i]
                );
            } else {
                // Only lower sideband: suppress upper frequency components
                return this.carrierAmp * (
                    Math.sin(2 * Math.PI * this.carrierFreq * t) * messageSignal[i] +
                    Math.cos(2 * Math.PI * this.carrierFreq * t) * hilbertTransform[i]
                );
            }
        });
    }

    // Vestigial Sideband
    vsb() {
        const messageSignal = this.generateSignal(this.messageFreq, this.messageAmp);

        return messageSignal.map((m, i) => {
            const t = i / this.sampleRate;
            // VSB is a combination of SSB with a vestigial (partially attenuated) sideband
            const carrierComponent = this.carrierAmp * Math.sin(2 * Math.PI * this.carrierFreq * t);
            const messageComponent = m * Math.cos(2 * Math.PI * this.carrierFreq * t);

            // Apply a simple vestigial filter (simplified)
            const vestigialFilter = this.vestigialFilter(i);

            return carrierComponent + messageComponent * vestigialFilter;
        });
    }

    // Simplified Hilbert Transform (approximation)
    hilbertTransform(signal) {
        return signal.map((_, i) => {
            // Basic approximation of Hilbert transform
            const windowSize = 10;
            const start = Math.max(0, i - windowSize);
            const end = Math.min(signal.length, i + windowSize);

            return signal.slice(start, end).reduce((sum, val) => sum + val, 0) / (end - start);
        });
    }

    // Simplified Vestigial Filter
    vestigialFilter(index) {
        // Simple asymmetric filter to simulate vestigial sideband
        const totalSamples = this.sampleRate * this.duration;
        const normalizedIndex = index / totalSamples;

        // Gradually attenuate one side of the spectrum
        return normalizedIndex < 0.5 ? 1 : Math.max(0, 1 - (normalizedIndex - 0.5) * 2);
    }
}

// Visualization Class
class ModulationVisualizer {
    constructor(messageChartId, carrierChartId, modulatedChartId) {
        this.messageChart = d3.select(`#${messageChartId}`);
        this.carrierChart = d3.select(`#${carrierChartId}`);
        this.modulatedChart = d3.select(`#${modulatedChartId}`);

        this.width = 1000;
        this.height = 250;
        this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
    }

    plotSignal(chartElement, data, title, sampleRate = 1000) {
        // Clear previous chart
        chartElement.selectAll("*").remove();

        // Create SVG
        const svg = chartElement
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        // Define plot area
        const plotWidth = this.width - this.margin.left - this.margin.right;
        const plotHeight = this.height - this.margin.top - this.margin.bottom;

        // Create plot group
        const plotGroup = svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // X Scale (Time)
        const x = d3.scaleLinear()
            .domain([0, data.length / sampleRate])  // Convert samples to seconds
            .range([0, plotWidth]);

        // Y Scale (Amplitude)
        const y = d3.scaleLinear()
            .domain(d3.extent(data))
            .range([plotHeight, 0]);

        // Create line generator
        const line = d3.line()
            .x((d, i) => x(i / sampleRate))
            .y(d => y(d));

        // X Axis
        const xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickFormat(d => `${d.toFixed(2)}s`);

        svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.height - this.margin.bottom})`)
            .call(xAxis);

        // Y Axis
        const yAxis = d3.axisLeft(y)
            .ticks(5);

        svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
            .call(yAxis);

        // Add title
        svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(title);

        // Add X axis label
        svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Time (seconds)");

        // Add Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -this.height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Amplitude");

        // Plot the line
        plotGroup.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add grid lines (optional, but can improve readability)
        // Vertical grid lines
        plotGroup.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1)
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickSize(-plotHeight)
                .tickFormat("")
            );

        // Horizontal grid lines
        plotGroup.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1)
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-plotWidth)
                .tickFormat("")
            );
    }

    plotFrequencyDomain(chartElement, data, sampleRate = 1000, modulationType, messageFreq, carrierFreq) {
        // Clear previous chart
        chartElement.selectAll("*").remove();

        // Create SVG
        const svg = chartElement
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        // Define plot area
        const plotWidth = this.width - this.margin.left - this.margin.right;
        const plotHeight = this.height - this.margin.top - this.margin.bottom;

        // Create plot group
        const plotGroup = svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Perform FFT (Fast Fourier Transform)
        const spectrum = this.calculateFFT(data, sampleRate);

        // X Scale (Frequency)
        const x = d3.scaleLinear()
            .domain([0, sampleRate / 2])  // Nyquist frequency
            .range([0, plotWidth]);

        // Y Scale (Magnitude)
        const y = d3.scaleLinear()
            .domain([0, d3.max(spectrum.magnitudes)])
            .range([plotHeight, 0]);

        // Create line generator
        const line = d3.line()
            .x((d, i) => x(spectrum.frequencies[i]))
            .y(d => y(d));

        // X Axis
        const xAxis = d3.axisBottom(x)
            .ticks(10)
            .tickFormat(d => `${d.toFixed(0)} Hz`);

        svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.height - this.margin.bottom})`)
            .call(xAxis);

        // Y Axis
        const yAxis = d3.axisLeft(y)
            .ticks(5);

        svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`)
            .call(yAxis);

        // Add title
        svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(`Frequency Domain: ${modulationType}`);

        // Add X axis label
        svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.height - 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Frequency (Hz)");

        // Add Y axis label
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -this.height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Magnitude");

        // Plot the spectrum line
        plotGroup.append("path")
            .datum(spectrum.magnitudes)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Key frequencies based on modulation type
        const keyFrequencies = {
            'DSB-FC': [
                {
                    freq: carrierFreq,
                    label: 'Carrier Frequency',
                    description: 'Full carrier with both sidebands present'
                },
                {
                    freq: carrierFreq + messageFreq,
                    label: 'Upper Sideband',
                    description: 'Frequency sum of carrier and message signal'
                },
                {
                    freq: carrierFreq - messageFreq,
                    label: 'Lower Sideband',
                    description: 'Frequency difference of carrier and message signal'
                }
            ],
            'DSB-SC': [
                {
                    freq: carrierFreq + messageFreq,
                    label: 'Upper Sideband',
                    description: 'Frequency sum of carrier and message signal'
                },
                {
                    freq: carrierFreq - messageFreq,
                    label: 'Lower Sideband',
                    description: 'Frequency difference of carrier and message signal'
                }
            ],
            'SSB-SC': [
                {
                    freq: carrierFreq + messageFreq,
                    label: 'Sideband',
                    description: 'Sideband without carrier, power-efficient'
                }
            ],
            'VSB': [
                {
                    freq: carrierFreq + messageFreq,
                    label: 'Primary Sideband',
                    description: 'Main sideband with partial vestigial band'
                },
                {
                    freq: carrierFreq + messageFreq * 0.5,
                    label: 'Vestigial Band',
                    description: 'Partially attenuated secondary sideband'
                }
            ]
        };

        // Tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid 1px #aaa")
            .style("padding", "10px")
            .style("border-radius", "5px")
            .style("pointer-events", "none");

        // Add markers for key frequencies
        const selectedKeyFrequencies = keyFrequencies[modulationType] || [];
        selectedKeyFrequencies.forEach(({ freq, label, description }) => {
            // Find closest index in spectrum frequencies
            const freqIndex = spectrum.frequencies.findIndex(f => f >= freq);

            if (freqIndex !== -1) {
                const xPos = x(freq);
                const yPos = y(spectrum.magnitudes[freqIndex]);

                plotGroup.append("circle")
                    .attr("cx", xPos)
                    .attr("cy", yPos)
                    .attr("r", 6)
                    .attr("fill", "blue")
                    .style("cursor", "pointer")
                    .on("mouseover", (event) => {
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 0.9);
                        tooltip.html(`
                            <strong>${label}</strong><br/>
                            Frequency: ${freq.toFixed(2)} Hz<br/>
                            ${description}
                        `)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", () => {
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
            }
        });
    }

    calculateFFT(data, sampleRate) {
        // Simplified FFT calculation (using built-in methods)
        const n = data.length;
        const frequencies = [];
        const magnitudes = [];

        // Calculate frequency resolution
        const frequencyResolution = sampleRate / n;

        // Perform basic spectrum analysis
        for (let k = 0; k < n / 2; k++) {
            const frequency = k * frequencyResolution;

            // Calculate magnitude using simplified method
            const real = data.reduce((sum, val, i) =>
                sum + val * Math.cos(2 * Math.PI * k * i / n), 0);
            const imag = data.reduce((sum, val, i) =>
                sum + val * Math.sin(2 * Math.PI * k * i / n), 0);

            const magnitude = Math.sqrt(real * real + imag * imag) / (n / 2);

            frequencies.push(frequency);
            magnitudes.push(magnitude);
        }

        return { frequencies, magnitudes };
    }
}

// Main Application Initialization
function initializeApp() {
    const visualizer = new ModulationVisualizer('message-chart', 'carrier-chart', 'modulated-chart');
    const frequencyDomainChart = d3.select("#frequency-chart");
    const modulationTypeSelect = document.getElementById('modulation-type');

    // Slider Event Listeners
    const sliders = [
        { id: 'message-freq', valueId: 'message-freq-value' },
        { id: 'message-amplitude', valueId: 'message-amplitude-value' },
        { id: 'carrier-freq', valueId: 'carrier-freq-value' },
        { id: 'carrier-amplitude', valueId: 'carrier-amplitude-value' }
    ];

    sliders.forEach(slider => {
        const sliderEl = document.getElementById(slider.id);
        const valueEl = document.getElementById(slider.valueId);

        sliderEl.addEventListener('input', updateVisualization);

        function updateSliderValue() {
            valueEl.textContent = sliderEl.value + (slider.id.includes('freq') ? ' Hz' : ' V');
        }

        sliderEl.addEventListener('input', updateSliderValue);
        updateSliderValue();
    });

    function updateVisualization() {
        const messageFreq = +document.getElementById('message-freq').value;
        const messageAmp = +document.getElementById('message-amplitude').value;
        const carrierFreq = +document.getElementById('carrier-freq').value;
        const carrierAmp = +document.getElementById('carrier-amplitude').value;
        const modulationType = modulationTypeSelect.value;

        const am = new AmplitudeModulation(messageFreq, messageAmp, carrierFreq, carrierAmp);
        let modulatedSignal;

        switch (modulationType) {
            case 'DSB-FC':
                modulatedSignal = am.dsbfc();
                break;
            case 'DSB-SC':
                modulatedSignal = am.dsbsc();
                break;
            case 'SSB-SC':
                modulatedSignal = am.ssbsc();
                break;
            case 'VSB':
                modulatedSignal = am.vsb();
                break;
            default:
                modulatedSignal = am.dsbfc(); // Default to DSB-FC
        }

        const messageSignal = am.generateSignal(messageFreq, messageAmp);
        const carrierSignal = am.generateSignal(carrierFreq, carrierAmp, false);

        visualizer.plotSignal(visualizer.messageChart, messageSignal, 'Message Signal');
        visualizer.plotSignal(visualizer.carrierChart, carrierSignal, 'Carrier Signal');
        visualizer.plotSignal(visualizer.modulatedChart, modulatedSignal, 'Modulated Signal');
        visualizer.plotFrequencyDomain(
            frequencyDomainChart,
            modulatedSignal,
            1000,
            modulationType,
            messageFreq,
            carrierFreq
        );
    }

    modulationTypeSelect.addEventListener('change', updateVisualization);
    updateVisualization(); // Initial plot
}

window.onload = initializeApp;