import React from 'react'
import { Row, Col, Checkbox, Input, Card, Button } from 'antd'

export default class ResumeEditor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checkedValues: [],
      content: this.getContent(this.props.uuid),
    }
  }

  // 获取JSON列表中所有的key
  keys = (rowData) => {
    let keys = []

    for (const row of rowData) {
      keys = Array.from(new Set(keys.concat(Object.keys(row))))
    }

    return keys
  }

  getContent = (uuid) => {
    const content = this.getRecordByID(uuid).content
    return (content === undefined) ? '' : content.trim()
  }

  getRecordByID = (uuid) => {
    return this.props.dataSource.find(x => x.uuid === uuid)
  }

  onChange = (e) => {
    this.setState({ content: e.target.value })
  }

  onSubmit = () => {
    this.props.changeContent(this.state.content)
  }

  componentWillReceiveProps (nextProps, nextContent) {
    this.setState({ content: this.getContent(nextProps.uuid) })
  }

  render () {
    const keys = this.keys(this.props.dataSource)
    const record = this.getRecordByID(this.props.uuid)

    const checkboxItems = keys.map((key, index) =>
      <Col span={4}>
        <Checkbox value={key}>{keys[index]}</Checkbox>
      </Col>,
    )

    const cardItems = this.state.checkedValues.map((key, index) =>
      <div>{key}: {record[key]}</div>,
    )

    return (
      <div id="editor-container">
        <Row gutter={16}>
          {/*Left: Content */}
          <Col span={12}>
            <Input.TextArea
              value={this.state.content}
              onChange={this.onChange}
              style={{ minHeight: '450px' }}/>
            <Button onClick={this.onSubmit}>Save</Button>
          </Col>
          <Col span={12}>
            <Card title="个人信息" style={{ minHeight: '500px' }}>
              {cardItems}
            </Card>
          </Col>
        </Row>


        <Checkbox.Group style={{ width: '100%' }}
                        onChange={(checkedValues) => {
                          this.setState({ checkedValues: checkedValues })
                        }}>
          <Row>
            {checkboxItems}
          </Row>
        </Checkbox.Group>
      </div>

    )
  }
}