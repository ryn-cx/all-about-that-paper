

function downloadSVG() {
    const svgContainer = document.getElementById('svgContainer');
    const svgContent = svgContainer.innerHTML;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'image.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function paperHeightFunc() {
    const gridSize = parseFloat(document.getElementById('gridSize').value);

    const verticalCellsFields = document.getElementsByName('verticalCellsField');
    const verticalCellFieldValues = Array.from(verticalCellsFields).map(el => el.value);
    const maxHorizontalCellField = Math.max(...verticalCellFieldValues);

    const verticalStrokeWidthFields = document.getElementsByName('verticalStrokeWidthField');
    const verticalStrokeWidthFieldValues = Array.from(verticalStrokeWidthFields).map(el => el.value);
    const maxVerticalStrokeWidthField = Math.max(...verticalStrokeWidthFieldValues);

    return maxHorizontalCellField * gridSize + (maxVerticalStrokeWidthField);
}

function paperWidthFunc() {
    const gridSize = parseFloat(document.getElementById('gridSize').value);

    const horizontalCellsFields = document.getElementsByName('horizontalCellsField');
    const horizontalCellFieldValues = Array.from(horizontalCellsFields).map(el => el.value);
    const maxVerticalCellField = Math.max(...horizontalCellFieldValues);

    const horizontalStrokeWidthFields = document.getElementsByName('horizontalStrokeWidthField');
    const horizontalStrokeWidthFieldValues = Array.from(horizontalStrokeWidthFields).map(el => el.value);
    const maxHorizontalStrokeWidthField = Math.max(...horizontalStrokeWidthFieldValues);

    return maxVerticalCellField * gridSize + (maxHorizontalStrokeWidthField);
}

function do_grid(direction, svgContent, j) {
    // Calculate the required space using grid size and the number of lines
    const gridSize = parseFloat(document.getElementById('gridSize').value);
    const gridUnits = document.getElementById('gridUnits').value;
    const CellsFields = document.getElementsByName(`${direction}CellsField`);
    const CellFieldValues = Array.from(CellsFields).map(el => el.value);
    const maxCellField = Math.max(...CellFieldValues);
    const OffsetFields = document.getElementsByName(`${direction}OffsetField`);
    const ColorFields = document.getElementsByName(`${direction}ColorField`);
    const StrokeWidthFields = document.getElementsByName(`${direction}StrokeWidthField`);
    const StrokeWidthFieldValues = Array.from(StrokeWidthFields).map(el => el.value);
    const maxStrokeWidthField = Math.max(...StrokeWidthFieldValues);
    const StrokeDashArrayFields = document.getElementsByName(`${direction}StrokeDashArrayField`);
    const paperHeight = paperHeightFunc();
    const paperWidth = paperWidthFunc();
    const MultiplierFields = document.getElementsByName(`${direction}MultiplierField`);

    // Calculate the horizontal spacing for the lines
    const color = ColorFields[j].value
    const offset_number = parseInt(OffsetFields[j].value);
    const offset_size = offset_number * gridSize;
    const multiplier = parseInt(MultiplierFields[j].value);
    const strokeWidth = parseFloat(StrokeWidthFields[j].value);
    let strokeDashArray = StrokeDashArrayFields[j].value;
    strokeDashArray = strokeDashArray.split(',').map(el => `${el}${gridUnits}`).join(',');
    let number_of_lines = parseInt(CellsFields[j].value);

    // Add the vertical lines
    for (let i = 0; i <= number_of_lines - Math.abs(offset_number); i += (multiplier >= 1 ? multiplier : 1)) {
        let x = gridSize * i + (maxStrokeWidthField / 2) + (offset_size > 0 ? offset_size : 0);
        if (direction == "horizontal") {
            svgContent += `<line 
                        x1="${x}${gridUnits}"
                        y1="0"
                        x2="${x}${gridUnits}"
                        y2="${paperHeight}${gridUnits}"
                        stroke="${color}"
                        stroke-width="${strokeWidth}${gridUnits}"
                        stroke-dasharray="${strokeDashArray}"
                        />`;
        }
        else {
            svgContent += `<line 
                        x1="0" 
                        y1="${x}${gridUnits}" 
                        x2="${paperWidth}${gridUnits}" 
                        y2="${x}${gridUnits}" 
                        stroke="${color}" 
                        stroke-width="${strokeWidth}${gridUnits}"
                        stroke-dasharray="${strokeDashArray}"
                        />`;
        }

    }
    return svgContent;
}
function generateSVG() {
    // Calculate the required space using grid size and the number of lines
    const gridSize = parseFloat(document.getElementById('gridSize').value);
    const gridUnits = document.getElementById('gridUnits').value;
    const paperHeight = paperHeightFunc();
    const paperWidth = paperWidthFunc();
    const CellsFields = document.getElementsByName(`horizontalCellsField`);

    let svgContent = `<svg width="${paperWidth}${gridUnits}" height="${paperHeight}${gridUnits}" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="white" />`;
    for (let j = 0; j < CellsFields.length; j++) {
        let top = document.getElementsByName('verticalTopField')[j].checked
        if (top) {
            svgContent = do_grid('horizontal', svgContent, j);
            svgContent = do_grid('vertical', svgContent, j);
        }
        else {
            svgContent = do_grid('vertical', svgContent, j);
            svgContent = do_grid('horizontal', svgContent, j);
        }
    }

    svgContent += `</svg>`;

    // Get the container element
    const svgContainer = document.getElementById('svgContainer');

    // Set SVG content to the container
    svgContainer.innerHTML = svgContent;

    // Create a new paragraph element
    const p = document.createElement('p');

    // Set the text content of the paragraph
    p.textContent = `Paper Width: ${paperWidth}, Paper Height: ${paperHeight}`;

    // Select the div and append the paragraph to it
    const div = document.querySelector('#paperDimensions');
    div.innerHTML = '';
    div.appendChild(p);
}

function addCellField() {
    let cellsFields = document.getElementById('CellsFields');
    let firstDiv = cellsFields.querySelector('div');
    let clone = firstDiv.cloneNode(true);

    cellsFields.appendChild(clone);
}

function removehorizontalCellsField(button) {
    const CellsFieldsContainer = document.getElementById('CellsFields');
    const div = button.parentNode;
    CellsFieldsContainer.removeChild(div);
}

function saveValues() {
    // Collecting all input elements
    let inputs = document.querySelectorAll('input');

    // Initializing an empty array to hold parameter-value pairs
    let params = [];

    // Find all with name saveThis
    let saveThis = document.querySelectorAll('.saveThis');

    // Iterating over each input element
    saveThis.forEach(function (input) {
        // Getting the name and value of each input
        let name = input.getAttribute('name');
        let value = input.value;

        // Pushing name-value pairs into the params array
        params.push(name + '=' + encodeURIComponent(value));
    });

    // Constructing the URL with the parameters
    let url = window.location.href.split('?')[0] + '?' + params.join('&');
    history.pushState({}, '', url);
    // Open the url in the same tab


    // Printing the constructed URL (You can change this to window.location.href = url; to redirect)
    console.log(url);
}
function importValues() {
    // Get the current URL
    let urlParams = new URLSearchParams(window.location.search);
    let urlParamsValues = Array.from(urlParams.values());
    let numberOfUrlParams = urlParams.toString().split('&').length;
    let numberOfGridOptions = document.getElementsByName('CellField')[0].querySelectorAll('label').length;

    // Make the number of grids equal to the number of URL parameters
    let numberofGrids = document.getElementsByName('CellField').length
    while (numberofGrids < (numberOfUrlParams - numberofGrids) / numberOfGridOptions) {
        addCellField();
        numberofGrids = document.getElementsByName('CellField').length;
    }

    let saveThis = document.querySelectorAll('.saveThis');
    let loadThis = urlParams.toString().split('&');
    for (let i = 0; i < saveThis.length && i < loadThis.length; i++) {
        saveThis[i].value = urlParamsValues[i];
    }
    generateSVG();
}
