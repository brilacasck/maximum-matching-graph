import data from './data.mjs';

const bfs = (graph, matching, nodes) => {
    let layers = []
    let layer = new Set();
    nodes[0].forEach(vertex => {        
        if (!matching[vertex]){
            layer.add(vertex)
        }
    })
    layers.push(layer)
    let visited = new Set()
    while (true){
        layer = layers[layers.length-1];
        let new_layer = new Set()
        layer.forEach (vertex => {
            if (nodes[0].has(vertex)){
                visited.add(vertex)
                graph[vertex].forEach (neighbour => {
                    if (!visited.has(neighbour) && (!matching[vertex] || neighbour != matching[vertex])){
                            new_layer.add(neighbour)
                        }
                })
            }
            else{
                visited.add(vertex)
                graph[vertex].forEach (neighbour => {
                    if (!visited.has(neighbour) && (!matching[vertex] && neighbour == matching[vertex])){
                        new_layer.add(neighbour)
                    }
                })
            }
        })
        layers.push(new_layer)
        if (new_layer.size == 0){
            return layers
        }
        if ([...Array.from(new_layer)].map(el => (nodes[1].has(el) && !matching[el])).some(bool => bool)){
            return layers
        }
    }
}

const dfs = (graph, v, index, layers, dfs_parent, dfs_paths, matching, nodes) => {
    if (index == 0){
        const path = [v]
        while (dfs_parent[v] != v){
            path.push(dfs_parent[v])
            v = dfs_parent[v]
        }
        dfs_paths.push(path)
        return true
    }
    graph[v].forEach(neighbour => {
        if (layers[index - 1].has(neighbour)){
            if (dfs_parent[neighbour]) return
            if ((nodes[0].has(neighbour) && (!matching[v] || neighbour != matching[v])) ||
                (nodes[1].has(neighbour) && (matching[v] && neighbour == matching[v]))){
                        dfs_parent[neighbour] = v
                        if (dfs(graph, neighbour, index-1, layers, dfs_parent, dfs_paths, matching, nodes)){
                            return true
                        }
                    }
        }
    })
    return false
}

let graph = {};
Object.keys(data).forEach(el => graph[[el]] = new Set(data[el]))
let nodes = [
    new Set([...Object.keys(graph)]),
    new Set(Object.values(data).join(",").split(",").map(el => parseInt(el, 10)))
]

nodes[0].forEach(vertex => {
    graph[vertex].forEach(neighbour => {
        graph[neighbour] = (graph[neighbour]?graph[neighbour].add(vertex):new Set([vertex]));
    });
});

let matching = {};
let dfs_paths = [];
let dfs_parent = {};
let layers = [];
let free_vertex = null;
while (true){
    layers = bfs(graph, matching, nodes);
    if (layers[layers.length-1].size == 0) break;
    free_vertex = new Set([...Array.from(layers[layers.length-1]).filter(vertex => !matching[vertex]?vertex:"")])
    dfs_paths = []
    dfs_parent = {}
    free_vertex.forEach(vertex => {
        dfs_parent[vertex] = vertex
        dfs(graph, vertex, layers.length-1, layers, dfs_parent, dfs_paths, matching, nodes)
    })
    if (dfs_paths.length == 0) break
    for (let path in dfs_paths){
        for (let i in [...Array(dfs_paths[path].length).keys()]){
            console.log(dfs_paths[path]);
            
            if (i % 2 == 0){
                matching[dfs_paths[path][i]] = dfs_paths[path][i+1]
                matching[dfs_paths[path][i+1]] = dfs_paths[path][i]
            }
        }
    }
    // console.log(matching);
    
}

console.log(matching)