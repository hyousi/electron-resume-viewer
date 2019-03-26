import React from 'react'
import { Button } from 'antd';
import ResumeTable from './ResumeTable';
import ResumeEditor from './ResumeEditor';
import '../style/App.css';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 0,
      uuid: 0,
      rowData: null,
      content: null,
    }
  }

  handleClickOn = () => {
    // 打开JSON文件
    const { dialog } = window.require('electron').remote
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
      if (filePaths == null) { return }

      const fs = window.require('fs')
      fs.readFile(filePaths[0], 'utf8', (err, data) => {

        if (err) { alert(err) }

        data = eval(data);
        this.setState({
          rowData: data,
          uuid: data[0].uuid,
          content: data[0].content,
          status: 1, });
      });
    });
  }

  changeContent = (content) => {
    const record = this.state.rowData.find(x => x.uuid === this.state.uuid);
    record.content = content;
  }

  changeUUID = (uuid) => {
    this.setState({uuid: uuid});
  }

  render () {
    if (this.state.status === 0) {
      return (
        <Button type="primary" onClick={this.handleClickOn}>Open</Button>
      )
    } else {
      return (
        <div>
          <ResumeEditor
            dataSource={this.state.rowData}
            uuid={this.state.uuid}
            changeContent={this.changeContent}
          />
          <ResumeTable
            dataSource={this.state.rowData}
            uuid={this.state.uuid}
            changeUUID={this.changeUUID}
          />
        </div>
      )
    }
  }
}

export default App