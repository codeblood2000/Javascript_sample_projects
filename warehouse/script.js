function shortestPath(start, end) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
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

function changeFillToGrey() {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (svgDocument) {
        var paths = svgDocument.querySelectorAll('path[id^="P-"]');
        paths.forEach(function (path) {
            path.setAttribute('fill', 'grey');
        });
    }
}

function changeFillToRed(pathIds) {
    // Get the <object> element containing the SVG
    var svgObject = document.getElementById('svgObject');

    // Get the SVG document within the <object> element
    var svgDocument = svgObject.contentDocument;
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

function handleSvgClick(event) {
    // Get the SVG document within the <object> element
    const svgDoc = document.getElementById('svgObject').contentDocument;

    // Get the ID of the clicked SVG element
    const svgElementId = event.target.id;

    // Show an alert with the ID of the SVG element
    alert(`Clicked SVG element ID: ${svgElementId}`);
}

function findPathIdsContaining(rackId) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    const pathElements = svgDocument.querySelectorAll('path[id^="P-"]'); // Select all <path> elements within the SVG

    // Array to store matching path IDs
    let matchingPathId = null;

    pathElements.forEach(path => {
        const idParts = path.id.split('-');
        // Check if the path ID contains the specified substring
        if (idParts.includes(rackId)) {
            matchingPathId = path.id;
            return;
        }
    });

    return matchingPathId;
}

function changeRackColor(rackId, color) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
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


window.addEventListener('load', function () {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (svgDocument) {

        var goButton = document.getElementById('goButton');
        goButton.style.display = 'block';

        goButton.addEventListener('click', function () {
            changeFillToGrey();
            var startBox = document.getElementById('start-point').value;
            var endBox = document.getElementById('end-point').value;
            var start = findPathIdsContaining(startBox)
            var end = findPathIdsContaining(endBox)
            console.log(start, end)
            var shortest = shortestPath(start, end);
            console.log(shortest)
            changeFillToRed(shortest);
            changeRackColor(endBox)
        })


        const svgElements = svgDocument.querySelectorAll('svg > *');
        svgElements.forEach(svgElement => {
            svgElement.addEventListener('click', handleSvgClick);
        });
    }
});


