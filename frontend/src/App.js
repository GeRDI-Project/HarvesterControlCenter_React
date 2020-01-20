import React, { Component } from "react";
import HarvesterCard from "./components/Card";
import HccNavbar from "./components/Navbar";
import HccFooter from "./components/Footer";
import Spinner from "./components/Spinner";
import CreateModal from "./components/CreateModal";
import axios from "axios";
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            viewEnabled: true,
            harvesterList: [],
            showSpinner: true,
            numEnabledHarvesters: 0,
            numDisabledHarvesters: 0,
            modalIsOpen: false
        };
        this.refreshList = this.refreshList.bind(this);
        this.getToken = this.getToken.bind(this);
        this.viewEnabled = this.viewEnabled.bind(this);
        this.getCSRF = this.getCSRF.bind(this);
        this.viewDisabled = this.viewDisabled.bind(this);
        this.renderHarvesters = this.renderHarvesters.bind(this);
        this.renderEnabledHarvesters = this.renderEnabledHarvesters.bind(this);
        this.renderDisabledHarvesters = this.renderDisabledHarvesters.bind(this);
        this.toggleHarvesterCreateModal = this.toggleHarvesterCreateModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.refreshList();
    }

    getToken() {
        return {"Authorization": "Token ff9f764ebd742535dc7995a891129456f9e8a195"};
    }

    getCSRF() {
        var name, decodedCookie, cookieArray, cookieEntry;
    
        name = "csrftoken=";
        decodedCookie = decodeURIComponent(document.cookie);
        cookieArray = decodedCookie.split(';');
        for (var i = 0; i < cookieArray.length; i++) {
            cookieEntry = cookieArray[i];
    
            // avoid spaces at the beginning
            while (cookieEntry.charAt(0) === ' ') {
                cookieEntry = cookieEntry.substring(1);
            }
            if (cookieEntry.indexOf(name) === 0) {
                cookieEntry = cookieEntry.substring(name.length, cookieEntry.length);
                return cookieEntry;
            }
        }
        return {};
    }

    async refreshList() {
        var newHarvesterList = [];
        const response = await axios
            .get("/v1/harvesters", {headers: this.getToken()})
            .catch(err => console.log(err));
        
        var harvester;
        var numEnabled = 0;
        var numDisabled = 0;
        if (typeof response !== "undefined") {
            if ("results" in response.data) {
                for (var counter in response.data["results"]) {
                    harvester = response.data["results"][counter];
                    newHarvesterList.push(harvester);
                    if (harvester.enabled) {
                        numEnabled += 1;
                    } else {
                        numDisabled += 1;
                    }
                }
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
                    harvester={harvester}
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

    toggleHarvesterCreateModal() {
        this.setState({modalIsOpen: !this.state.modalIsOpen})
    }

    handleSubmit(data) {
        this.toggleHarvesterCreateModal();
        var url = "/v1/harvesters/";
        data["csrfmiddlewaretoken"] = this.getCSRF();
        axios
            .post(url, data, {headers: this.getToken()})
            .catch(err => console.log(err));
        this.refreshList();
    }

    render() {
        return (
        <main className="content">
            <HccNavbar/>
            <div className="container">
                <div className="accordion" id="harvesterAccordion">
                    <div className="card">
                        <div className="card-header">
                            <button className="btn btn-outline-info" data-toggle="collapse" data-target="#collapseEnabled" onClick={this.viewEnabled}>
                                Enabled Harvesters &nbsp;
                                <span className="badge badge-light">{this.state.numEnabledHarvesters}</span>
                            </button>
                            <button className="btn btn-primary float-right" onClick={this.toggleHarvesterCreateModal}>
                                <FontAwesomeIcon icon={faPlus} size="2x"/>
                            </button>
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
                            <button className="btn btn-outline-info" data-toggle="collapse" data-target="#collapseDisabled" onClick={this.viewDisabled}>
                                Disabled Harvesters &nbsp;
                                <span className="badge badge-light">{this.state.numDisabledHarvesters}</span>
                            </button>
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
            {this.state.modalIsOpen ? (
              <CreateModal
                toggle={this.toggleHarvesterCreateModal}
                onSave={this.handleSubmit}
              />
            ) : null}
        </main>
        );
    }
}
export default App;
