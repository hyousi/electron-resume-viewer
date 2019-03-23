import React from 'react'
import { Button, Col, Form, Input, Row, Table, Typography } from 'antd'
import columnDefs from './table-config';

/**
 * TODO Implement features:
 *      - 选中的行高亮
 *      - 保存备注（双向绑定）
 *
 * FIXME Optimize:
 *      - 表格样式
 *      - 个人信息Card样式
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

  handleSave = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, notes) => {
      if (!err) {
        console.log('Received notes:', notes);
      }
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
          <div className="focus">
            <Form>
              <Row gutter={16}>
                <Col span={12}>
                  { this.formItems(this.state.uuid) }
                </Col>
                <Col span={12}>
                  <Form onSubmit={this.handleSave}>
                    <Form.Item label="备注">
                      <Input.TextArea autosize={{minRows: 10}} value={this.state.rowData.uuid.note}/>
                    </Form.Item>
                    <Form.Item>
                      <Button>保存</Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </Form>
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