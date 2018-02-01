import React from 'react';
import ReactDOM from 'react-dom';
import qApp from './qApp';
import qDoc from './qDoc';
import QdtFilter from './components/QdtFilter';
import QdtTable from './components/QdtTable';
import QdtViz from './components/QdtViz';

const components = { QdtFilter, QdtTable, QdtViz };

const QdtComponents = class {
  constructor(config = {}, connections = { vizApi: true, engineApi: true }) {
    this.qAppPromise = (connections.vizApi) ? qApp(config) : null;
    this.qDocPromise = (connections.engineApi) ? qDoc(config) : null;
  }

  render = async (type, props, element) => new Promise((resolve, reject) => {
    try {
      const { qAppPromise, qDocPromise } = this;
      const Component = components[type];
      ReactDOM.render(
        <Component
          {...props}
          qAppPromise={qAppPromise}
          qDocPromise={qDocPromise}
          ref={node => resolve(node)}
        />,
        element,
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default QdtComponents;