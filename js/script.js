d3.select("#startButton").on("click", function () {
    d3.select("#introduction")
        .style("opacity", 1)
        .transition().duration(400).style("opacity", 0);
    d3.select("#backgroundImage")
        .style("opacity", 1)
        .transition().duration(400).style("opacity", 0);
    setTimeout(function () {
        d3.select("#introduction").style("display", "none")
        d3.select("#backgroundImage").style("display", "none")
    }, 400);
    setTimeout(function () {
        d3.select("#graph").style("display", "block")
            .style("opacity", 0)
            .transition().duration(1200).style("opacity", 1);
    }, 400);

    d3.select("#returnButton").style("display", "block").style("opacity", 0)
        .transition().duration(1200).style("opacity", 1);
});

// Pulsante per impostare la dark/light mode, avrebbe bisogno di più ottimizzazione
/* // Seleziona il pulsante e il body
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const body = document.querySelector('body');

// Aggiungi un listener per il click sul pulsante
darkModeToggle.addEventListener('click', () => {
    // Attiva/disattiva la classe dark-mode sul body
    body.classList.toggle('dark-mode');

    // Aggiorna il testo del pulsante
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Disattiva Dark Mode';
    } else {
        darkModeToggle.textContent = 'Attiva Dark Mode';
    }
}); */

function showPopupImage(img) {
    document.querySelector(".overlay img").src = img.src;
    document.querySelector(".overlay").style.display = "flex";
}
function hidePopupImage() {
    document.querySelector(".overlay").style.display = "none";
}


d3.select("#returnButton").on("click", function () {
    setTimeout(function () {
        d3.select("#introduction").style("display", "block")
            .style("opacity", 0)
            .transition().duration(400).style("opacity", 1);
        d3.select("#backgroundImage").style("display", "block")
            .style("opacity", 0)
            .transition().duration(400).style("opacity", 1);
    }, 400);


    //d3.select("#graph").style("display", "none")
    d3.select("#graph")
        .style("opacity", 1)
        .transition().duration(400).style("opacity", 0)
        
    d3.select("#returnButton").style("display", "none");
    d3.select("#graph").style("display", "none")
});
// Dimensioni della finestra
const margin = { top: 10, right: 30, bottom: 50, left: 40 },
    width = window.innerWidth,
    height = window.innerHeight - margin.top - margin.bottom;

// Crea l'svg
const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform);
    }))
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// Carica i dati dal dataset formattato
d3.json("output.json").then(function (data) {

    // Dizionario per salvare le connessioni di ogni nodo
    const nodeMap = {};
    data.nodes.forEach(node => {
        const connectedNodes = data.links.filter(link => link.source == node.id || link.target == node.id)
            .map(link => link.source == node.id ? link.target : link.source);
        const connectedNodeNames = data.nodes.filter(node => connectedNodes.includes(node.id))
            .map(node => node.name);
        nodeMap[node.id] = connectedNodeNames;
    });
    let currentNode;

    /*    // Rappresentazione della freccia per indicare il verso del collegamento
       svg.append("defs").append("marker")
           .attr("id", "arrow")
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 21.5)
           .attr("refY", 0)
           .attr("markerWidth", 10)
           .attr("markerHeight", 13)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M0,-3L10,0L0,3")
           .style("fill", "#9999");
   
       // Freccia rossa 
       svg.append("defs").append("marker")
           .attr("id", "arrow-red")
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 21.5)
           .attr("refY", 0)
           .attr("markerWidth", 10)
           .attr("markerHeight", 13)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M0,-3L10,0L0,3")
           .style("fill", "red");
   
       // Freccia rossa 
       svg.append("defs").append("marker")
           .attr("id", "arrow-blue")
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 21.5)
           .attr("refY", 0)
           .attr("markerWidth", 10)
           .attr("markerHeight", 13)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M0,-3L10,0L0,3")
           .style("fill", "blue");
   
       // Freccia rossa 
       svg.append("defs").append("marker")
           .attr("id", "arrow-green")
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 21.5)
           .attr("refY", 0)
           .attr("markerWidth", 10)
           .attr("markerHeight", 13)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M0,-3L10,0L0,3")
           .style("fill", "green");
   
       svg.append("defs").append("marker")
           .attr("id", "arrow-black")
           .attr("viewBox", "0 -5 10 10")
           .attr("refX", 21.5)
           .attr("refY", 0)
           .attr("markerWidth", 10)
           .attr("markerHeight", 13)
           .attr("orient", "auto")
           .append("path")
           .attr("d", "M0,-3L10,0L0,3")
           .style("fill", "black"); */

    // Inizializza i link
    /* const link = svg
        .selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#999")
        .attr("marker-end", "url(#arrow)"); */

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke", "#999")
        .attr("stroke-width", 2);



    // Definisci il tooltip
    var tip = d3.select("#graph").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    // Definizione del pattern per rappresentare i nodi
    const patterns = svg
        .selectAll("pattern")
        .data(data.nodes)
        .join("pattern")
        .attr("id", d => `pattern-${d.id}`)
        .attr("width", 1)
        .attr("height", 1)

    patterns.append("rect")
        .attr("width", 70)
        .attr("height", 70)
        .attr("fill", "#FFFFFF");

    patterns.append("image")
        .attr("xlink:href", d => d.thumbnail)
        .attr("width", 310)
        .attr("height", 310)
        .attr("x", d => -d.radius)
        .attr("y", d => -d.radius);

    // Creazione dei nodi
    const node = svg
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 155)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "#FFFFFF")
        .style("fill", d => `url(#pattern-${d.id})`)
        .on("click", function (event, d) {
            // Rimuovi eventuali popup esistenti
            d3.select("#popup").remove();

            // Crea un nuovo elemento popup
            const popup = d3.select("body")
                .append("div")
                .attr("id", "popup")
                .style("position", "absolute")
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .style("background-color", "white")
                .style("border", "1px solid blue")
                .style("padding", "10px");

            // Titolo del popup
            popup.append("h1").text(d.name);

            // Crea la prima pagina del popup
            const page1 = popup.append("div").attr("id", "page1");

            // Carica il dataset originale con le informazioni aggiuntive
            d3.json("dataset.json").then(function (additionalData) {
                // Cerca le informazioni aggiuntive relative al nodo cliccato
                const additionalInfo = additionalData.find(info => info.id === d.id);
                // Aggiungi le informazioni aggiuntive al popup
                if (additionalInfo) {
                    page1.append("pre").text("Year: " + additionalInfo.year);
                    page1.append("pre").text("Rank: " + additionalInfo.rank);
                    page1.append("pre").text("Min players: " + additionalInfo.minplayers);
                    page1.append("pre").text("Max players: " + additionalInfo.maxplayers);
                    page1.append("pre").text("Min playtime: " + additionalInfo.minplaytime + " min");
                    page1.append("pre").text("Max playtime: " + additionalInfo.maxplaytime + " min");
                    page1.append("pre").text("Min age: " + additionalInfo.minage);
                    if (additionalInfo.rating) {
                        page1.append("pre").text("Rating: " + additionalInfo.rating.rating);
                        page1.append("pre").text("Number of reviews: " + additionalInfo.rating.num_of_reviews);
                    }
                    if (additionalInfo.types && additionalInfo.types.categories) {
                        page1.append("pre").text("Categories: " + additionalInfo.types.categories.map(category => category.name).join(", "));
                    }
                    page1.append("pre").text("Designer(s): " + additionalInfo.credit.designer.map(designer => designer.name).join(", "));
                }
            });
            // Inserisci l'immagine di copertina
            page1.append("img")
                .attr("src", d.image)
                .style("display", "block")
                .style("margin", "auto")
                .style("width", '50%')
                .style('heigth', '50%')


            // Crea la seconda pagina del popup
            const page2 = popup.append("div").attr("id", "page2").style("display", "none");
            page2.append("img")
                .attr("src", d.image)
                .style("display", "block")
                .style("margin", "auto")
                .style("width", '50%')
                .style('heigth', '50%')
                
            page2.append("h3").text("Related games based on players' reviews");
            const connectedNodes = nodeMap[d.id];
            page2.append("pre").text(connectedNodes.join("\n"));

            // Aggiungi un pulsante di chiusura al popup
            popup.append("button")
                .text("X")
                .style("position", "absolute")
                .style("right", "0")
                .style("top", "0")
                .style("fill", "red")
                .on("click", function () {
                    d3.select("#popup").remove();
                });

            // Aggiungi le frecce di navigazione al popup
            popup.append("button")
                .text("<")
                .style("position", "absolute")
                .style("left", "50%")
                .style("transform", "translateX(-120%)")
                .on("click", function () {
                    // Mostra la prima pagina e nascondi la seconda pagina
                    page1.style("display", null);
                    page2.style("display", "none");
                });
            popup.append("button")
                .text(">")
                .style("position", "absolute")
                .style("left", "50%")
                .style("transform", "translateX(20%)")
                .on("click", function () {
                    // Mostra la seconda pagina e nascondi la prima pagina
                    page1.style("display", "none");
                    page2.style("display", null);
                });
        })
        .on("mousemove", function (event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            // Traccia il movimento per muovere il tooltip
            tip.style("left", (mouseX + 10) + "px")
                .style("top", (mouseY + 100) + "px")

        })
        .on("mouseover", (event, d) => {
            var mouseX = event.clientX;
            var mouseY = event.clientY;
            const connectedNodes = nodeMap[d.id];
            currentNode = d;
            links = data.links;
            // Colora i collegamenti del nodo ed i contorni dei nodi collegati
            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .style("stroke-width", 20)
                .style("stroke", "red")

            tip.style("opacity", 1)
                /* .html("<span style='font-size:28px'><strong>" + d.name+ "</span>")
                .style("top", (mouseY + 50) + "px"); */

            tip.append("img")
                .attr("src", d.image)
                .attr("width", 200)
                .attr("height", 200)
                .style("display", "block")
                .style("margin", "auto")
                
            tip.append("p")
                .html('Click on the node to show full information about <strong>'
                    + "<span style='font-size:20px'>"+d.name+'</strong>')

            link
                .filter(function (l) {
                    return l.source === d || l.target === d;
                })
                .transition()
                .duration(200)
                .style("stroke", function (l) {
                    return linkColor(l, links);
                })
                .style("stroke-width", "18")
                .style("opacity", 1)
                .attr("marker-end", function (l) {
                    return arrowColor(l);
                });

            node.filter(function (n) {
                            return connectedNodes.includes(n.name);
            }).transition().duration(200).style("stroke", "black" ).style("stroke-width", "8") 

        })
        .on("mouseout", (event, d) => {
            tip.style("opacity", 0)
                .html("")
            const connectedNodes = nodeMap[d.id];
            d3.select(event.currentTarget)
                .transition()
                .duration(2000)
                .style("stroke", "black")
                .style("stroke-width", 2);
            link.filter(function (l) {
                return l.source === d || l.target === d;
            }).transition().duration(2000).style("opacity", function (l) {
                if (linkColor(l, data.links) === "red") {
                    return 1;
                } else {
                    return 0;
                }
            }).style("stroke-width", null);

            link.filter(function (l) {
                return l.source === d || l.target === d;
            }).transition().delay(2000).duration(2000).attr("marker-end", "url(#arrow)")
            /* node.filter(function (n) {
                return connectedNodes.includes(n.name);
            }).transition().delay(1100).style("stroke", "none").style("stroke-width", 2); */
        })


    // Chiudi il popup quando si clicca al di fuori del popup
    d3.select(document).on("click", function (event) {
        if (event.target.id !== "popup" && event.target.tagName !== "circle" && event.target.id !== "page1" && event.target.id !== "page2" && event.target.tagName !== "BUTTON") {
            d3.select("#popup").remove();
        }
    });



    /* // Aggiungi i label ai nodi
    const label = svg
        .selectAll("text")
        .data(data.nodes)
        .join("text")
        .attr("dx", -40)
        .attr("dy", 50)
        .style("font-size", 11)
        .text(function (d) { return d.name }); */

    // Inizializzazione delle forze per la generazione dei nodi
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink()
            .id(function (d) { return d.id; })
            .distance(600)
            .links(data.links)
        )
        .force("charge", d3.forceManyBody().strength(-30000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("end", ticked);

    // Aggiorna la posizione dei nodi
    function ticked() {
        link
            .attr("stroke", function (d) { return linkColor(d, data.links); })
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        node
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });

        /* label
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; }); */

    }

    function linkColor(d, links) {
        let isBidirectional = false;
        links.forEach(link => {

            if ((link.source.id === d.target.id && link.target.id === d.source.id)) {
                links.forEach(link2 => {
                    if (link2.source.id === d.source.id && link2.target.id === d.target.id) {
                        isBidirectional = true
                    }
                })
            }
            else if (link.source.id === d.source.id && link.target.id === d.target.id) {
                links.forEach(link2 => {
                    if (link2.source.id === d.target.id && link2.target.id === d.source.id) {
                        isBidirectional = true
                    }
                })
            }
        });

        if (isBidirectional) {
            return "red";
        } else if (!currentNode) {
            return "none";
        } else if (d.source.id === currentNode.id) {
            return "green";
        } else if (d.target.id === currentNode.id) {
            return "blue";
        } else {
            return "black";
        }
    }

    /* function bestMatches(){
        links = data.links;
        const matches = new Map();
        links.forEach(link => {

            if ((link.source.id === d.target.id && link.target.id === d.source.id)) {
                links.forEach(link2 => {
                    if (link2.source.id === d.source.id && link2.target.id === d.target.id) {
                        matches.set(link.id, link2.id)
                    }
                })
            }
            else if (link.source.id === d.source.id && link.target.id === d.target.id) {
                links.forEach(link2 => {
                    if (link2.source.id === d.target.id && link2.target.id === d.source.id) {
                        matches.set(link.id, link2.id)
                    }
                })
            }
        });
        return matches;
    }
     */
    function arrowColor(d) {
        if (d.source === currentNode) {
            return "url(#arrow-red)";
        } else if (d.target === currentNode) {
            return "url(#arrow-blue)";
        } else if (d.source === currentNode && d.target === currentNode) {
            return "url(#arrow-green)";
        } else {
            return "url(#arrow-black)";
        }
    }
});