import React from 'react';
import columnDefs from './table-config'
import { Table } from 'antd'
import '../style/App.css';

export default class ResumeTable extends React.Component {
  render() {
    return (
      <div id="resume-table">
        <Table columns={columnDefs}
               dataSource={this.props.dataSource}
               rowKey={record => record.uuid}
               size="small"
               onRow={(record) => {
                return {
                  onClick: (event) => {
                    this.props.changeUUID(record.uuid);
                  }}
               }}
               rowClassName={(record) => {
                 return record.uuid === this.props.uuid? 'activate-row': ''
               }}
        />
      </div>
    )
  }
}