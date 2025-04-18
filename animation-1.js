const width = 770,
    height = 420,
    margin = { top: 20, right: 30, bottom: 30, left: 40 };
const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

// Default values for signal parameters
const defaultValues = {
    amplitude: 2,
    frequency: 10,
    samplingFrequency: 10,
    bitRate: 4
};

// Sampling and display parameters
const samplingRate = 10000; // 10kHz sampling rate
const timeWindow = 0.1; // 100ms window
const numPoints = Math.floor(samplingRate * timeWindow);

// Signal state
let bitRate = 4;
let amplitude = 2;
let frequency = 10;
let samplingFrequency = 10;
let timeData = [];
let sampledPoints = [];

// Setup SVG for Generated Signal
const svg = d3.select("#signal-plot")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("border", "1px solid #000000");

svg.selectAll("*").remove();

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Setup SVG for Sampled Signal
const sampledSvg = d3.select("#sampled-plot")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("border", "1px solid #000000");

sampledSvg.selectAll("*").remove();

const sampledG = sampledSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Setup scales for both plots
const xScale = d3.scaleLinear().domain([0, timeWindow]).range([0, plotWidth]);
const yScale = d3.scaleLinear().domain([-4.9, 4.9]).range([plotHeight, 0]);

// Setup line generator
const lineGenerator = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d.value));

// Setup clipping path for both plots
g.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

sampledG.append("defs")
    .append("clipPath")
    .attr("id", "sampled-clip")
    .append("rect")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

// Add gridlines for Generated Signal
g.append("g")
    .attr("class", "grid")
    .selectAll("line")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", plotWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#e0e0e030")
    .attr("stroke-dasharray", "2,2");

// Add gridlines for Sampled Signal
sampledG.append("g")
    .attr("class", "grid")
    .selectAll("line")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", plotWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#e0e0e030")
    .attr("stroke-dasharray", "2,2");

// Draw x-axis at y = 0 for Generated Signal
g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(d3.axisBottom(xScale));

// Draw x-axis at y = 0 for Sampled Signal
sampledG.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(d3.axisBottom(xScale));

// Draw y-axis for Generated Signal
g.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

// Draw y-axis for Sampled Signal
sampledG.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

// Signal container for Generated Signal
const signalContainer = g.append("g").attr("clip-path", "url(#clip)");
const signalPath = signalContainer.append("path")
    .attr("class", "line signal-line")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 2);

// Signal container for Sampled Signal
const sampledContainer = sampledG.append("g").attr("clip-path", "url(#sampled-clip)");
const sampledPath = sampledContainer.append("path")
    .attr("class", "line sampled-line")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

// Sampled points group for Sampled Signal
const sampledPointsGroup = sampledG.append("g")
    .attr("class", "sampled-points");

// Setup SVG for Quantized Signal
const quantizedSvg = d3.select("#quantized-plot")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("border", "1px solid #000000");

quantizedSvg.selectAll("*").remove();

const quantizedG = quantizedSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add clipping path for Quantized Signal
quantizedG.append("defs")
    .append("clipPath")
    .attr("id", "quantized-clip")
    .append("rect")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

// Add gridlines for Quantized Signal
quantizedG.append("g")
    .attr("class", "grid")
    .selectAll("line")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", plotWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#e0e0e030")
    .attr("stroke-dasharray", "2,2");

// Draw x-axis at y = 0 for Quantized Signal
quantizedG.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(d3.axisBottom(xScale));

// Draw y-axis for Quantized Signal
quantizedG.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

// Signal container for Quantized Signal
const quantizedContainer = quantizedG.append("g").attr("clip-path", "url(#quantized-clip)");
const quantizedPath = quantizedContainer.append("path")
    .attr("class", "line quantized-line")
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 2);

// Quantized points group
const quantizedPointsGroup = quantizedG.append("g")
    .attr("class", "quantized-points");

// Function to quantize signal
function quantizeSignal() {
    if (sampledPoints.length > 0) {
        const quantizationLevels = Math.pow(2, bitRate);

        // Find min and max of sampled points to determine quantization range
        const minValue = d3.min(sampledPoints, d => d.value);
        const maxValue = d3.max(sampledPoints, d => d.value);

        // Calculate uniform quantization step
        const quantizationStep = (maxValue - minValue) / (quantizationLevels - 1);

        const quantizedPoints = sampledPoints.map(point => {
            // Calculate the quantization index with uniform step
            const quantizationIndex = Math.round((point.value - minValue) / quantizationStep);

            // Ensure the index is within the valid range
            const clampedIndex = Math.max(0, Math.min(quantizationLevels - 1, quantizationIndex));

            // Calculate the quantized value with uniform step
            const quantizedValue = minValue + (clampedIndex * quantizationStep);

            // Convert to binary representation
            const binary = clampedIndex.toString(2).padStart(bitRate, '0');

            return {
                time: point.time,
                value: quantizedValue,
                binary: binary,
                originalValue: point.value
            };
        });

        // Remove old elements
        quantizedPointsGroup.selectAll("*").remove();

        // Create explicit step-like representation
        const stepPoints = [];
        quantizedPoints.forEach((point, index) => {
            if (index === 0) {
                stepPoints.push({
                    time: point.time,
                    value: point.value
                });
            }

            if (index < quantizedPoints.length - 1) {
                stepPoints.push({
                    time: quantizedPoints[index + 1].time - 0.0001,
                    value: point.value
                });

                stepPoints.push({
                    time: quantizedPoints[index + 1].time,
                    value: quantizedPoints[index + 1].value
                });
            }
        });

        // Draw quantized points
        quantizedPointsGroup.selectAll("circle")
            .data(quantizedPoints)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 4)
            .attr("fill", "purple")
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Add binary labels
        quantizedPointsGroup.selectAll(".binary-label")
            .data(quantizedPoints)
            .enter()
            .append("text")
            .attr("class", "binary-label")
            .attr("x", d => xScale(d.time) + 10)
            .attr("y", d => yScale(d.value) - 10)
            .attr("font-size", "10px")
            .attr("fill", "black")
            .text(d => d.binary);

        // Create line generator for step-like representation
        const lineGenerator = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value));

        // Draw quantized signal path
        quantizedPath
            .attr("d", lineGenerator(stepPoints))
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");

        // Calculate quantization error
        const quantizationError = quantizedPoints.reduce((total, point) => {
            return total + Math.abs(point.originalValue - point.value);
        }, 0) / quantizedPoints.length;

        // Update quantization error display
        const quantizationErrorElement = document.getElementById("quantization-error");
        if (quantizationErrorElement) {
            quantizationErrorElement.textContent = `Quantization Error: ${quantizationError.toFixed(4)}`;
        }

        // Optional logging
        console.group("Quantization Details");
        console.log("Quantization Levels:", quantizationLevels);
        console.log("Quantization Step:", quantizationStep);
        console.log("Min Value:", minValue);
        console.log("Max Value:", maxValue);
        console.log("Quantized Points:", quantizedPoints);
        console.log("Quantization Error:", quantizationError);
        console.groupEnd();

    } else {
        console.log("No sampled points to quantize");

        // Clear quantization plot if no sampled points
        quantizedPointsGroup.selectAll("*").remove();
        quantizedPath.attr("d", "");
    }

    // Additional logging and visualization
    console.group("Quantization Details");
    console.log("Sampled Points:", sampledPoints);
    console.log("Quantization Levels:", quantizationLevels);
    console.log("Quantization Step:", quantizationStep);
    console.log("Quantized Points:", quantizedPoints);
    console.groupEnd();

    // Optional: Color coding based on quantization levels
    quantizedPointsGroup.selectAll("circle")
        .data(quantizedPoints)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.time))
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", (d, i) => {
            // Create a color gradient based on quantization levels
            const colorScale = d3.scaleSequential()
                .domain([0, quantizationLevels])
                .interpolator(d3.interpolatePlasma);
            return colorScale(i % quantizationLevels);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1);
}

function sampleSignal() {
    if (samplingFrequency > 0 && timeData.length > 0) {
        // Calculate sampling period
        const samplingPeriod = 1 / samplingFrequency;

        // Find points closest to the sampling intervals
        sampledPoints = [];
        let currentTime = 0;

        while (currentTime <= timeWindow) {
            // Find the point in timeData closest to our desired sampling time
            const closestPoint = timeData.reduce((closest, current) => {
                if (!closest) return current;
                return Math.abs(current.time - currentTime) < Math.abs(closest.time - currentTime)
                    ? current
                    : closest;
            }, timeData[0]);

            sampledPoints.push(closestPoint);
            currentTime += samplingPeriod;
        }

        // Remove old elements
        sampledPointsGroup.selectAll("*").remove();

        // Add vertical lines and points
        sampledPoints.forEach((point, index) => {
            // Add vertical line 
            sampledPointsGroup
                .append("line")
                .attr("x1", xScale(point.time))
                .attr("x2", xScale(point.time))
                .attr("y1", yScale(0))
                .attr("y2", yScale(0)) // Start at y = 0
                .attr("stroke", "blue")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "3,3")
                .transition()
                .delay(index * 50) // Delay for staggered effect
                .duration(300) // Duration of the transition
                .attr("y2", yScale(point.value)); // Animate to the correct y position

            // Add points with transition
            sampledPointsGroup
                .append("circle")
                .attr("cx", xScale(point.time))
                .attr("cy", yScale(0)) // Start at y = 0
                .attr("r", 0) // Start with radius 0
                .attr("fill", "red")
                .transition()
                .delay(index * 50) // Delay for staggered effect
                .duration(300) // Duration of the transition
                .attr("cy", yScale(point.value)) // Animate to the correct y position
                .attr("r", 4); // Final radius
        });

    } else {
        // Clear all sampled points and lines when sampling frequency is 0
        sampledPointsGroup.selectAll("*").remove();
        sampledPath.attr("d", "");
    }
}

// Setup SVG for Reconstructed Signal
const reconstructedSvg = d3.select("#reconstructed-plot")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .style("border", "1px solid #000000");

reconstructedSvg.selectAll("*").remove();

const reconstructedG = reconstructedSvg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add clipping path for Reconstructed Signal
reconstructedG.append("defs")
    .append("clipPath")
    .attr("id", "reconstructed-clip")
    .append("rect")
    .attr("width", plotWidth)
    .attr("height", plotHeight);

// Add gridlines for Reconstructed Signal
reconstructedG.append("g")
    .attr("class", "grid")
    .selectAll("line")
    .data(yScale.ticks())
    .enter()
    .append("line")
    .attr("x1", 0)
    .attr("x2", plotWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .attr("stroke", "#e0e0e030")
    .attr("stroke-dasharray", "2,2");

// Draw x-axis at y = 0 for Reconstructed Signal
reconstructedG.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(d3.axisBottom(xScale));

// Draw y-axis for Reconstructed Signal
reconstructedG.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

// Signal container for Reconstructed Signal
const reconstructedContainer = reconstructedG.append("g")
    .attr("clip-path", "url(#reconstructed-clip)");

const reconstructedPath = reconstructedContainer.append("path")
    .attr("class", "line reconstructed-line")
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2);

// Reconstructed points group
const reconstructedPointsGroup = reconstructedG.append("g")
    .attr("class", "reconstructed-points");

function reconstructSignal() {
    // Check if signal has been sampled first
    if (!sampledPoints || sampledPoints.length === 0) {
        alert("Please sample the signal first before reconstruction");
        return;
    }

    // Check if we have the original signal data
    if (!timeData || timeData.length === 0) {
        alert("No signal data available for reconstruction");
        return;
    }

    // Time points for reconstruction (use same time points as original signal)
    const reconstructedPoints = [];
    const T = 1 / samplingFrequency; // Sampling period

    // Use the same time points as the original signal for reconstruction
    for (let i = 0; i < timeData.length; i++) {
        const t = timeData[i].time;
        let reconstructedValue = 0;

        // Sum the contribution of each sampled point using sinc interpolation
        sampledPoints.forEach((sample) => {
            // Time of this sample
            const tk = sample.time;

            // Sinc function
            const sincArg = (t - tk) / T;
            const sincValue = Math.abs(sincArg) < 0.000001 ?
                1 : Math.sin(Math.PI * sincArg) / (Math.PI * sincArg);

            reconstructedValue += sample.value * sincValue;
        });

        reconstructedPoints.push({
            time: t,
            value: reconstructedValue
        });
    }

    // Clear previous reconstructed points
    reconstructedPointsGroup.selectAll("*").remove();

    // Add reconstructed points
    reconstructedPointsGroup.selectAll("circle")
        .data(sampledPoints)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.time))
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    // Draw reconstructed signal path
    reconstructedPath
        .attr("d", lineGenerator(reconstructedPoints))
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    // Optional: Animate the path
    const totalLength = reconstructedPath.node().getTotalLength();
    reconstructedPath
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    return reconstructedPoints;
}

// Add reconstruction button event listener
document.getElementById("reconstruct-btn").addEventListener("click", reconstructSignal);

function generateSignalPoints() {
    const timeStep = 1 / samplingRate;
    timeData = Array.from({ length: numPoints }, (_, i) => {
        const t = i * timeStep;
        return {
            time: t,
            value: amplitude * Math.sin(2 * Math.PI * frequency * t)
        };
    });
    signalPath.attr("d", lineGenerator(timeData));
}

function resetSignal() {
    // Get all slider and display elements
    const elements = {
        amplitudeSlider: document.getElementById("amplitude-slider"),
        frequencySlider: document.getElementById("frequency-slider"),
        fsSlider: document.getElementById("fs-slider"),
        bitRateSlider: document.getElementById("bitrate-slider"),
        amplitudeValue: document.getElementById("amplitude-value"),
        frequencyValue: document.getElementById("frequency-value"),
        samplingValue: document.getElementById("am-amplitude-value"),
        bitRateValue: document.getElementById("bitrate-value"),
        nyquistRate: document.getElementById("nyquist-rate"),
        samplingCriteria: document.getElementById("sampling-criteria"),
        nyquistStatus: document.getElementById("nyquist-status"),
        quantizationError: document.getElementById("quantization-error"),
        quantizationLevels: document.getElementById("quantization-levels")
    };

    // Reset to default values
    Object.entries(defaultValues).forEach(([key, value]) => {
        if (key === 'samplingFrequency') {
            elements[`${key === 'samplingFrequency' ? 'fs' : key}Slider`].value = value;
            this[key] = value;
        } else {
            elements[`${key}Slider`].value = value;
            this[key] = value;
        }
    });

    // Update display values
    elements.amplitudeValue.textContent = `${amplitude.toFixed(1)} V`;
    elements.frequencyValue.textContent = `${frequency} Hz`;
    elements.samplingValue.textContent = `${samplingFrequency} Hz`;
    elements.bitRateValue.textContent = `${bitRate} bits`;

    // Reset Nyquist and sampling information
    const nyquistRate = 2 * frequency;
    elements.nyquistRate.textContent = `Nyquist Rate: 2 x fₘ = ${nyquistRate.toFixed(2)} Hz`;
    elements.samplingCriteria.textContent = `Sampling Frequency fₛ = ${(samplingFrequency / frequency).toFixed(2)} x fₘ`;

    const nyquistStatus = samplingFrequency >= nyquistRate
        ? "Nyquist Criterion Satisfied: fₛ > 2fₘ"
        : "Nyquist Criterion NOT Satisfied: fₛ ≤ 2fₘ";

    elements.nyquistStatus.textContent = nyquistStatus;
    elements.nyquistStatus.style.color = samplingFrequency >= nyquistRate ? "green" : "red";

    // Reset quantization-related displays
    const quantizationLevels = Math.pow(2, bitRate);
    elements.quantizationLevels.textContent = `Quantization Levels: ${quantizationLevels}`;
    elements.quantizationError.textContent = "Quantization Error: N/A";

    // Comprehensive plot clearing
    signalPath.attr("d", "");
    sampledPath.attr("d", "");
    quantizedPath.attr("d", "");

    // Clear all point groups and elements
    sampledPointsGroup.selectAll("*").remove();
    quantizedPointsGroup.selectAll("*").remove();

    // Aggressive clearing of quantized plot
    quantizedG.selectAll("*").remove();

    // Recreate necessary quantized plot elements
    // Reappend clipping path
    quantizedG.append("defs")
        .append("clipPath")
        .attr("id", "quantized-clip")
        .append("rect")
        .attr("width", plotWidth)
        .attr("height", plotHeight);

    // Reappend gridlines
    quantizedG.append("g")
        .attr("class", "grid")
        .selectAll("line")
        .data(yScale.ticks())
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", plotWidth)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("stroke", "#e0e0e030")
        .attr("stroke-dasharray", "2,2");

    // Reappend x-axis
    quantizedG.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${yScale(0)})`)
        .call(d3.axisBottom(xScale));

    // Reappend y-axis
    quantizedG.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

    // Recreate signal container and path
    const quantizedContainer = quantizedG.append("g").attr("clip-path", "url(#quantized-clip)");
    const quantizedPath = quantizedContainer.append("path")
        .attr("class", "line quantized-line")
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2);

    // Recreate quantized points group
    const quantizedPointsGroup = quantizedG.append("g")
        .attr("class", "quantized-points");

    // Reset data arrays
    timeData = [];
    sampledPoints = [];

    // Reset quantization error display
    const quantizationErrorElement = document.getElementById("quantization-error");
    if (quantizationErrorElement) {
        quantizationErrorElement.textContent = "Quantization Error: N/A";
    }

    // Regenerate signal with default values
    generateSignalPoints();
}

function updateSliderValues() {
    // Update signal parameters
    amplitude = parseFloat(document.getElementById("amplitude-slider").value);
    frequency = parseFloat(document.getElementById("frequency-slider").value);
    samplingFrequency = parseFloat(document.getElementById("fs-slider").value);

    // Update signal parameters
    amplitude = parseFloat(document.getElementById("amplitude-slider").value);
    frequency = parseFloat(document.getElementById("frequency-slider").value);
    samplingFrequency = parseFloat(document.getElementById("fs-slider").value);

    // Update bitrate
    bitRate = parseFloat(document.getElementById("bitrate-slider").value);

    // Update quantization levels display
    const quantizationLevel = Math.pow(2, bitRate);
    document.getElementById("quantization-levels").textContent = `Quantization Levels: ${quantizationLevel}`;

    // Clear sampled points
    sampledPointsGroup.selectAll("*").remove();
    sampledPath.attr("d", "");

    // Update display values
    document.getElementById("amplitude-value").textContent = `${amplitude.toFixed(1)} V`;
    document.getElementById("frequency-value").textContent = `${frequency} Hz`;
    document.getElementById("am-amplitude-value").textContent = `${samplingFrequency} Hz`;

    // Nyquist rate and condition
    const nyquistRate = 2 * frequency; // Nyquist rate = 2 × f_m
    const samplingRatio = samplingFrequency / frequency; // f_s / f_m

    // Update Nyquist information
    document.getElementById("nyquist-rate").textContent = `Nyquist Rate: 2 x fₘ = ${nyquistRate.toFixed(2)} Hz`;
    document.getElementById("sampling-criteria").textContent = `Sampling Frequency fₛ = ${samplingRatio.toFixed(2)} x fₘ`;

    const nyquistStatus = samplingFrequency >= nyquistRate
        ? "Nyquist Criteria Satisfied: fₛ ≥ 2fₘ"
        : "Nyquist Criteria NOT Satisfied: fₛ < 2fₘ";

    document.getElementById("nyquist-status").textContent = nyquistStatus;
    document.getElementById("nyquist-status").style.color = samplingFrequency >= nyquistRate ? "green" : "red";

    generateSignalPoints();

    bitRate = parseFloat(document.getElementById("bitrate-slider").value);

    // Update bitrate display
    document.getElementById("bitrate-value").textContent = `${bitRate} bits`;

    // Optional: Add bitrate-related information or calculations
    const quantizationLevels = Math.pow(2, bitRate);
    document.getElementById("quantization-levels").textContent =
        `Quantization Levels: ${quantizationLevels}`;
}

document.getElementById("amplitude-slider").addEventListener("input", updateSliderValues);
document.getElementById("frequency-slider").addEventListener("input", updateSliderValues);
document.getElementById("fs-slider").addEventListener("input", updateSliderValues);
document.getElementById("bitrate-slider").addEventListener("input", updateSliderValues);

document.getElementById("reset-btn").addEventListener("click", resetSignal);
document.getElementById("sample-btn").addEventListener("click", sampleSignal);
document.getElementById("quantize-btn").addEventListener("click", quantizeSignal);

// Initialize the visualization
generateSignalPoints();