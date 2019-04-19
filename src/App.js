import React, { Component } from 'react';
import './App.css';
import graphData from './data';
import MMB from './maxMatchingBi';
import LineTo from 'react-lineto';


class App extends Component {

    state = {
        graph: graphData,
        matching: {},
        active: {
            val: "",
            id: -1,
            dir: "",
        },
        bcolor: "#de59e0",
        bstyle: "solid"
    }

    componentDidMount(){
        this.mmb = new MMB();
        this.setState({});
    }
    
    run = () => {
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
        this.setState({matching: {}, bcolor: "#de59e0"});
        const els = document.getElementsByClassName("lineActive");
        Array.from(els).map(el => {
            el.className=el.className.replace(/(.*) lineActive/, "$1");
        })
    }
        

    handle = (e) => {
        const {active} = this.state;
        const val = e.target.innerHTML
        const id = e.target.id
        const dir = isNaN(parseInt(val, 10))?0:1;
        if (active.id!==-1){
            const el = document.getElementsByClassName("active")[0];
            el.className = el.className.replace(/(.*) active/, "$1");
            
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
            console.log(newGraph)
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
                    <legend>New</legend>
                    <button>ADD</button>
                </fieldset>

            </div>
        );
    }

    render() {
        const {graph, bstyle, bcolor} = this.state;
        let rights = [];
        Object.values(graph).forEach(el => rights=[...new Set([...rights, ...el])])
        
        return (
            <div className="App">
                <div id="clear" onClick={this.clear}>CLR</div>
                <div id="run" onClick={this.run}>RUN</div>
                <div>
                    <div className="lefthandle handle">{this.handlerSection(0)}</div>
                    <div className="righthandle handle">{this.handlerSection(1)}</div>
                </div>
                <div>
                    <div className="left node">
                        {
                            Object.keys(graph).map((el, i) => {
                                return <div onClick={this.handle} id={`l${el}`} className={`l${el}`} key={el}>{el}</div>
                            })
                        }
                    </div>
                    <div className="right node">
                        {
                            rights.map((el, i) => {
                                return <div onClick={this.handle} id={`r${el}`} className={`r${el}`} key={el}>{el}</div>
                            })
                        }
                    </div>
                    {
                        Object.keys(graph).map(el => {
                            return (
                                <div key={`line-${el}`}>
                                    {
                                        graph[el].map(ell => {
                                            return <LineTo className={`${el}-${ell} lines`} key={`${el}-${ell}`} from={`l${el}`} to={`r${ell}`} borderColor={bcolor} borderStyle={bstyle} borderWidth={2} fromAnchor="right" toAnchor="left" />
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
