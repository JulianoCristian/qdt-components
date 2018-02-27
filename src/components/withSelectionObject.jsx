import React from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';

export default function withListObject(Component) {
  return class extends React.Component {
    static propTypes = {
      qDocPromise: PropTypes.object.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        qObject: null,
        qLayout: null,
        updating: false,
        error: null,
      };
    }

    async componentWillMount() {
      try {
        const { qDocPromise } = this.props;
        const qProp = { qInfo: { qType: 'visualization' }, qSelectionObject: {} };
        const qDoc = await qDocPromise;
        const qObject = await qDoc.createSessionObject(qProp);
        qObject.on('changed', () => { this.update(); });
        this.setState({ qObject }, () => {
          this.update();
        });
      } catch (error) {
        this.setState({ error });
      } finally {
        this.setState({ loading: false });
      }
    }

    async getLayout() {
      const { qObject } = this.state;
      const qLayout = await qObject.getLayout();
      return qLayout;
    } 

    async update() {
      this.setState({ updating: true });
      const qLayout = await this.getLayout();
      this.setState({ updating: false, qLayout });
    }

    render() {
      const {
        qObject, qLayout, error,
      } = this.state;
      if (error) {
        return <div>{error.message}</div>;
      } else if (!qObject || !qLayout) {
        return <div>Loading...</div>;
      }
      return (<Component
        {...this.props}
        {...this.state}
      />);
    }
  };
}