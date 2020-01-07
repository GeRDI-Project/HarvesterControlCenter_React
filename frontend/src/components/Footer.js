import React, { Component } from "react";

export default class HccFooter extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render () {
        return (
            <footer className="footer">
                <div className="container">
                &copy; 2016-2020 GeRDI Project
                <div className="footer-links">
                    <a href="http://www.gerdi-project.de/contact/"> Contact </a>
                    <a href="https://tu-dresden.de/zih/"> ZIH TU-Dresden </a>
                    <a href="http://www.gerdi-project.de/imprint/"> Imprint </a>
                </div>
                </div>
            </footer>
          );
    }
}