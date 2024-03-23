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
    const gridSize = Decimal(document.getElementById('gridSize').value);

    const verticalCells = document.getElementsByName('verticalCells');
    const verticalCellValues = Array.from(verticalCells).map(el => el.value);
    const maxHorizontalCell = Math.max(...verticalCellValues);

    const verticalStrokeWidths = document.getElementsByName('verticalStrokeWidth');
    const verticalStrokeWidthValues = Array.from(verticalStrokeWidths).map(el => el.value);
    const maxVerticalStrokeWidth = Math.max(...verticalStrokeWidthValues);

    return gridSize.times(maxHorizontalCell).plus(maxVerticalStrokeWidth);
}

function paperWidthFunc() {
    const gridSize = new Decimal(document.getElementById('gridSize').value);

    const horizontalCells = document.getElementsByName('horizontalCells');
    const horizontalCellValues = Array.from(horizontalCells).map(el => el.value);
    const maxVerticalCell = Math.max(...horizontalCellValues);

    const horizontalStrokeWidths = document.getElementsByName('horizontalStrokeWidth');
    const horizontalStrokeWidthValues = Array.from(horizontalStrokeWidths).map(el => el.value);
    const maxHorizontalStrokeWidth = Math.max(...horizontalStrokeWidthValues);

    return gridSize.times(maxVerticalCell).plus(maxHorizontalStrokeWidth);
}

function do_grid(direction, svgContent, j) {
    // Calculate the required space using grid size and the number of lines
    const gridSize = Decimal(document.getElementById('gridSize').value);
    const gridUnits = document.getElementById('gridUnits').value;
    const Cells = document.getElementsByName(`${direction}Cells`);
    const CellValues = Array.from(Cells).map(el => el.value);
    const maxCell = Math.max(...CellValues);
    const Offsets = document.getElementsByName(`${direction}Offset`);
    const Colors = document.getElementsByName(`${direction}Color`);
    const StrokeWidths = document.getElementsByName(`${direction}StrokeWidth`);
    const StrokeWidthValues = Array.from(StrokeWidths).map(el => el.value);
    const maxStrokeWidth = Decimal(Math.max(...StrokeWidthValues));
    const StrokeDashArrays = document.getElementsByName(`${direction}StrokeDashArray`);
    const paperHeight = paperHeightFunc();
    const paperWidth = paperWidthFunc();
    const Multipliers = document.getElementsByName(`${direction}Multiplier`);

    // Calculate the horizontal spacing for the lines
    const color = Colors[j].value
    const offsetNumber = parseInt(Offsets[j].value);

    let offset_size = gridSize.times(offsetNumber);
    const multiplier = parseInt(Multipliers[j].value);
    const strokeWidth = Decimal(StrokeWidths[j].value);
    let strokeDashArray = StrokeDashArrays[j].value;
    strokeDashArray = strokeDashArray.split(',').map(el => `${el}${gridUnits}`).join(',');
    let number_of_lines = parseInt(Cells[j].value);

    // Add the vertical lines
    for (let i = 0; i <= number_of_lines - Math.abs(offsetNumber); i += (multiplier >= 1 ? multiplier : 1)) {
        offset_amoun = offset_size > 0 ? offset_size : 0
        half_stroke = maxStrokeWidth.dividedBy(2);
        let x = gridSize.times(i).plus(half_stroke).plus(offset_amoun);
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
    const gridSize = Decimal(document.getElementById('gridSize').value);
    const gridUnits = document.getElementById('gridUnits').value;
    const paperHeight = paperHeightFunc();
    const paperWidth = paperWidthFunc();
    const Cells = document.getElementsByName(`horizontalCells`);

    let svgContent = `<svg width="${paperWidth}${gridUnits}" height="${paperHeight}${gridUnits}" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="white" />`;
    for (let j = 0; j < Cells.length; j++) {
        let top = document.getElementsByName('verticalTop')[j].checked
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

function addCell() {
    let cells = document.getElementById('Cells');
    let firstDiv = cells.querySelector('div');
    let clone = firstDiv.cloneNode(true);

    cells.appendChild(clone);
}

function removehorizontalCells(button) {
    const CellsContainer = document.getElementById('Cells');
    const div = button.parentNode;
    CellsContainer.removeChild(div);
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
    let numberOfGridOptions = document.getElementsByName('Cell')[0].querySelectorAll('label').length;

    // Make the number of grids equal to the number of URL parameters
    let numberofGrids = document.getElementsByName('Cell').length
    while (numberofGrids < (numberOfUrlParams - numberofGrids) / numberOfGridOptions) {
        addCell();
        numberofGrids = document.getElementsByName('Cell').length;
    }

    let saveThis = document.querySelectorAll('.saveThis');
    let loadThis = urlParams.toString().split('&');
    for (let i = 0; i < saveThis.length && i < loadThis.length; i++) {
        saveThis[i].value = urlParamsValues[i];
    }
    generateSVG();
}
