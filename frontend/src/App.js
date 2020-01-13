import React, { Component } from "react";
import HarvesterCard from "./components/Card";
import HccNavbar from "./components/Navbar";
import HccFooter from "./components/Footer";
import Spinner from "./components/Spinner";
import axios from "axios";
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewEnabled: true,
            harvesterList: [],
            showSpinner: true,
            numEnabledHarvesters: 0,
            numDisabledHarvesters: 0
        };
        this.refreshList = this.refreshList.bind(this);
        this.getToken = this.getToken.bind(this);
        this.viewEnabled = this.viewEnabled.bind(this);
        this.viewDisabled = this.viewDisabled.bind(this);
        this.renderHarvesters = this.renderHarvesters.bind(this);
        this.renderEnabledHarvesters = this.renderEnabledHarvesters.bind(this);
        this.renderDisabledHarvesters = this.renderDisabledHarvesters.bind(this);
    }

    componentDidMount() {
        this.refreshList();
    }

    getToken() {
        return {"Authorization": "Token 5dfb8d8bfa1d538f22011fd7db1dfd4ae361d5f1"};
    }

    async refreshList() {
        var newHarvesterList = [];
        const response = await axios
            .get("/v1/harvesters", {headers: this.getToken()})
            .catch(err => console.log(err));
        
        var harvester;
        var numEnabled = 0;
        var numDisabled = 0;
        for (var counter in response.data["results"]) {
            harvester = {};
            harvester.name = response.data["results"][counter].name;
            harvester.enabled = response.data["results"][counter].enabled;
            newHarvesterList.push(harvester);
            if (harvester.enabled) {
                numEnabled += 1;
            } else {
                numDisabled += 1;
            }
        }
        this.setState({ harvesterList: newHarvesterList,
                        showSpinner: false,
                        numEnabledHarvesters: numEnabled,
                        numDisabledHarvesters: numDisabled});
    }

    viewEnabled(e) {
        e.preventDefault();
        this.setState({ viewEnabled: true });
    }

    viewDisabled(e) {
        e.preventDefault();
        this.setState({ viewEnabled: false });
    }

    renderHarvesters(status) {
        const harvesters = this.state.harvesterList.filter(
            harvester => harvester.enabled === status
        );
        return harvesters.map(harvester => (
            <div
                key={harvester.name}
                className="col-lg-4 col-md-6 col-sm-12"
            >
                <HarvesterCard
                    name={harvester.name}
                    enabled={harvester.enabled}
                />
            </div>
        ));
    };

    renderEnabledHarvesters() {
        return this.renderHarvesters(true);
    }

    renderDisabledHarvesters() {
        return this.renderHarvesters(false);
    }

    render() {
        return (
        <main className="content">
            <HccNavbar/>
            <div className="container">
                <div className="accordion" id="harvesterAccordion">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-info" data-toggle="collapse" data-target="#collapseEnabled" onClick={this.viewEnabled}>
                                    Enabled Harvesters &nbsp;
                                    <span className="badge badge-light">{this.state.numEnabledHarvesters}</span>
                                </button>
                            </h5>
                        </div>
                        <div id="collapseEnabled" className={this.state.viewEnabled ? "collapse show" :"collapse"} data-parent="#harvesterAccordion">
                            <div className="card-body row">
                                {this.state.showSpinner ? 
                                <div className="col-md-6 col-md-offset-3">
                                    <Spinner/>
                                </div> 
                                : null}
                                {this.renderEnabledHarvesters()}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <button className="btn btn-outline-info" data-toggle="collapse" data-target="#collapseDisabled" onClick={this.viewDisabled}>
                                    Disabled Harvesters &nbsp;
                                    <span className="badge badge-light">{this.state.numDisabledHarvesters}</span>
                                </button>
                            </h5>
                        </div>
                        <div id="collapseDisabled" className={this.state.viewEnabled ? "collapse" :"collapse show"} data-parent="#harvesterAccordion">
                            <div className="card-body row">
                                {this.renderDisabledHarvesters()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HccFooter/>
        </main>
        );
    }
}
export default App;
