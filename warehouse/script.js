function shortestPath(start, end, svgDocument) {
    if (!svgDocument) {
        return -1;
    }
    var nodes = svgDocument.querySelectorAll('path[id^="P-"]');
    var graph = {};

    // Construct the graph
    nodes.forEach(function (node) {
        var id = node.id;
        var neighbors = node.getAttribute('data-neighbors').split(',');
        graph[id] = {};
        neighbors.forEach(function (neighbor) {
            graph[id][neighbor] = 1; // Assuming all edges have weight 1
        });
    });

    // Dijkstra's algorithm
    var dist = {};
    var prev = {};
    var unvisited = Object.keys(graph);

    unvisited.forEach(function (node) {
        dist[node] = Infinity;
        prev[node] = null;
    });

    dist[start] = 0;

    while (unvisited.length > 0) {
        var current = null;
        unvisited.forEach(function (node) {
            if (!current || dist[node] < dist[current]) {
                current = node;
            }
        });

        if (current === end || dist[current] === Infinity) {
            break;
        }

        unvisited.splice(unvisited.indexOf(current), 1);

        Object.keys(graph[current]).forEach(function (neighbor) {
            var alt = dist[current] + graph[current][neighbor];
            if (alt < dist[neighbor]) {
                dist[neighbor] = alt;
                prev[neighbor] = current;
            }
        });
    }

    // Reconstruct shortest path
    var path = [];
    var current = end;
    while (current) {
        path.unshift(current);
        current = prev[current];
    }

    return path;
}

function changeFillToGrey(svgDocument) {
    if (svgDocument) {
        var paths = svgDocument.querySelectorAll('path[id^="P-"]');
        paths.forEach(function (path) {
            path.setAttribute('fill', 'grey');
        });
    }
}

function changeFillToRed(pathIds, svgDocument) {
    if (svgDocument) {
        // Loop through each path ID in the array
        pathIds.forEach(pathId => {
            // Select the path element by ID within the SVG document
            const pathElement = svgDocument.getElementById(pathId);

            // Check if the path element exists (for safety)
            if (pathElement) {
                // Set the fill attribute to red
                pathElement.setAttribute('fill', 'red');
            }
        });
    }
}

// function handleSvgClick(event) {
//     // Get the SVG document within the <object> element
//     const svgDoc = document.getElementById('svgObject').contentDocument;

//     // Get the ID of the clicked SVG element
//     const svgElementId = event.target.id;

//     // Show an alert with the ID of the SVG element
//     alert(`Clicked SVG element ID: ${svgElementId}`);
// }
function findPathIdsContaining(rackId) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    const pathElements = svgDocument.querySelectorAll('path[id^="P-"]'); // Select all <path> elements within the SVG
    console.log(pathElements)
    // Array to store matching path IDs
    let matchingPathId = null;

    pathElements.forEach(path => {
        const idParts = path.id.split('-');
        // Check if the path ID contains the specified substring
        if (!path.id.includes('CNC') && !path.id.includes('CN') && idParts.includes(rackId)) {
            matchingPathId = path.id;
            return;
        }
    });

    return matchingPathId;
}

function changeRackColor(rackId, color, svgDocument) {
    if (svgDocument) {
        // Select the path element by ID within the SVG document
        const groupElement = svgDocument.querySelector(`g[id^="${rackId}"]`);
        console.log(groupElement)
        if (!groupElement) {
            console.error('Group element not found');
            return;
        }
        const pathElement = groupElement.querySelector('path');

        if (!pathElement) {
            console.error('Path element not found within the group');
            return;
        }

        // Change the fill attribute of the path element to red
        pathElement.setAttribute('fill', 'red');
    }
}

function zoomToPaths(pathId1, pathId2, svgDocument) {
    const svgObject = document.getElementById('svgObject');
    const svgDoc = svgObject.contentDocument;
    const path1 = svgDoc.getElementById(pathId1);
    const path2 = svgDoc.getElementById(pathId2);

    if (!path1 || !path2) {
        console.error(`One or both paths not found: ${pathId1}, ${pathId2}`);
        return;
    }

    const bbox1 = path1.getBBox();
    const bbox2 = path2.getBBox();

    const minX = Math.min(bbox1.x, bbox2.x);
    const minY = Math.min(bbox1.y, bbox2.y);
    const maxX = Math.max(bbox1.x + bbox1.width, bbox2.x + bbox2.width);
    const maxY = Math.max(bbox1.y + bbox1.height, bbox2.y + bbox2.height);

    const padding = 10;

    const x = minX - padding;
    const y = minY - padding;
    const width = (maxX - minX) + padding * 2;
    const height = (maxY - minY) + padding * 2;

    const svgElement = svgDoc.documentElement;
    svgElement.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
}

function populateSelect(selectId) {
    arr = ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U18", "T32", "T31", "T30", "T29", "T28", "T27", "T26", "T25", "T24", "T23", "T22", "T21", "T20", "T19", "T18", "T10", "T11", "T12", "T13", "T14", "T15", "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "S32", "S31", "S30", "S29", "S28", "S27", "S26", "S25", "S24", "S23", "S22", "S21", "S20", "S19", "S18", "S10", "S11", "S12", "S13", "S14", "S15", "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "Q32", "Q31", "Q30", "Q29", "Q28", "Q27", "Q26", "Q25", "Q24", "Q23", "Q22", "Q21", "Q20", "Q19", "Q18", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "P32", "P31", "P30", "P29", "P28", "P27", "P26", "P25", "P24", "P23", "P22", "P21", "P20", "P19", "P18", "O32", "O31", "O30", "O29", "O28", "O27", "O26", "O25", "O24", "O23", "O22", "O21", "O20", "O19", "O18", "O10", "O11", "O12", "O13", "O14", "O15", "O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "N32", "N31", "N30", "N29", "N28", "N27", "N26", "N25", "N24", "N23", "N22", "N21", "N20", "N19", "N18", "N10", "N11", "N12", "N13", "N14", "N15", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "M32", "M31", "M30", "M29", "M28", "M27", "M26", "M25", "M24", "M23", "M22", "M21", "M20", "M19", "M18", "M10", "M11", "M12", "M13", "M14", "M15", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "L32", "L31", "L30", "L29", "L28", "L27", "L26", "L25", "L24", "L23", "L22", "L21", "L20", "L19", "L18", "L10", "L11", "L12", "L13", "L14", "L15", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "K32", "K31", "K30", "K29", "K28", "K27", "K26", "K25", "K24", "K23", "K22", "K21", "K20", "K19", "K18", "K10", "K11", "K12", "K13", "K14", "K15", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9", "J32", "J31", "J30", "J29", "J28", "J27", "J26", "J25", "J24", "J23", "J22", "J21", "J20", "J19", "J18", "J10", "J11", "J12", "J13", "J14", "J15", "J1", "J2", "J3", "J4", "J5", "J6", "J7", "J8", "J9", "I32", "I31", "I30", "I29", "I28", "I27", "I26", "I25", "I24", "I23", "I22", "I21", "I20", "I19", "I18", "I10", "I11", "I12", "I13", "I14", "I15", "I1", "I2", "I3", "I4", "I5", "I6", "I7", "I8", "I9", "H32", "H31", "H30", "H29", "H28", "H27", "H26", "H25", "H24", "H23", "H22", "H21", "H20", "H19", "H18", "H10", "H11", "H12", "H13", "H14", "H15", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "G32", "G31", "G30", "G29", "G28", "G27", "G26", "G25", "G24", "G23", "G22", "G21", "G20", "G19", "G18", "G10", "G11", "G12", "G13", "G14", "G15", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "F32", "F31", "F30", "F29", "F28", "F27", "F26", "F25", "F24", "F23", "F22", "F21", "F20", "F19", "F18", "F10", "F11", "F12", "F13", "F14", "F15", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "E32", "E31", "E30", "E29", "E28", "E27", "E26", "E25", "E24", "E23", "E22", "E21", "E20", "E19", "E18", "E10", "E11", "E12", "E13", "E14", "E15", "E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "D32", "D31", "D30", "D29", "D28", "D27", "D26", "D25", "D24", "D23", "D22", "D21", "D20", "D19", "D18", "D10", "D11", "D12", "D13", "D14", "D15", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "C32", "C31", "C30", "C29", "C28", "C27", "C26", "C25", "C24", "C23", "C22", "C21", "C20", "C19", "C18", "C10", "C11", "C12", "C13", "C14", "C15", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "B32", "B31", "B30", "B29", "B28", "B27", "B26", "B25", "B24", "B23", "B22", "B21", "B20", "B19", "B18", "B10", "B11", "B12", "B13", "B14", "B15", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15", "A16", "A17", "A18", "A19"]
    console.log(selectId)
    const select = document.getElementById(selectId);
    //create for each for ele in arr
    console.log(select)
    arr.forEach(element => {
        const option = document.createElement('option');
        option.value = element;
        option.text = element;
        select.appendChild(option);
    });
    // const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // for (let i = 0; i < 21; i++) { // A to U is 21 letters
    //     const letter = alphabet[i];
    //     for (let j = 1; j <= 32; j++) {
    //         const option = document.createElement('option');
    //         option.value = `${letter}${j}`;
    //         option.text = `${letter}${j}`;
    //         select.appendChild(option);
    //     }
    // }
}


window.addEventListener('load', function () {
    populateSelect("start-point")
    populateSelect("end-point")
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (svgDocument) {

        var goButton = document.getElementById('goButton');
        goButton.style.display = 'block';

        goButton.addEventListener('click', function () {
            changeFillToGrey(svgDocument);
            var startBox = document.getElementById('start-point').value;
            var endBox = document.getElementById('end-point').value;
            var start = findPathIdsContaining(startBox, svgDocument)
            var end = findPathIdsContaining(endBox, svgDocument)
            console.log(start, end)
            var shortest = shortestPath(start, end, svgDocument);
            console.log(shortest);
            changeFillToRed(shortest, svgDocument);
            // changeRackColor(endBox);
            // zoomToPaths(startBox, endBox);
        })


        // const svgElements = svgDocument.querySelectorAll('svg > *');
        // svgElements.forEach(svgElement => {
        //     svgElement.addEventListener('click', handleSvgClick);
        // });
    }
});


