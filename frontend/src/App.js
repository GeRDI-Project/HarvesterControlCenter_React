import React, { Component } from "react";
import HarvesterCard from "./components/Card";
import HccNavbar from "./components/Navbar";
import HccFooter from "./components/Footer";
import axios from "axios";
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewEnabled: true,
            harvesterList: []
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
            .get("/v1/harvesters/status", {headers: this.getToken()})
            .catch(err => console.log(err));
        
        for (var key in response.data) {
            var harvester = {};
            harvester.name = key;
            if (response.data[key] === "disabled") {
                harvester.enabled = false;
                harvester.status = "No status available when disabled";
            } else {
                harvester.enabled = true;
                harvester.status = response.data[key].status;
            }
            newHarvesterList.push(harvester);
        }
        this.setState({ harvesterList: newHarvesterList});
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
                    status={harvester.status}
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
                                <button className="btn btn-link" data-toggle="collapse" data-target="#collapseEnabled" onClick={this.viewEnabled}>
                                    Enabled
                                </button>
                            </h5>
                        </div>
                        <div id="collapseEnabled" className={this.state.viewEnabled ? "collapse show" :"collapse"} data-parent="#harvesterAccordion">
                            <div className="card-body row">
                                {this.renderEnabledHarvesters()}
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <button className="btn btn-link" data-toggle="collapse" data-target="#collapseDisabled" onClick={this.viewDisabled}>
                                    Disabled
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
