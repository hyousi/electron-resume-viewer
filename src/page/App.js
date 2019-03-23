import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { Button } from 'antd';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            person: 0,
            columnDefs: null,
            rowData: null,
        }
    }

    handleClickOn = () => {
        const {dialog} = window.require('electron').remote;
        dialog.showOpenDialog({properties: ['openFile']}, (filePaths) => {
            if (filePaths == null) { return; }

            const fs = window.require('fs');
            fs.readFile(filePaths[0], 'utf8', (err, contents) => {
                if (err) { alert(err); }
                contents = eval(contents);
                this.setTableHeader(contents);
                this.setTableRow(contents);
                this.setState({status: 1});
            })
        });
    };


    setTableHeader(contents) {
        let headerArray = [];

        for (let i = 0; i < contents.length; i++) {
            headerArray = Array.from(new Set(headerArray.concat(Object.keys(contents[i]))));
        }

        let columnDefs = [];
        for (let i = 0; i < headerArray.length; i++) {
            let column = {};
            column.headerName = headerArray[i];
            column.field = headerArray[i];
            column.sortable = true;
            column.checkboxSelection = true;
            columnDefs.push(column);
        }

        this.setState({columnDefs: columnDefs});
    }

    setTableRow(contents) {
        this.setState({rowData: contents});
    }

    render() {
        if (this.state.status === 0) {
            return (
                <Button type="primary" onClick={this.handleClickOn}>Open</Button>
            )
        } else {
            return (
                <div className="ag-theme-balham table"
                     style={{ height: '500px', width: '600px' }}>
                    <button onClick={this.handleClickFocus}>Get selected rows</button>
                    <AgGridReact columnDefs={this.state.columnDefs}
                                 rowData={this.state.rowData}
                                 onGridReady={ params => this.gridApi = params.api }>
                    </AgGridReact>
                </div>
            )
        }
    }
}

export default App;