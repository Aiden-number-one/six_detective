import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'dva';
import CanvasBox from './components/CanvasBox';
import ChartIcon from './components/ChartIcon';

@connect(({ chart, loading }) => ({
  charts: chart.charts,
  loading: loading.models.chart,
}))
export default class Dragboard extends Component {
  state = {
    currentPosition: [],
  };

  componentDidMount() {
    // console.log(this.state.currentPosition);
  }

  addPostion = postion => {
    const { currentPosition } = this.state;
    currentPosition.push(postion);
    this.setState({
      currentPosition: [...currentPosition],
    });
  };

  modifyPostion = (index, postion) => {
    const { currentPosition } = this.state;
    const newPosition = [...currentPosition];
    newPosition[index].x = postion.x;
    newPosition[index].y = postion.y;
    this.setState({
      currentPosition: newPosition,
    });
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <ChartIcon />
        <div style={{ width: '100%', height: 500 }}>
          <CanvasBox
            {...this.props}
            height={500}
            charts={this.props.charts}
            currentPosition={this.state.currentPosition}
            addPostion={this.addPostion}
            modifyPostion={this.modifyPostion}
          />
        </div>
      </DndProvider>
    );
  }
}
