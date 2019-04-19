import graphData from './data';

/**
 * @class MBB - Maximum Matching BipartiteGraph
 */
export default class MMB {

    constructor(){
        this.setGraph();
    }
    
    /**
     * BFS on bipartite graph with considering alternating paths
     */
    bfs = (graph, matching, nodes) => {
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
    
    /**
     * DFS on bipartite graph with considering alternating paths
     */
    dfs = (graph, v, index, layers, dfs_parent, dfs_paths, matching, nodes) => {
        if (index == 0){
            const path = [v]
            while (dfs_parent[v] != v){
                path.push(dfs_parent[v])
                v = dfs_parent[v]
            }            
            dfs_paths.push(path)
            return true
        }
        
        const graph_v_entries = graph[v].entries();
        for (let neighbour of graph_v_entries){
            neighbour = neighbour[1]
            if (layers[index - 1].has(neighbour)){
                if (dfs_parent[neighbour]) return
                if ((nodes[0].has(neighbour) && (!matching[v] || neighbour != matching[v])) ||
                        (nodes[1].has(neighbour) && (matching[v] && neighbour == matching[v]))){
                            dfs_parent[neighbour] = v
                            if (this.dfs(graph, neighbour, index-1, layers, dfs_parent, dfs_paths, matching, nodes)){
                                return true
                            }
                        }
            }
        }
        return false
    }

    /**
     * set the graph data
     */
    setGraph = (data=graphData) => {
        this.graph = {};
        
        Object.keys(data).forEach(el => this.graph[[el]] = new Set(data[el]))
        this.nodes = [
            new Set([...Object.keys(this.graph)]),
            new Set(Object.values(data).join(",").split(",").map(el => parseInt(el, 10)))
        ]
        
        this.nodes[0].forEach(vertex => {
            this.graph[vertex].forEach(neighbour => {
                this.graph[neighbour] = (this.graph[neighbour]?this.graph[neighbour].add(vertex):new Set([vertex]));
            });
        });
    }
    
    /**
     * do the algorithms
     */
    run = () => {
        
        const matching = {};
        let layers = [];
        let free_vertex = null;
        
        while (true){
            layers = this.bfs(this.graph, matching, this.nodes);
            
            if (layers[layers.length-1].size === 0) break;
            free_vertex = new Set([...Array.from(layers[layers.length-1]).filter(vertex => !matching[vertex]?vertex:"")])
            
            
            const dfs_paths = [];
            const dfs_parent = {};
            
            const free_vertex_entries = free_vertex.entries();
            
            for (let vertex of free_vertex_entries) {
                vertex = vertex[1]
                dfs_parent[vertex] = vertex;             
                
                this.dfs(this.graph, vertex, (layers.length-1), layers, dfs_parent, dfs_paths, matching, this.nodes);
            }            
            
            if (dfs_paths.length === 0) break
            for (let path in dfs_paths){
                for (let i in [...Array(dfs_paths[path].length).keys()]){
                    i = parseInt(i);
                    
                    if (i % 2 === 0){
                        matching[dfs_paths[path][i]] = dfs_paths[path][i+1]
                        matching[dfs_paths[path][i+1]] = dfs_paths[path][i]
                    }
                }
            }
        }
        return matching;
    }
}
