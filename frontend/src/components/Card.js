import React, { Component } from "react";
import {
  Card, CardHeader, CardText, CardBody
} from 'reactstrap';

export default class HarvesterCard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: this.props.name,
        status: this.props.status
      };
    }
    render () {
        return (
            <div>
                <Card>
                    <CardHeader>{this.state.name}</CardHeader>
                    <CardBody>
                        <CardText>{this.state.status}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
};
