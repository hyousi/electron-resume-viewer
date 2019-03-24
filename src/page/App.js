import React from 'react'
import { Button, Col, Form, Input, Row, Table, Typography } from 'antd'
import columnDefs from './table-config';

/** Features:
 * TODO 1. table中选中行，高亮
 * TODO 2. 保存备注
 *         - 备注框的双向绑定
 *         - 点击保存后，更新数据
 * TODO 3. 根据checkbox展示数据
 *
 * FIXME 1. "Each child in a list should have a unique "key" prop."
 * FIXME 2. 数据展示样式
 *
 * */

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 0,
      uuid: 0,
      columnDefs: null,
      rowData: null,
      note: null,
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
        this.setState({uuid: contents[0].uuid});
        this.setState({status: 1});
      })
    })
  }

  handleChange = (event) => {
    this.setState({note: event.target.value});
  }

  handleSubmit = (event) => {
    console.log("You have submit: " + this.state.note);
    event.preventDefault();
  }

  formItems = (uuid) => {
    const row = this.state.rowData.find(x => x.uuid === uuid);
    let items = [];

    for (const [key, val] of Object.entries(row)) {
      items.push(
        <Form.Item label={key}>
          <Input value={val} />
        </Form.Item>
      )
    }

    return items;
  }



  render () {
    if (this.state.status === 0) {
      return (
        <Button type="primary" onClick={this.handleClickOn}>Open</Button>
      )
    } else {
      return (
        <div>
          <div className="focus">

              <Row gutter={16}>
                <Col span={12}>
                  <Form>
                  { this.formItems(this.state.uuid) }
                  </Form>
                </Col>
                <Col span={12}>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="备注">
                      <Input.TextArea value={this.state.note} onChange={this.handleChange}/>
                      <Input type="submit" value="Submit" />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
          </div>

          <div className="table">
            <Table columns={columnDefs}
                   dataSource={this.state.rowData}
              // scroll={{ x: 600, y: 300 }}
                   size="small"
                   onRow={(record) => ({
                     onClick: () => {
                       this.setState({uuid: record.uuid})
                     },
                   })} />
          </div>
        </div>
      )
    }
  }
}

export default App