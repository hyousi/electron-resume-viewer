import React from 'react'
import { Button, Table } from 'antd'
import Focus from './Focus'
import columnDefs from './table-config';

/**
 * TODO Implement features:
 *      - 点击表格中行，高亮，传递数据
 *      - Focus样式
 *      - 可编辑样式
 * */

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 0,
      person: 0,
      columnDefs: null,
      rowData: null,
    }
  }

  handleClickOn = () => {
    // 打开JSON文件
    const { dialog } = window.require('electron').remote
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
      if (filePaths == null) { return }

      const fs = window.require('fs')
      fs.readFile(filePaths[0], 'utf8', (err, contents) => {
        if (err) { alert(err) }
        contents = eval(contents);
        this.setState({rowData: contents});
        this.setState({status: 1});
      })
    })
  }

  render () {
    if (this.state.status === 0) {
      return (
        <Button type="primary" onClick={this.handleClickOn}>Open</Button>
      )
    } else {
      return (
        <div>
          <Focus/>
          <Table columns={columnDefs}
                 dataSource={this.state.rowData}
                 // scroll={{ x: 600, y: 300 }}
                 size="small"
                 onRow={(record) => ({
                   onClick: () => {
                     console.log(record.uuid)
                   },
                 })} />
        </div>
      )
    }
  }
}

export default App