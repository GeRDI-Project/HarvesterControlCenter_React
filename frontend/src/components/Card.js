import React, { Component } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardBody
} from 'reactstrap';
import SmallSpinner from "./SmallSpinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faStopCircle, faSync } from '@fortawesome/free-solid-svg-icons';
import { Progress } from 'reactstrap';

export default class HarvesterCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            harvester: this.props.harvester,
            status: "",
            harvesting: false,
            harvestingProgress: {},
            interval: null
        };
        this.refreshStatus = this.refreshStatus.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getCSRF = this.getCSRF.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.toggle = this.toggle.bind(this);
        this.cardBodyContent = this.cardBodyContent.bind(this);
        this.cardHeaderContent = this.cardHeaderContent.bind(this);
        this.refresh = this.refresh.bind(this);
        this.renderProgressBar = this.renderProgressBar.bind(this);
    }

    componentDidMount() {
        if (this.state.harvester.enabled) {
            this.refreshStatus();
        }
    }

    refresh() {
        this.setState({ status: ""});
        this.refreshStatus();
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
                return "csrfmiddlewaretoken=" + cookieEntry;
            }
        }
        return {};
    }

    async refreshStatus() {
        var url = "/v1/harvesters/" + this.state.harvester.name + "/status";
        const response = await axios
            .get(url, {headers: this.getToken()})
            .catch(err => console.log(err));

        var newStatus;
        var isHarvesting;
        var hProgress = {};
        if (response) {
            newStatus = response.data[this.state.harvester.name].status;
            hProgress.cachedDocs = response.data[this.state.harvester.name].cached_docs;
            hProgress.progress = response.data[this.state.harvester.name].progress;
            hProgress.progressCur = response.data[this.state.harvester.name].progress_cur;
            hProgress.progressMax = response.data[this.state.harvester.name].progress_max;
            hProgress.maxDocs = response.data[this.state.harvester.name].max_docs;
            hProgress.lastHarvestDate = response.data[this.state.harvester.name].lastHarvestDate;
        } else {
            newStatus = "no status";
            hProgress.cachedDocs = 0;
            hProgress.progress = 0;
            hProgress.progressCur = 0;
            hProgress.progressMax = 0;
            hProgress.maxDocs = 0;
            hProgress.lastHarvestDate = "";
        }
        isHarvesting = (newStatus === "harvesting" || newStatus === "queued");
        this.setState({ status: newStatus, harvesting: isHarvesting, harvestingProgress: hProgress});
    }

    cardBodyContent(isEnabled) {
        if (isEnabled) {
            return ( 
                <>
                    <li className="list-group-item">
                        {(this.state.status === "") 
                        ?
                        <SmallSpinner/>
                        :
                        (<>
                            Status:  {" " + this.state.status} &nbsp;
                            <button className="btn btn-success btn-sm float-right" onClick={() => this.refresh()}>
                                <FontAwesomeIcon icon={faSync} />
                            </button>
                        </>)}
                    </li>
                </>
            );
        } else {
            return null;
        }
    }

    cardHeaderContent(isEnabled) {
        if (isEnabled) {
            return (
                <>
                    {this.state.harvester.name}
                    {this.state.status !== "no status" && this.state.status !== "" ?
                            <button className="btn btn-primary btn-sm float-right" onClick={() => this.toggle()}>
                                {this.state.harvesting 
                                ? 
                                <FontAwesomeIcon icon={faStopCircle} />
                                :
                                <FontAwesomeIcon icon={faPlayCircle} />
                                }
                            </button>
                    : null}
                </>
            )
        } else {
            return (
                <>
                    {this.state.harvester.name}
                </>
            )
        }
    }

    async start() {
        var url = "/v1/harvesters/" + this.state.harvester.name + "/start/";
        const response = await axios
            .post(url, this.getCSRF(), {headers: this.getToken()})
            .catch(err => console.log(err));

        if (response) {
            this.setState({ harvesting: true});
            var ival = setInterval(this.refreshStatus, 2000);
            this.setState({interval: ival});
        }
    }

    async stop() {
        var url = "/v1/harvesters/" + this.state.harvester.name + "/stop/";
        const response = await axios
        .post(url, this.getCSRF(), {headers: this.getToken()})
            .catch(err => console.log(err));

        if (response) {
            this.setState({ harvesting: false});
            if (this.state.interval !== null) {
                clearInterval(this.state.interval);
                this.setState({intervall: null});
            }
        }
    }

    toggle() {
        if (this.state.harvesting) {
            this.stop();
        } else {
            this.start();
        }
    }

    renderProgressBar() {
        if (this.state.interval === null) {
            var ival = setInterval(this.refreshStatus, 2000);
            this.setState({interval: ival});
        }
        if (this.state.harvestingProgress.progress  && this.state.harvestingProgress.maxDocs) {
            var currentProgress = this.state.harvestingProgress.progress * 100 / this.state.harvestingProgress.maxDocs;
        }
        return (
            <>
                <div className="text-center">{currentProgress}%</div>
                <Progress value={currentProgress}/>
            </>
        );
    }

    render () {
        return (
            <div>
                <Card className="mb-3">
                    {this.state.harvesting ?
                    this.renderProgressBar()
                    : null}
                    <CardHeader>
                        {this.cardHeaderContent(this.state.harvester.enabled)}
                    </CardHeader>
                    <CardBody>
                        <li className="list-group-item">
                            Notes: {" " +  this.state.harvester.notes }
                        </li>
                        {this.cardBodyContent(this.state.harvester.enabled)}
                    </CardBody>
                </Card>
            </div>
        );
    }
};
