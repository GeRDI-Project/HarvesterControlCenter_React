import React, { Component } from "react";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';

export default class CreateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            url: "",
            notes: "",
            user: "gerdi"
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        let { name, value } = e.target;
        this.setState({[name]: value});
    }

    render() {
        const { toggle, onSave } = this.props;
        const { name, url } = this.state;
        const validInput = name.length > 0 && url.length > 0;
        return(
            <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Add Harvester </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="title">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleInputChange}
                    placeholder="Enter harvester name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="notes">Notes</Label>
                  <Input
                    type="text"
                    name="notes"
                    value={this.state.notes}
                    onChange={this.handleInputChange}
                    placeholder="Enter notes"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="url">Url</Label>
                  <Input
                    type="text"
                    name="url"
                    value={this.state.url}
                    onChange={this.handleInputChange}
                    placeholder="Enter harvester url"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button disabled={!validInput} color="success" onClick={() => onSave(this.state)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
    }
}