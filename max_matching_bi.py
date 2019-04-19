import json


def dfs(graph, v, index, layers, dfs_parent, dfs_paths, matching, nodes):
    if index == 0:
        path = [v]
        while dfs_parent[v] != v:
            path.append(dfs_parent[v])
            v = dfs_parent[v]
        dfs_paths.append(path)
        return True
    for neighbour in graph[v]:
        if neighbour in layers[index - 1]:
            if neighbour in dfs_parent:
                continue
            if ((neighbour in nodes[0] and (v not in matching or neighbour != matching[v])) or
                    (neighbour in nodes[1] and (v in matching and neighbour == matching[v]))):
                dfs_parent[neighbour] = v
                if dfs(graph, neighbour, index-1, layers, dfs_parent, dfs_paths, matching, nodes):
                    return True
    return False

def bfs(graph, matching, nodes):
    layers = []
    layer = set()
    for vertex in nodes[0]:
        if vertex not in matching:
            layer.add(vertex)
    layers.append(layer)
    visited = set()
    while True:
        layer = layers[-1]
        new_layer = set()
        for vertex in layer:
            if vertex in nodes[0]:
                visited.add(vertex)
                for neighbour in graph[vertex]:
                    if (neighbour not in visited and
                        (vertex not in matching or neighbour != matching[vertex])):
                        new_layer.add(neighbour)
            else:
                visited.add(vertex)
                for neighbour in graph[vertex]:
                    if (neighbour not in visited and
                        (vertex in matching and neighbour == matching[vertex])):
                        new_layer.add(neighbour)
        layers.append(new_layer)
        if len(new_layer) == 0:
            return layers
        if any(vertex in nodes[1] and vertex not in matching for vertex in new_layer):
            return layers

def maximum_matching(graph, nodes):
    matching = {}
    dfs_paths = []
    dfs_parent = {}
    while True:
        layers = bfs(graph, matching, nodes)

        if len(layers[-1]) == 0:
            break
        free_vertex = set([vertex for vertex in layers[-1] if vertex not in matching])
        del dfs_paths[:]
        dfs_parent.clear()
        for vertex in free_vertex:
            dfs_parent[vertex] = vertex
            dfs(graph, vertex, len(layers)-1, layers, dfs_parent, dfs_paths, matching, nodes)
        if len(dfs_paths) == 0:
            break
        for path in dfs_paths:
            for i in range(len(path)):
                if i % 2 == 0:
                    matching[path[i]] = path[i+1]
                    matching[path[i+1]] = path[i]
    return matching

def run_mm(graph):
    nodes = (set(graph.keys()), {j for i in graph.values() for j in i})

    for vertex in nodes[0]:
        for neighbour in graph[vertex]:
            if neighbour not in graph:
                graph[neighbour] = set()
                graph[neighbour].add(vertex)
            else:
                graph[neighbour].add(vertex)

    result = maximum_matching(graph, nodes)

    return result


data = {
    "a": [1],
    "b": [1, 2],
    "c": [1, 2],
    "d": [2, 3, 4],
    "e": [3, 4],
    "f": [4, 5, 6],
    "g": [5, 6, 7],
    "h": [8]
}

print(run_mm(data))
