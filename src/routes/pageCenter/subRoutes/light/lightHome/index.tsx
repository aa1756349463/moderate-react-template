import React, { Component } from "react";
import { Modal, message, Button, Form } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./index.scss";
import {
  CommonTable,
  CommonWrapper,
  CommonSearchTable,
} from "@COMMON/components";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import injectInternational from "@COMMON/hocs/intlHoc";
import { injectIntl,WrappedComponentProps } from "react-intl";
import applyConfig from "./config";
import { getPath } from "@ROUTES/index";

interface Props {
  [prop: string]: any;
}

type LightHomePropsT = Props & RouteComponentProps&WrappedComponentProps;

type LightHomeStatesT = {  intlData: any;
  searchItemArr?: any[];
  columns?: any[];
  pageIndex?: number;
  btnInTableConfig?: any[];
  pageSize?: number;
};

@observer
class LightHome extends Component<LightHomePropsT, LightHomeStatesT> {
  constructor(props: LightHomePropsT) {
    super(props);
    applyConfig.call(this);
  }
  selectedRows: any;
  refreshConfig: any;
  componentDidMount() {
    this.refreshConfig();
  }

  componentWillUnmount() {}

  handleTableSelect = ({ selectedRows }: { selectedRows: any[] }) => {
    this.selectedRows = selectedRows.map((item) => {
      return item.lightId;
    });
  };

  handleRefreshPage = (params: any) => {
   
  };

  handlDelete = (params: any) => {
    
  };

  handleSearch = (values: any) => {
    //TODO 查询
  };

  handleTableAddBtnClick = () => {
    const { history, intlData } = this.props;
    history.push(
      getPath("lightAdd", {
        search: `?title=${intlData["light_addTitle"]}`,
      })
    );
  };

  handleTableDeleteBtnClick = () => {
    this.handlDelete(this.selectedRows);
  };

  componentDidUpdate() {
    const { intlData } = this.props;
    if (this.state.intlData !== intlData) {
      this.setState({ intlData }, () => {
        this.refreshConfig();
      });
    }
  }
  render() {
    const {
      form,
      lightHomeStore: { lightArr, pageSum = 5 },
      intlData,
    } = this.props;
    const {
      searchItemArr,
      columns,
      pageIndex,
      btnInTableConfig,
      pageSize = 0,
    } = this.state;
    return (
      <div>
        <CommonWrapper>
          <CommonSearchTable
            dataSource={searchItemArr}
            handleSearch={this.handleSearch}
          />
        </CommonWrapper>
        <CommonWrapper title={intlData["light_listTitle"]}>
          <CommonTable
            btnInTableConfig={btnInTableConfig}
            handleTableSelect={this.handleTableSelect}
            pagination={{
              pageSizeOptions: ["5", "10", "15"],
              current: pageIndex,
              total: pageSum * pageSize,
              pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (current: number, size: number) => {
                this.setState(
                  {
                    pageIndex: 1,
                    pageSize: size,
                  },
                  () => {
                    this.handleRefreshPage({
                      pageIndex: 1,
                      pageSize: size,
                    });
                  }
                );
              },
              onChange: (page: any, pageSize: any) => {
                this.setState({
                  pageIndex: page,
                });
                this.handleRefreshPage({
                  pageIndex: page,
                  pageSize: pageSize,
                });
              },
            }}
            data={toJS(lightArr) || []}
            columns={columns}
          />
        </CommonWrapper>
      </div>
    );
  }
}

export default inject(
  "lightHomeStore",
  "global"
)(injectInternational("light")(LightHome));
