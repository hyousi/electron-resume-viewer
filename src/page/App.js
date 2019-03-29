import React from 'react'
import ResumeTable from './ResumeTable'
import ResumeEditor from './ResumeEditor'
import '../style/App.css'

const { ipcRenderer, remote } = window.require('electron')
const { dialog } = remote
const fs = window.require('fs')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 0,
      rowData: null,
      uuid: 0,
      content: null,
    }

    ipcRenderer.on('open', (event, filePath, data) => {
      data = JSON.parse(data)
      console.log(data)
      this.setState({
        status: 1,
        rowData: data,
        uuid: data[0].uuid,
        content: data[0].content === null ? null : data[0].content,
      })
      console.log('load file success')
    })

    ipcRenderer.on('save', () => {
      dialog.showSaveDialog({
        filters: [
          { name: 'JSON', extensions: ['json'] },
        ],
      }, (filePath) => {
        if (!filePath) return
        fs.writeFile(filePath, JSON.stringify(this.state.rowData), 'utf8',
          (err) => {
            if (err) throw err
            alert('The file has been successfully saved.')
          })
      })
    })
  }

  changeContent = (content) => {
    const record = this.state.rowData.find(x => x.uuid === this.state.uuid)
    record.content = content
  }

  changeUUID = (uuid) => {
    this.setState({ uuid: uuid })
  }

  render () {
    switch (this.state.status) {
      case 0:
        return (
          <div>File empty</div>
        )
      case 1:
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
      default :
        return (
          <div>File empty</div>
        )
    }
  }
}

export default App