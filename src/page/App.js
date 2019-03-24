import React from 'react'
import { Button, Card, Col, Form, Input, Row, Table, Checkbox } from 'antd'
import columnDefs from './table-config';
import '../style/App.css';

/**
 *
 * FIXME 1. 数据展示样式
 *       2. 代码重构
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
      keys: [],
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
    const record = this.state.rowData.find(x => x.uuid === this.state.uuid);
    console.log("before: " + record.note);
    record.note = this.state.note;
    console.log("after: " + record.note);
    console.log(this.state.rowData);
    event.preventDefault();
  }

  handleCheckboxOn = (checkedValues) => {
    console.log(checkedValues);
    this.setState({keys: checkedValues});
  }

  formItems = (uuid) => {
    const row = this.state.rowData.find(x => x.uuid === this.state.uuid);
    let items = [];

    for (const [key, val] of Object.entries(row)) {
      items.push(
        <Form.Item label={key} key={key + val}>
          <Input value={val} />
        </Form.Item>
      )
    }

    return items;
  }

  cardItems = (uuid) => {
    const row = this.state.rowData.find(x => x.uuid === this.state.uuid);
    let items = [];

    for (const key of this.state.keys) {
      items.push(
        <div><strong>{key}</strong>{row[key]}</div>
      )
    }

    return items;
  }

  checkboxItems = () => {
    let keys = [];
    let checkboxItems = [];

    for (const row of this.state.rowData) {
      keys = Array.from(new Set(keys.concat(Object.keys(row))));
    }

    for (const k of keys) {
      checkboxItems.push(
        <Col span={4}><Checkbox value={k}>{k}</Checkbox></Col>
      )
    }
    return checkboxItems;
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
                {/*Left: Content */}
                <Col span={12}>
                  <Card title="项目经历" style={{ minHeight: '500px'}}>
                    {this.state.rowData.find(x => x.uuid === this.state.uuid).content}
                  </Card>
                </Col>
                {/* Right: Focus & Notes */}
                <Col span={12}>
                  <Card title="个人信息" style={{ minHeight: '300px'}}>
                    {this.cardItems(this.state.uuid)}
                  </Card>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="备注">
                      <Input.TextArea value={this.state.note}
                                      onChange={this.handleChange}
                                      style={{ minHeight: '100px'}}/>
                      <Input type="submit" value="保存" />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
          </div>

          {/* Checkbox */}
          <div id="checkbox">
            <Checkbox.Group style={{ width: '100%'}}
                            onChange={this.handleCheckboxOn}>
              <Row>
                {this.checkboxItems()}
              </Row>
            </Checkbox.Group>
          </div>


          {/*Table */}
          <div className="table">
            <Table columns={columnDefs}
                   dataSource={this.state.rowData}
                   rowKey={record => record.uuid}
                   size="small"
                   onRow={(record) => ({
                     onClick: () => {
                       this.setState({uuid: record.uuid})
                     },
                   })}
                   rowClassName={(record) => {
                     return record.uuid === this.state.uuid? 'activate-row': ''
                   }}
            />
          </div>
        </div>
      )
    }
  }
}

export default App