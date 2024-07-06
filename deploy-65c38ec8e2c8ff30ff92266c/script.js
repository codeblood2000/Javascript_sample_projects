function shortestPath(start, end) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (!svgDocument) {
        return -1;
    }
    var nodes = svgDocument.querySelectorAll('circle');
    console.log(nodes);
    var graph = {};

    // Construct the graph
    nodes.forEach(function (node) {
        var id = node.id;
        var neighbors = node.getAttribute('data-neighbors').split(',');
        graph[id] = {};
        neighbors.forEach(function (neighbor) {
            console.log(neighbor);
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

// Function to draw a line between two points
function drawLine(startX, startY, endX, endY) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
    svgDocument.getElementById("cube").appendChild(line);
}

// Function to draw shortest path
function drawShortestPath(path) {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    for (var i = 0; i < path.length - 1; i++) {
        var currentCircle = svgDocument.getElementById(path[i]);
        var nextCircle = svgDocument.getElementById(path[i + 1]);
        drawLine(
            parseInt(currentCircle.getAttribute('cx')),
            parseInt(currentCircle.getAttribute('cy')),
            parseInt(nextCircle.getAttribute('cx')),
            parseInt(nextCircle.getAttribute('cy'))
        );
    }
}

function removeLines() {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (svgDocument) {
        var lines = svgDocument.querySelectorAll('line');
        lines.forEach(function (line) {
            line.remove();
        });
    }
}

window.addEventListener('load', function () {
    var svgObject = document.getElementById('svgObject');
    var svgDocument = svgObject.contentDocument;
    if (svgDocument) {
        // var circles = svgDocument.querySelectorAll('circle');
        // circles.forEach(function (circle) {
        //     // Example manipulation: Change fill color of circles
        //     circle.setAttribute('fill', 'blue');
        // });

        var goButton = document.getElementById('goButton');
        goButton.style.display = 'block';

        goButton.addEventListener('click', function () {
            removeLines();
            var start = document.getElementById('start-point').value;
            var end = document.getElementById('end-point').value;
            var shortest = shortestPath(start, end);
            // console.log(shortest);
            drawShortestPath(shortest);
        })
    }
});