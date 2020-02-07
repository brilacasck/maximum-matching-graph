/**
 * @author Alireza Kavian
 * @see https://blilac.ir
 */

import React, { Component } from 'react';
import './App.css';
import graphData from './data';
import MMB from './maxMatchingBi';
import LineTo from 'react-lineto';
import forkme from './forkme.png';


class App extends Component {

    state = {
        graph: graphData,
        matching: {},
        active: {
            val: "",
            id: -1,
            dir: "",
        },
        bcolor: "#77cec8",
        bstyle: "solid",
        isHelp: false,
    }

    componentDidMount(){
        this.mmb = new MMB();
        this.setState({});
    }
    
    run = () => {
        this.clear();
        this.mmb.setGraph(this.state.graph)
        this.setState({
            matching: this.mmb.run(),
            bcolor: "#fff",
        }, () => {
            const {matching} = this.state; 
            Object.keys(matching).forEach(el => {
                if(!isNaN(parseInt(el, 10))){
                    const line = document.getElementsByClassName(`${matching[el]}-${el}`)[0];
                    line.className = line.className + " lineActive"
                }
            })
        });
    }

    clear = () => {
        this.setState({matching: {}, bcolor: "#77cec8"});
        const els = document.getElementsByClassName("lineActive");
        Array.from(els).forEach(el => {
            el.className=el.className.replace(/(.*) lineActive/, "$1");
        })
    }
        
    removeLine = e => {
        const c = e.target.className.replace(/(.*) lines/, "$1").split("-");
        const {graph} = this.state;
        graph[c[0]] = graph[c[0]].filter(el => (el===parseInt(c[1], 10))?"":el);
        this.setState({graph}, () => {
            this.clear();
        })
    }

    addNode = (dir) => {
        const {graph} = this.state;
        if(!dir){
            const len = Object.keys(graph).length;
            const last = [...Object.keys(graph)][len-1];
            let name = last;
            const i = last.length-1;
            if(last[i] < "z"){
                name = name.replace(/(.*).$/, "$1") + String.fromCharCode(name.charCodeAt(i) + 1);
            }
            else{
                name = name + "a";
            }
            graph[name] = [];
            this.setState({graph}, () => {
                this.clear();
            });
        }
        else{
            
            let rights = [];
            Object.values(graph).forEach(el => rights=[...new Set([...rights, ...el])])
            rights = rights.sort(this.sortNumber);
            const len = rights.length;
            const last = rights[len-1];
            let name = last;
            name = parseInt(name, 10) + 1;
            
            // get last node in the left side
            const leftLen = Object.keys(graph).length;
            const leftName = [...Object.keys(graph)][leftLen-1];
            console.log([...graph[leftName], name]);
            graph[leftName] = [...graph[leftName], name];
            this.setState({graph}, () => {
                this.clear();
            });
        }
    }
    
    sortNumber = (a, b) => {
        return a-b;
    }
    
    delNode = (dir) => {
        const {graph} = this.state;
        if(!dir){
            const len = Object.keys(graph).length;
            if(len===1) return;
            delete graph[Object.keys(graph)[len-1]];
            this.setState({graph}, () => {
                this.clear();
            });
        }
        else{
            let rights = [];
            Object.values(graph).forEach(el => rights=[...new Set([...rights, ...el])])
            rights = rights.sort(this.sortNumber);
            const len = rights.length;
            if(len===1) return;
            const name = rights[len-1];
            Object.keys(graph).map(el => graph[el]=graph[el].filter(ell => ell==name?"":ell))
            this.setState({graph}, () => {
                this.clear();
            });
        }

    }

    handle = (e) => {
        const {active} = this.state;
        const val = e.target.innerHTML
        const id = e.target.id
        const dir = isNaN(parseInt(val, 10))?0:1;
        if (active.id!==-1){
            const el = document.getElementsByClassName("active")[0];
            el.className = el.className.replace(/(.*) active/, "$1");
            if(!dir){
                this.setState({
                    active: {
                        val: "",
                        id: -1,
                        dir: "",
                    },
                })
                return;
            }
            this.clear();
            const {graph} = this.state;
            const newGraph = {}; 
            Object.keys(graph).map(el => {
                if(active.val == el){
                    newGraph[el] = [...new Set([...graph[el], parseInt(val, 10)])];
                }
                else {
                    newGraph[el] = graph[el]
                }
            });
            this.setState({
                active: {
                    val: "",
                    id: -1,
                    dir: "",
                },
                graph: newGraph,
            })
        }
        else{
            if(dir){
                return;
            }
            this.setState({active: {dir, id, val}});
            const el = document.getElementById(e.target.id);
            el.className = el.className + " active"
        }
    }

    handlerSection = (dir) => {
        return (
            <div>
                <div>{dir?"RIGHT":"LEFT"} NODE</div>
                <fieldset>
                    <legend>At Bottom</legend>
                    <button onClick={() => this.addNode(dir)}>ADD</button>
                    <button onClick={() => this.delNode(dir)}>DEL</button>
                </fieldset>

            </div>
        );
    }

    render() {
        const {graph, bstyle, bcolor, isHelp} = this.state;
        let rights = [];
        Object.values(graph).forEach(el => rights=[...new Set([...rights, ...el])])
        rights = rights.sort(this.sortNumber);
        
        return (
            <div className="App">
                {
                    isHelp &&
                    (
                        <div id="help-dialog">
                            <ul>
                                <li>To <b>Add/Delete</b> Left Nodes: Use The Button At The <b>Top-Left</b> (Light Red)</li>
                                <li>To <b>Add/Delete</b> Right Nodes: Use The Button At The <b>Top-Right</b> (Light Blue)</li>
                                <br/>
                                <li>To <b>Add Line</b>: Click One of The Left Nodes (Light Red) And Then Click The Intended Right Node (Light Blud) [Left -> Right]</li>
                                <li>To <b>Delete Line</b>: Just Click The Line You Want To Be Removed</li>
                                <br/>
                                <li>To <b>Run</b> The <b>Maximum Matching Bipartite Graph Algorithm</b> (Hopcroft-Karp): Just Click The RUN Button At The Bottom-Right</li>
                                <li>To <b>Clear</b> The Running Results: Just Click The CLR Button At The Bottom-Right</li>
                            </ul>
                        </div>
                    )
                }
                <div id="forkme" title="Source Code"><a href="https://github.com/brilacasck/maximum-matching-graph"><img alt="fork-me-on-github" src={forkme} /></a></div>
                <div id="help" className="noselect" onClick={() => this.setState(state => ({isHelp: !state.isHelp}))}>?</div>
                <div id="clear" className="noselect" onClick={this.clear}>CLR</div>
                <div id="run" className="noselect" onClick={this.run}>RUN</div>
                <div>
                    <div className="lefthandle handle">{this.handlerSection(0)}</div>
                    <div className="righthandle handle">{this.handlerSection(1)}</div>
                </div>
                <div>
                    <div className="left node">
                        {
                            Object.keys(graph).map((el, i) => {
                                return <div onClick={this.handle} id={`l${el}`} className={`l${el} noselect`} key={el}>{el}</div>
                            })
                        }
                    </div>
                    <div className="right node">
                        {
                            rights.map((el, i) => {
                                return <div onClick={this.handle} id={`r${el}`} className={`r${el} noselect`} key={el}>{el}</div>
                            })
                        }
                    </div>
                    {
                        Object.keys(graph).map(el => {
                            return (
                                <div key={`line-${el}`} onClick={this.removeLine}>
                                    {
                                        graph[el].map(ell => {
                                            return <LineTo className={`${el}-${ell} lines`} key={`${el}-${ell}`} from={`l${el}`} to={`r${ell}`} borderColor={bcolor} borderStyle={bstyle} borderWidth={4} fromAnchor="right" toAnchor="left" />
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default App;
