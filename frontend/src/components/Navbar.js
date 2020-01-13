import React, { Component } from "react";
import {
    Navbar, NavbarBrand
} from 'reactstrap';

export default class HccNavbar extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render () {
        return (
            <div>
                <Navbar className="custom-navbar fixed-top" color="light" expand="sm">
                    <NavbarBrand href="/">Harvester Control Center</NavbarBrand>
                </Navbar>
            </div>
          );
    }
}