import React, { Component } from "react";
import axios from "axios";
import {
  Card, CardHeader, CardText, CardBody
} from 'reactstrap';
import SmallSpinner from "./SmallSpinner";

export default class HarvesterCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            enabled: this.props.enabled,
            status: "",
            harvesting: false
        };
        this.refreshStatus = this.refreshStatus.bind(this);
        this.getToken = this.getToken.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        if (this.state.enabled) {
            this.refreshStatus();
        }
    }

    getToken() {
        return {"Authorization": "Token 5dfb8d8bfa1d538f22011fd7db1dfd4ae361d5f1"};
    }

    async refreshStatus() {
        var url = "/v1/harvesters/" + this.state.name + "/status";
        const response = await axios
            .get(url, {headers: this.getToken()})
            .catch(err => console.log(err));
        var newStatus = response.data[this.state.name].status;
        this.setState({ status: newStatus});
    }

    cardContentEnabled(isEnabled) {
        if (isEnabled) {
            return (
                <CardText>
                    Status:  
                    {(this.state.status == "") ?
                    <SmallSpinner/>
                    : (" " + this.state.status)
                    }
                </CardText>
            );
        } else {
            return (
                <CardText>
                    Status is only availabe for enabled harvesters.
                </CardText>
            );
        }
    }

    start() {
        this.setState({ harvesting: true});
    }

    stop() {
        this.setState({ harvesting: false});
    }

    toggle()

    render () {
        return (
            <div>
                <Card className="mb-3">
                    <CardHeader>
                        {this.state.name}
                        <button className="btn btn-primary btn-sm" onClick={this.toggle()}>
                            {this.state.harvesting ? 'Stop': 'Start'}
                        </button>
                    </CardHeader>
                    <CardBody>
                        {this.cardContentEnabled(this.state.enabled)}
                    </CardBody>
                </Card>
            </div>
        );
    }
};
